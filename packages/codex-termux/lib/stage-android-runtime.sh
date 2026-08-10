#!/bin/sh
set -eu

if [ "$#" -lt 2 ] || [ "$#" -gt 3 ]; then
  echo "usage: $0 <package-root> <android-release-dir> [libc++_shared.so]" >&2
  echo "  stages codex, codex-exec, codex-code-mode-host, and libc++_shared.so" >&2
  exit 2
fi

PACKAGE_ROOT=$1
ANDROID_RELEASE_DIR=$2
LIBCXX_SOURCE=${3:-}

BIN_DIR="$PACKAGE_ROOT/bin"

if [ ! -d "$BIN_DIR" ]; then
  echo "missing package bin dir: $BIN_DIR" >&2
  exit 1
fi

if [ ! -x "$ANDROID_RELEASE_DIR/codex" ]; then
  echo "missing Android codex binary: $ANDROID_RELEASE_DIR/codex" >&2
  exit 1
fi

if [ ! -x "$ANDROID_RELEASE_DIR/codex-exec" ]; then
  echo "missing Android codex-exec binary: $ANDROID_RELEASE_DIR/codex-exec" >&2
  exit 1
fi

if [ ! -x "$ANDROID_RELEASE_DIR/codex-code-mode-host" ]; then
  echo "missing Android codex-code-mode-host binary: $ANDROID_RELEASE_DIR/codex-code-mode-host" >&2
  exit 1
fi

if [ -z "$LIBCXX_SOURCE" ]; then
  if [ -f "$ANDROID_RELEASE_DIR/libc++_shared.so" ]; then
    LIBCXX_SOURCE="$ANDROID_RELEASE_DIR/libc++_shared.so"
  else
    echo "missing libc++_shared.so; pass it as the third argument" >&2
    exit 1
  fi
fi

if [ ! -f "$LIBCXX_SOURCE" ]; then
  echo "missing libc++_shared.so source: $LIBCXX_SOURCE" >&2
  exit 1
fi

cp "$ANDROID_RELEASE_DIR/codex" "$BIN_DIR/codex.bin"
cp "$ANDROID_RELEASE_DIR/codex-exec" "$BIN_DIR/codex-exec.bin"
# codex-code-mode-host is invoked directly by codex.bin via install-context's
# code_mode_host_program() lookup (same directory, exact filename, no .bin
# suffix and no JS-wrapper indirection like codex/codex-exec).
cp "$ANDROID_RELEASE_DIR/codex-code-mode-host" "$BIN_DIR/codex-code-mode-host"
cp "$LIBCXX_SOURCE" "$BIN_DIR/libc++_shared.so"

chmod +x \
  "$BIN_DIR/codex" \
  "$BIN_DIR/codex-exec" \
  "$BIN_DIR/codex.js" \
  "$BIN_DIR/codex-exec.js" \
  "$BIN_DIR/codex.bin" \
  "$BIN_DIR/codex-exec.bin" \
  "$BIN_DIR/codex-code-mode-host"
chmod +x "$BIN_DIR/libc++_shared.so"

echo "staged Android runtime into $BIN_DIR" >&2
