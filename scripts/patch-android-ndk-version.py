#!/usr/bin/env python3

from __future__ import annotations

import argparse
from pathlib import Path
import sys


def patch_android_ndk_version(path: Path, ndk_version: str) -> bool:
    if not path.is_file():
        raise SystemExit(f"not a file: {path}")

    text = path.read_text()
    if "android_ndk_version" in text:
        return False

    crlf = chr(13) + chr(10)
    newline = crlf if crlf in text else chr(10)
    block = (
        f"declare_args() {{{newline}",
        f'  android_ndk_version = "{ndk_version}"{newline}',
        f"}}{newline}{newline}",
    )

    # Insert after copyright header (leading # comment lines and blank lines),
    # but before any GN code. declare_args() must be at top-level scope.
    lines = text.splitlines(keepends=True)
    insert_line = 0
    for i, line in enumerate(lines):
        if line.startswith('#') or line.strip() == '':
            insert_line = i + 1
        else:
            break
    insert_pos = sum(len(l) for l in lines[:insert_line])
    text = text[:insert_pos] + ''.join(block) + text[insert_pos:]

    path.write_text(text, newline="")
    return True


def parse_args() -> argparse.Namespace:
    parser = argparse.ArgumentParser(
        description=(
            "Patch build/config/android/config.gni to declare android_ndk_version when missing."
        )
    )
    parser.add_argument("path", help="Path to config.gni to patch in place.")
    parser.add_argument("ndk_version", help='NDK version string, e.g. "r27".')
    return parser.parse_args()


def main() -> int:
    args = parse_args()
    patched = patch_android_ndk_version(Path(args.path), args.ndk_version)
    if patched:
        print(f"Patched: added android_ndk_version = {args.ndk_version}")
    else:
        print("already present - skipping")
    return 0


if __name__ == "__main__":
    sys.exit(main())
