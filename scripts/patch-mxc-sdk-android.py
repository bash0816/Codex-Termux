#!/usr/bin/env python3
"""Move mxc-sdk from [dependencies] to [target.'cfg(windows)'.dependencies] in codex-mxc-sandbox Cargo.toml for Android builds.

Usage: patch-mxc-sdk-android.py <path/to/codex-mxc-sandbox/Cargo.toml>

Idempotent: exits 0 with "already patched" when the change is already applied.
"""
import copy
import sys
from pathlib import Path

import tomllib

MXC_LINE = "mxc-sdk = { workspace = true }"
WINDOWS_HEADER = "[target.'cfg(windows)'.dependencies]"
MXC_VALUE = {"workspace": True}


def line_text(line: str) -> str:
    return line.rstrip("\r\n")


def verify(before: dict, after: dict) -> None:
    before_deps = before.get("dependencies", {})
    after_deps = after.get("dependencies", {})
    before_win = before["target"]["cfg(windows)"]["dependencies"]
    after_win = after["target"]["cfg(windows)"]["dependencies"]

    # (1) mxc-sdk is no longer in [dependencies]
    if "mxc-sdk" in after_deps:
        raise AssertionError("mxc-sdk is still in [dependencies]")
    # (2) mxc-sdk is in the Windows block with the workspace value
    if after_win.get("mxc-sdk") != MXC_VALUE:
        raise AssertionError(f"cfg(windows) mxc-sdk is {after_win.get('mxc-sdk')!r}")
    # (3) everything else is unchanged
    expected_deps = {k: v for k, v in before_deps.items() if k != "mxc-sdk"}
    if expected_deps != after_deps:
        raise AssertionError("[dependencies] changed beyond mxc-sdk")
    expected_win = dict(before_win)
    expected_win["mxc-sdk"] = MXC_VALUE
    if expected_win != after_win:
        raise AssertionError("[target.'cfg(windows)'.dependencies] changed beyond mxc-sdk")
    expected = copy.deepcopy(before)
    expected["dependencies"] = expected_deps
    expected["target"]["cfg(windows)"]["dependencies"] = expected_win
    if expected != after:
        raise AssertionError("other keys changed")


def main() -> int:
    if len(sys.argv) != 2:
        print(f"usage: {sys.argv[0]} <path-to-Cargo.toml>", file=sys.stderr)
        return 1

    path = Path(sys.argv[1])
    with path.open(encoding="utf-8", newline="") as f:
        text = f.read()
    lines = text.splitlines(keepends=True)

    mxc_idx = [i for i, line in enumerate(lines) if line_text(line) == MXC_LINE]
    header_idx = [i for i, line in enumerate(lines) if line_text(line) == WINDOWS_HEADER]
    if len(mxc_idx) != 1 or len(header_idx) != 1:
        print(
            f"mxc patch anchor mismatch: {MXC_LINE!r} count={len(mxc_idx)} (expected 1), "
            f"{WINDOWS_HEADER!r} count={len(header_idx)} (expected 1)",
            file=sys.stderr,
        )
        return 1

    try:
        before = tomllib.loads(text)
    except tomllib.TOMLDecodeError as exc:
        print(f"ERROR: failed to parse {path}: {exc}", file=sys.stderr)
        return 1

    deps = before.get("dependencies", {})
    win_deps = before.get("target", {}).get("cfg(windows)", {}).get("dependencies", {})

    if "mxc-sdk" not in deps and win_deps.get("mxc-sdk") == MXC_VALUE:
        print(f"already patched: {path}")
        return 0

    if "mxc-sdk" not in deps or "mxc-sdk" in win_deps:
        print(
            f"ERROR: unexpected mxc-sdk state in {path}: "
            f"in [dependencies]={'mxc-sdk' in deps}, "
            f"in cfg(windows) dependencies={'mxc-sdk' in win_deps}",
            file=sys.stderr,
        )
        return 1

    # Build the new text: drop the mxc-sdk line, then insert it right after the Windows header.
    mxc_line = lines[mxc_idx[0]]
    if not mxc_line.endswith("\n"):
        mxc_line += "\n"
    new_lines = lines[:]
    del new_lines[mxc_idx[0]]
    h = next(i for i, line in enumerate(new_lines) if line_text(line) == WINDOWS_HEADER)
    if not new_lines[h].endswith("\n"):
        new_lines[h] += "\n"
    new_lines.insert(h + 1, mxc_line)
    new_text = "".join(new_lines)

    try:
        verify(before, tomllib.loads(new_text))
    except AssertionError as exc:
        print(f"ERROR: verification failed before writing {path}: {exc}", file=sys.stderr)
        return 1

    with path.open("w", encoding="utf-8", newline="") as f:
        f.write(new_text)

    try:
        verify(before, tomllib.loads(path.read_text(encoding="utf-8")))
    except AssertionError as exc:
        print(f"ERROR: verification failed after writing {path}: {exc}", file=sys.stderr)
        return 1

    print(f"patched: mxc-sdk moved to [target.'cfg(windows)'.dependencies] in {path}")
    return 0


if __name__ == "__main__":
    sys.exit(main())
