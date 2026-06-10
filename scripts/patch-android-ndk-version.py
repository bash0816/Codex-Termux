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

    import_index = text.find("import ")
    if import_index >= 0:
        text = f"{text[:import_index]}{''.join(block)}{text[import_index:]}"
    else:
        text = f"{''.join(block)}{text}"

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
