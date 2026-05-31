#!/usr/bin/env python3
"""Patch filter_clang_args.py to strip host x64 flags for Android cross bindgen."""
import sys
import os

def main():
    path = sys.argv[1]
    s = open(path).read()

    if "CHROMIUM_BINDGEN_STRIP_HOST_X64_FLAGS_FOR_ANDROID" in s:
        print(f"{path}: already patched")
        return

    # Add import os after import argparse
    if "import os\n" not in s:
        s = s.replace("import argparse\n", "import argparse\nimport os\n")

    # Insert strip logic at top of do_filter
    old = "  def do_filter(args):\n    i = 0\n    while i < len(args):\n"
    new = (
        "  def do_filter(args):\n"
        "    strip = os.environ.get('CHROMIUM_BINDGEN_STRIP_HOST_X64_FLAGS_FOR_ANDROID') == '1'\n"
        "    i = 0\n"
        "    while i < len(args):\n"
        "      if strip and args[i] in ('--target=x86_64-unknown-linux-gnu', '-msse3', '-m64'):\n"
        "        i += 1\n"
        "        continue\n"
    )
    if old not in s:
        print(f"ERROR: expected pattern not found in {path}", file=sys.stderr)
        sys.exit(1)

    s = s.replace(old, new)
    open(path, "w").write(s)
    print(f"{path}: patched successfully")

if __name__ == "__main__":
    main()
