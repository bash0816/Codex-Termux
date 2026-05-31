#!/usr/bin/env python3

from __future__ import annotations

import argparse
from pathlib import Path
import sys


STRIP_ENV = "CHROMIUM_BINDGEN_STRIP_HOST_X64_FLAGS_FOR_ANDROID"


def patch_bindgen_filter(path: Path) -> bool:
    text = path.read_text()
    if STRIP_ENV in text:
        return False

    newline = "\r\n" if "\r\n" in text else "\n"
    lines = text.splitlines(keepends=True)
    changed = False

    if not any(line.lstrip().startswith("import os") for line in lines):
        for index, line in enumerate(lines):
            if line.lstrip().startswith("import "):
                lines.insert(index + 1, f"import os{newline}")
                changed = True
                break
        else:
            raise SystemExit(f"no import statement found in {path}")
        text = "".join(lines)

    target = (
        f"def do_filter(args):{newline}"
        f"    i = 0{newline}"
        f"    while i < len(args):{newline}"
    )
    replacement = (
        f"def do_filter(args):{newline}"
        f"    strip = os.environ.get(\"{STRIP_ENV}\") == \"1\"{newline}"
        f"    i = 0{newline}"
        f"    while i < len(args):{newline}"
        f"        if strip and args[i] in (\"--target=x86_64-unknown-linux-gnu\", \"-msse3\", \"-m64\"):{newline}"
        f"            i += 1{newline}"
        f"            continue{newline}"
    )

    if target not in text:
        raise SystemExit(f"target do_filter block not found in {path}")

    text = text.replace(target, replacement, 1)
    path.write_text(text, newline="")
    return True


def parse_args() -> argparse.Namespace:
    parser = argparse.ArgumentParser(
        description=(
            "Patch a bindgen filter script with import os and Android host-x64 stripping logic."
        )
    )
    parser.add_argument("path", help="Path to the Python file to patch in place.")
    return parser.parse_args()


def main() -> int:
    args = parse_args()
    patched = patch_bindgen_filter(Path(args.path))
    if patched:
        print(f"patched: {args.path}")
    else:
        print(f"unchanged: {args.path}")
    return 0


if __name__ == "__main__":
    sys.exit(main())
