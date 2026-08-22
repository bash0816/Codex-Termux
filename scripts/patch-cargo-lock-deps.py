#!/usr/bin/env python3
"""Directly edit Cargo.lock to add specific dependency entries without a full
`cargo generate-lockfile` re-resolve, which can drift pinned versions of
unrelated crates (e.g. rama-* alpha pins jumping to newer stable releases
that require a newer rustc than the Android build environment has).

Applies exactly two deltas needed for the Android vendored-OpenSSL patches:
  - codex-http-client gains a dependency on openssl-sys
  - codex-thread-store gains a dependency on libc

Each insertion requires that exactly one matching [[package]] block exists;
otherwise it fails closed (raises) rather than silently editing the wrong
block or doing nothing.
"""
import re
import sys


def insert_dependency(lockfile_text, pkg_name, pkg_version, new_dep):
    block_re = re.compile(
        r'(name = "' + re.escape(pkg_name) + r'"\nversion = "' + re.escape(pkg_version) + r'"\n)'
        r'((?:(?!\[\[package\]\])[^\n]*\n)*?)'
        r'(dependencies = \[\n)((?:\s*"[^"]+",?\n)*)(\]\n)'
    )
    matches = list(block_re.finditer(lockfile_text))
    if len(matches) != 1:
        raise ValueError(
            f"expected exactly one package block for {pkg_name} {pkg_version}, found {len(matches)}"
        )
    match = matches[0]
    deps_block = match.group(4)
    dep_lines = [l for l in deps_block.split('\n') if l.strip()]
    dep_names = []
    for l in dep_lines:
        m = re.match(r'\s*"([^"]+)",?\s*$', l)
        if not m:
            raise ValueError(f"unexpected dependency line format: {l!r}")
        dep_names.append(m.group(1))
    if new_dep in dep_names:
        raise ValueError(f"dependency already present: {new_dep}")
    sorted_names = sorted(dep_names + [new_dep])
    idx = sorted_names.index(new_dep)
    new_lines = dep_lines[:idx] + [f' "{new_dep}",'] + dep_lines[idx:]
    new_deps_block = '\n'.join(new_lines) + '\n'
    return lockfile_text[:match.start(4)] + new_deps_block + lockfile_text[match.end(4):]


def main():
    if len(sys.argv) != 2:
        print(f"usage: {sys.argv[0]} <path-to-Cargo.lock>", file=sys.stderr)
        sys.exit(1)
    path = sys.argv[1]
    with open(path, 'r', encoding='utf-8') as f:
        text = f.read()

    text = insert_dependency(text, 'codex-http-client', '0.0.0', 'openssl-sys')
    text = insert_dependency(text, 'codex-thread-store', '0.0.0', 'libc')

    with open(path, 'w', encoding='utf-8') as f:
        f.write(text)

    print(f"Cargo.lock patched: codex-http-client+openssl-sys, codex-thread-store+libc ({path})")


if __name__ == '__main__':
    main()
