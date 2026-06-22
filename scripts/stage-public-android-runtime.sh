#!/bin/sh
set -eu

usage() {
  code=${1:-2}
  echo "usage: $0 --artifact-dir DIR --source-repository REPO --source-ref REF --source-sha SHA [--package-root DIR]" >&2
  exit "$code"
}

fail() {
  echo "$1" >&2
  exit "$2"
}

ARTIFACT_DIR=
SOURCE_REPOSITORY=
SOURCE_REF=
SOURCE_SHA=
# shellcheck disable=SC1007
SCRIPT_DIR=$(CDPATH= cd -- "$(dirname -- "$0")" && pwd)
# shellcheck disable=SC1007
REPO_ROOT=$(CDPATH= cd -- "$SCRIPT_DIR/.." && pwd)
PACKAGE_ROOT="$REPO_ROOT/packages/codex-termux"

while [ "$#" -gt 0 ]; do
  case $1 in
    --artifact-dir)
      [ "$#" -ge 2 ] || usage
      ARTIFACT_DIR=$2
      shift 2
      ;;
    --source-repository)
      [ "$#" -ge 2 ] || usage
      SOURCE_REPOSITORY=$2
      shift 2
      ;;
    --source-ref)
      [ "$#" -ge 2 ] || usage
      SOURCE_REF=$2
      shift 2
      ;;
    --source-sha)
      [ "$#" -ge 2 ] || usage
      SOURCE_SHA=$2
      shift 2
      ;;
    --package-root)
      [ "$#" -ge 2 ] || usage
      PACKAGE_ROOT=$2
      shift 2
      ;;
    -h|--help)
      usage 0
      ;;
    *)
      usage
      ;;
  esac
done

: "${ARTIFACT_DIR:?missing --artifact-dir}"
: "${SOURCE_REPOSITORY:?missing --source-repository}"
: "${SOURCE_REF:?missing --source-ref}"
: "${SOURCE_SHA:?missing --source-sha}"

BIN_DIR="$PACKAGE_ROOT/bin"
STAGE_HELPER="$PACKAGE_ROOT/lib/stage-android-runtime.sh"
TEMP_RUNTIME_DIR=
TMP_BASE="${TMPDIR:-}"
if [ -z "$TMP_BASE" ]; then
  if [ -d /data/data/com.termux/files/usr/tmp ]; then
    TMP_BASE=/data/data/com.termux/files/usr/tmp
  else
    TMP_BASE=/tmp
  fi
fi
STAGED=0

if [ ! -d "$BIN_DIR" ]; then
  fail "missing package bin dir: $BIN_DIR" 1
fi

if [ ! -x "$STAGE_HELPER" ]; then
  fail "missing stage helper: $STAGE_HELPER" 1
fi

for staged in "$BIN_DIR/codex.bin" "$BIN_DIR/codex-exec.bin" "$BIN_DIR/libc++_shared.so"; do
  if [ -e "$staged" ]; then
    fail "pre-existing staged file: $staged" 1
  fi
done

for required in manifest.json sha256sums.txt codex codex-exec libc++_shared.so; do
  if [ ! -e "$ARTIFACT_DIR/$required" ]; then
    fail "missing artifact: $ARTIFACT_DIR/$required" 1
  fi
done

if ! node -e '
const fs = require("fs");
const path = require("path");
const crypto = require("crypto");

const artifactDir = process.argv[1];
const manifestPath = path.join(artifactDir, "manifest.json");
const checksumsPath = path.join(artifactDir, "sha256sums.txt");
const expectedRepository = process.argv[2];
const expectedRef = process.argv[3];
const expectedSha = process.argv[4];

function fail(message) {
  console.error(message);
  process.exit(1);
}

const manifest = JSON.parse(fs.readFileSync(manifestPath, "utf8"));
if (manifest.source?.repository !== expectedRepository) fail("bad source.repository");
if (manifest.source?.ref !== expectedRef) fail("bad source.ref");
if (manifest.source?.sha !== expectedSha) fail("bad source.sha");

const expectedFiles = ["codex", "codex-exec", "libc++_shared.so"];
if (!Array.isArray(manifest.artifacts?.files)) fail("missing artifacts.files");
for (const name of expectedFiles) {
  if (!manifest.artifacts.files.includes(name)) fail("missing artifact file: " + name);
}

const seenFiles = new Set();
for (const line of fs.readFileSync(checksumsPath, "utf8").trim().split(/\r?\n/)) {
  const match = line.match(/^([0-9a-f]{64})\s+(.+)$/i);
  if (!match) fail("bad sha256sums line: " + line);
  const expected = match[1].toLowerCase();
  const filename = path.basename(match[2]);
  if (!expectedFiles.includes(filename)) continue;
  seenFiles.add(filename);
  const actual = crypto.createHash("sha256")
    .update(fs.readFileSync(path.join(artifactDir, filename)))
    .digest("hex");
  if (actual !== expected) fail("checksum mismatch: " + filename);
}

for (const name of expectedFiles) {
  if (!seenFiles.has(name)) fail("missing sha256 entry: " + name);
}
' "$ARTIFACT_DIR" "$SOURCE_REPOSITORY" "$SOURCE_REF" "$SOURCE_SHA"; then
  fail "provenance verification failed" 11
fi

TEMP_RUNTIME_DIR=$(mktemp -d "$TMP_BASE/codex-termux-public-stage.XXXXXX")
cleanup() {
  if [ "$STAGED" -eq 0 ]; then
    rm -f "$BIN_DIR/codex.bin" "$BIN_DIR/codex-exec.bin" "$BIN_DIR/libc++_shared.so"
  fi
  rm -rf "$TEMP_RUNTIME_DIR"
}
trap cleanup EXIT INT TERM

cp "$ARTIFACT_DIR/codex" "$TEMP_RUNTIME_DIR/codex"
cp "$ARTIFACT_DIR/codex-exec" "$TEMP_RUNTIME_DIR/codex-exec"
cp "$ARTIFACT_DIR/libc++_shared.so" "$TEMP_RUNTIME_DIR/libc++_shared.so"
chmod +x "$TEMP_RUNTIME_DIR/codex" "$TEMP_RUNTIME_DIR/codex-exec"

if ! "$STAGE_HELPER" "$PACKAGE_ROOT" "$TEMP_RUNTIME_DIR" "$TEMP_RUNTIME_DIR/libc++_shared.so"; then
  fail "stage helper failed" 12
fi

ARTIFACT_CODEX_SHA=$(sha256sum "$ARTIFACT_DIR/codex" | awk '{print $1}')
ARTIFACT_EXEC_SHA=$(sha256sum "$ARTIFACT_DIR/codex-exec" | awk '{print $1}')
ARTIFACT_LIBCXX_SHA=$(sha256sum "$ARTIFACT_DIR/libc++_shared.so" | awk '{print $1}')
STAGED_CODEX_SHA=$(sha256sum "$BIN_DIR/codex.bin" | awk '{print $1}')
STAGED_EXEC_SHA=$(sha256sum "$BIN_DIR/codex-exec.bin" | awk '{print $1}')
STAGED_LIBCXX_SHA=$(sha256sum "$BIN_DIR/libc++_shared.so" | awk '{print $1}')

[ "$ARTIFACT_CODEX_SHA" = "$STAGED_CODEX_SHA" ] || fail "staged codex checksum mismatch" 12
[ "$ARTIFACT_EXEC_SHA" = "$STAGED_EXEC_SHA" ] || fail "staged codex-exec checksum mismatch" 12
[ "$ARTIFACT_LIBCXX_SHA" = "$STAGED_LIBCXX_SHA" ] || fail "staged libc++_shared.so checksum mismatch" 12

STAGED=1

# Copy license compliance files from artifact into package (skip if not present)
LICENSE_DIR="$PACKAGE_ROOT/THIRD-PARTY-LICENSES"
if [ -f "$ARTIFACT_DIR/PATCHES.md" ]; then
  mkdir -p "$LICENSE_DIR"
  cp "$ARTIFACT_DIR/PATCHES.md"               "$LICENSE_DIR/PATCHES.md"
  cp "$ARTIFACT_DIR/LLVM-LICENSE.TXT"         "$LICENSE_DIR/LLVM-LICENSE.TXT"
  cp "$ARTIFACT_DIR/dependency-licenses.json" "$LICENSE_DIR/dependency-licenses.json"
fi

echo "staged public Android runtime into $BIN_DIR" >&2
