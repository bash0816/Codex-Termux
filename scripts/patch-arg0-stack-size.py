#!/usr/bin/env python3
"""Apply the existing Android arg0 thread stack size patch."""
import pathlib
import sys

OLD = 'const TOKIO_WORKER_STACK_SIZE_BYTES: usize = 16 * 1024 * 1024;'
NEW = ('#[cfg(not(target_os = "android"))]\n'
       'const TOKIO_WORKER_STACK_SIZE_BYTES: usize = 16 * 1024 * 1024;\n'
       '#[cfg(target_os = "android")]\n'
       'const TOKIO_WORKER_STACK_SIZE_BYTES: usize = 8 * 1024 * 1024; // pthread_create fails with 16 MiB on Android')

def apply(text):
    if NEW in text:
        return text, 2
    if OLD in text:
        return text.replace(OLD, NEW, 1), 0
    return text, 2

def main():
    if len(sys.argv) != 2:
        print(f"usage: {sys.argv[0]} ARG0_LIB_RS", file=sys.stderr)
        return 1
    path = pathlib.Path(sys.argv[1])
    try:
        text = path.read_text(encoding="utf-8")
    except (OSError, UnicodeError) as exc:
        print(f"ERROR: cannot read {path}: {exc}", file=sys.stderr)
        return 1
    result, status = apply(text)
    if status == 0:
        try:
            path.write_text(result, encoding="utf-8")
        except OSError as exc:
            print(f"ERROR: cannot write {path}: {exc}", file=sys.stderr)
            return 1
        print("Applied Android stack size patch to arg0/src/lib.rs")
    elif NEW in text:
        print("Stack size patch already applied — skipping")
    else:
        print("TOKIO_WORKER_STACK_SIZE_BYTES not found — skipping (may not apply to this version)")
    return status

if __name__ == "__main__":
    raise SystemExit(main())
