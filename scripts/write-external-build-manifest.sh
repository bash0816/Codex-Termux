#!/bin/sh
set -eu

if [ "$#" -ne 1 ]; then
  echo "usage: $0 <bundle-dir>" >&2
  exit 2
fi

BUNDLE_DIR=$1

for required in codex codex-exec libc++_shared.so; do
  if [ ! -f "$BUNDLE_DIR/$required" ]; then
    echo "missing bundle artifact: $BUNDLE_DIR/$required" >&2
    exit 1
  fi
done

: "${SOURCE_REPOSITORY:?missing SOURCE_REPOSITORY}"
: "${SOURCE_REPOSITORY_INPUT:?missing SOURCE_REPOSITORY_INPUT}"
: "${SOURCE_REF_INPUT:?missing SOURCE_REF_INPUT}"
: "${SOURCE_SHA:?missing SOURCE_SHA}"
: "${HOST_REPOSITORY:?missing HOST_REPOSITORY}"
: "${HOST_REF:?missing HOST_REF}"
: "${HOST_SHA:?missing HOST_SHA}"
: "${WORKFLOW_RUN_ID:?missing WORKFLOW_RUN_ID}"
: "${WORKFLOW_RUN_ATTEMPT:?missing WORKFLOW_RUN_ATTEMPT}"
: "${WORKFLOW_NAME:?missing WORKFLOW_NAME}"
: "${BUILD_TIMESTAMP_UTC:?missing BUILD_TIMESTAMP_UTC}"
: "${RUST_VERSION:?missing RUST_VERSION}"
: "${ANDROID_NDK_REVISION:?missing ANDROID_NDK_REVISION}"
: "${ANDROID_NDK_ARCHIVE_URL:?missing ANDROID_NDK_ARCHIVE_URL}"
: "${ANDROID_NDK_ARCHIVE_SIZE:?missing ANDROID_NDK_ARCHIVE_SIZE}"
: "${ANDROID_NDK_ARCHIVE_SHA256:?missing ANDROID_NDK_ARCHIVE_SHA256}"
: "${V8_ARTIFACT_MODE:?missing V8_ARTIFACT_MODE}"
: "${V8_ARTIFACT_SOURCE:?missing V8_ARTIFACT_SOURCE}"

CODEX_SHA256=$(sha256sum "$BUNDLE_DIR/codex" | awk '{print $1}')
CODEX_EXEC_SHA256=$(sha256sum "$BUNDLE_DIR/codex-exec" | awk '{print $1}')
LIBCXX_SHA256=$(sha256sum "$BUNDLE_DIR/libc++_shared.so" | awk '{print $1}')

MANIFEST_PATH="$BUNDLE_DIR/manifest.json"
WORKFLOW_NAME="$WORKFLOW_NAME" \
CODEX_SHA256="$CODEX_SHA256" \
CODEX_EXEC_SHA256="$CODEX_EXEC_SHA256" \
LIBCXX_SHA256="$LIBCXX_SHA256" \
python3 - "$MANIFEST_PATH" <<'PY'
import json
import os
import sys

manifest_path = sys.argv[1]

payload = {
    "schema_version": 1,
    "workflow": {
        "name": os.environ["WORKFLOW_NAME"],
        "run_id": os.environ["WORKFLOW_RUN_ID"],
        "run_attempt": os.environ["WORKFLOW_RUN_ATTEMPT"],
        "runner": "ubuntu-22.04",
    },
    "source": {
        "repository": os.environ["SOURCE_REPOSITORY_INPUT"],
        "ref": os.environ["SOURCE_REF_INPUT"],
        "sha": os.environ["SOURCE_SHA"],
        "host_repository": os.environ["HOST_REPOSITORY"],
        "host_ref": os.environ["HOST_REF"],
        "host_sha": os.environ["HOST_SHA"],
        "source_ref_input": os.environ["SOURCE_REF_INPUT"],
    },
    "toolchain": {
        "rust_version": os.environ["RUST_VERSION"],
        "android_ndk_revision": os.environ["ANDROID_NDK_REVISION"],
        "android_ndk_archive": {
            "url": os.environ["ANDROID_NDK_ARCHIVE_URL"],
            "size": os.environ["ANDROID_NDK_ARCHIVE_SIZE"],
            "sha256": os.environ["ANDROID_NDK_ARCHIVE_SHA256"],
        },
        "v8_artifact": {
            "mode": os.environ["V8_ARTIFACT_MODE"],
            "source": os.environ["V8_ARTIFACT_SOURCE"],
        },
        "target": "aarch64-linux-android",
    },
    "artifacts": {
        "files": [
            "codex",
            "codex-exec",
            "libc++_shared.so",
        ],
        "sha256": {
            "codex": os.environ["CODEX_SHA256"],
            "codex-exec": os.environ["CODEX_EXEC_SHA256"],
            "libc++_shared.so": os.environ["LIBCXX_SHA256"],
        },
    },
    "build": {
        "timestamp_utc": os.environ["BUILD_TIMESTAMP_UTC"],
    },
}

rusty_v8_release_tag = os.environ.get("RUSTY_V8_RELEASE_TAG", "")
if rusty_v8_release_tag:
    payload["toolchain"]["v8_artifact"]["release_tag"] = rusty_v8_release_tag
    payload["toolchain"]["rusty_v8_release_tag"] = rusty_v8_release_tag

with open(manifest_path, "w", encoding="utf-8") as fh:
    json.dump(payload, fh, indent=2, sort_keys=False)
    fh.write("\n")
PY

sha256sum \
  "$BUNDLE_DIR/codex" \
  "$BUNDLE_DIR/codex-exec" \
  "$BUNDLE_DIR/libc++_shared.so" \
  "$BUNDLE_DIR/manifest.json" \
  > "$BUNDLE_DIR/sha256sums.txt"
