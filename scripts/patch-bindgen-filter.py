#!/usr/bin/env python3

from __future__ import annotations

import argparse
from pathlib import Path
import sys


def patch_bindgen_filter(path: Path) -> bool:
    text = path.read_text()
    lines = text.splitlines(keepends=True)

    if any(line.lstrip().startswith("import os") for line in lines):
        return False

    newline = "\r\n" if any(line.endswith("\r\n") for line in lines) else "\n"

    for index, line in enumerate(lines):
        if line.lstrip().startswith("import "):
            lines.insert(index + 1, f"import os{newline}")
            path.write_text("".join(lines), newline="")
            return True

    raise SystemExit(f"no import statement found in {path}")


def parse_args() -> argparse.Namespace:
    parser = argparse.ArgumentParser(
        description="Insert import os after the first import line in a bindgen filter script."
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
