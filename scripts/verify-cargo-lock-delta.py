#!/usr/bin/env python3
"""Verify that `cargo fetch` (run without --locked, to let Cargo compute the
minimal set of Cargo.lock changes needed after our Cargo.toml patches) only
changed what we expect, before we go back to --locked for the rest of the
build.

This exists because a full `cargo generate-lockfile` was drifting pinned
alpha versions of unrelated crates (rama-*) to newer stable releases that
require a newer rustc than the Android build environment has. Using
`cargo fetch` avoids a full re-resolve, but its result still needs to be
checked: it's expected to change only two things relative to the pre-patch
Cargo.lock:

  1. Every local workspace member (no `source` field, i.e. a path
     dependency) has its `version` bumped, uniformly, to match
     `[workspace.package].version` in the patched Cargo.toml (harmless
     metadata; local packages aren't published so this doesn't affect
     dependency resolution).
  2. `codex-http-client` gains a dependency on `openssl-sys`, and
     `codex-thread-store` gains a dependency on `libc` (these are the
     lockfile-side effects of Cargo.toml patches applied earlier in the
     workflow that add Android-only vendored-OpenSSL / real-flock
     dependencies).

Everything else must be byte-for-byte identical, with one narrow exception:
`windows-registry` (a Windows-only crate not needed for the
aarch64-linux-android target) is allowed to fully disappear when `cargo
fetch --target aarch64-linux-android` prunes target-irrelevant packages.

Any other addition, removal, or version/dependency change --- most
importantly to any `rama-*` crate --- is treated as fail-closed: the check
raises/exits non-zero rather than silently accepting an unexpected delta.
"""
import os
import sys
import tomllib
from collections import Counter

ALLOWED_FULL_REMOVALS = {
    ("windows-registry", "registry+https://github.com/rust-lang/crates.io-index"): frozenset({"0.6.1"}),
}
EXPECTED_LOCAL_DEPENDENCY_ADDITIONS = {
    "codex-http-client": {"openssl-sys"},
    "codex-thread-store": {"libc"},
}


def normalize_entry(p):
    items = []
    for k, v in p.items():
        if k == 'dependencies':
            v = tuple(sorted(Counter(v).items()))
        items.append((k, v))
    return tuple(sorted(items))


def check(before, after, expected_workspace_version):
    def pkey(p):
        return (p['name'], p.get('source'))

    before_by_key = {}
    for p in before['package']:
        before_by_key.setdefault(pkey(p), []).append(p)
    after_by_key = {}
    for p in after['package']:
        after_by_key.setdefault(pkey(p), []).append(p)

    all_keys = set(before_by_key) | set(after_by_key)
    for k in all_keys:
        name, source = k
        b_list = before_by_key.get(k, [])
        a_list = after_by_key.get(k, [])

        if source is not None:
            b_norm = Counter(normalize_entry(p) for p in b_list)
            a_norm = Counter(normalize_entry(p) for p in a_list)
            if b_norm == a_norm:
                continue
            if not a_list:
                b_versions = frozenset(p['version'] for p in b_list)
                allowed_versions = ALLOWED_FULL_REMOVALS.get((name, source))
                if allowed_versions is not None and b_versions == allowed_versions:
                    continue
                return (
                    f"ERROR: external package {name} (source={source}) fully disappeared "
                    f"with versions {sorted(b_versions)}, not an allowed exact-version removal"
                )
            return f"ERROR: external package {name} (source={source}) entries changed"
        else:
            if len(b_list) != 1 or len(a_list) != 1:
                return (
                    f"ERROR: local package {name} has unexpected duplicate/missing entries: "
                    f"before={len(b_list)} after={len(a_list)}"
                )
            bp, ap = b_list[0], a_list[0]
            if ap.get('version') != expected_workspace_version:
                return (
                    f"ERROR: local package {name} version {ap.get('version')!r} does not match "
                    f"expected workspace version {expected_workspace_version!r}"
                )
            b_rest = {kk: vv for kk, vv in bp.items() if kk not in ('version', 'dependencies')}
            a_rest = {kk: vv for kk, vv in ap.items() if kk not in ('version', 'dependencies')}
            if b_rest != a_rest:
                return f"ERROR: local package {name} non-version/dependencies fields changed"
            b_deps = Counter(bp.get('dependencies', []))
            a_deps = Counter(ap.get('dependencies', []))
            if b_deps == a_deps:
                continue
            added = a_deps - b_deps
            removed = b_deps - a_deps
            allowed_additions = EXPECTED_LOCAL_DEPENDENCY_ADDITIONS.get(name, set())
            for dep, cnt in added.items():
                if dep not in allowed_additions or cnt != 1:
                    return f"ERROR: local package {name} gained unexpected dependency: {dep} x{cnt}"
            if removed:
                return f"ERROR: local package {name} lost dependencies: {dict(removed)}"

    return None


def main():
    if len(sys.argv) != 3:
        print(f"usage: {sys.argv[0]} <before-lockfile> <after-lockfile>", file=sys.stderr)
        sys.exit(1)
    before_path, after_path = sys.argv[1], sys.argv[2]

    with open(before_path, 'rb') as f:
        before = tomllib.load(f)
    with open(after_path, 'rb') as f:
        after = tomllib.load(f)

    expected_version = os.environ.get('WORKSPACE_VERSION')
    if not expected_version:
        print("ERROR: WORKSPACE_VERSION environment variable is required", file=sys.stderr)
        sys.exit(1)

    err = check(before, after, expected_version)
    if err:
        print(err, file=sys.stderr)
        sys.exit(1)
    print(
        "Cargo.lock verified: only the two expected local dependency additions and the "
        "uniform workspace version bump were applied; all external packages unchanged "
        "except the whitelisted target-specific removal"
    )


if __name__ == '__main__':
    main()
