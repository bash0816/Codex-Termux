#!/usr/bin/env python3
"""Patch filter_clang_args.py for Android cross bindgen."""
import sys
from pathlib import Path

STRIP_ENV = "CHROMIUM_BINDGEN_STRIP_HOST_X64_FLAGS_FOR_ANDROID"

# Actual filter_clang_args.py uses 2-space indent (nested function)
OLD = (
    "  def do_filter(args):\n"
    "    i = 0\n"
    "    while i < len(args):\n"
)
NEW = (
    "  def do_filter(args):\n"
    "    strip = os.environ.get(\"" + STRIP_ENV + "\") == \"1\"\n"
    "    i = 0\n"
    "    while i < len(args):\n"
    "      if strip and args[i] in (\"--target=x86_64-unknown-linux-gnu\", \"-msse3\", \"-m64\"):\n"
    "        i += 1\n"
    "        continue\n"
)

def main():
    path = Path(sys.argv[1])
    text = path.read_text()

    if STRIP_ENV in text:
        print(f"unchanged: {path}")
        return

    if OLD not in text:
        print(f"ERROR: expected do_filter pattern not found in {path}", file=sys.stderr)
        sys.exit(1)

    # Add import os at top if missing
    if "import os\n" not in text:
        text = "import os\n" + text

    text = text.replace(OLD, NEW, 1)
    path.write_text(text)
    print(f"patched: {path}")

if __name__ == "__main__":
    main()
