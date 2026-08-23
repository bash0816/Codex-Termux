#!/usr/bin/env python3
"""Verify that `cargo fetch` (run without --locked, to let Cargo compute the
minimal set of Cargo.lock changes needed after our Cargo.toml patches) only
changed what we expect, before we go back to --locked for the rest of the
build.

This exists because a full `cargo generate-lockfile` was drifting pinned
alpha versions of unrelated crates (rama-*) to newer stable releases that
require a newer rustc than the Android build environment has. Using
`cargo fetch` avoids a full re-resolve, but its result still needs to be
checked.

Design note (2026-08-23): an earlier version of this script compared each
external package's *entire* lockfile entry, including its `dependencies`
edge list, and only allowed `windows-registry` to fully vanish. That failed
in CI: the reqwest TLS patch (`default-features = false`) deactivates
optional features transitively, which prunes dependency edges (e.g.
`hyper-util` losing its `system-configuration` / `windows-registry` edges,
`reqwest` losing `encoding_rs` / `mime`) from *many* packages, not just
`windows-registry` itself. Verified experimentally (both with and without
`--target`) that this is a pure function of the feature graph, unrelated to
Android target pruning: platform-independent crates like `mime` and
`encoding_rs` were pruned too, which a target-pruning theory cannot explain.

Since each external package's content is already pinned by
`(name, version, source, checksum)`, its dependency edge list carries no
additional drift information once version+checksum are fixed -- it's fully
determined by the feature graph, which is expected to shift as Cargo.toml
patches change feature flags. So this script does NOT compare dependency
edges for external packages at all. It only checks:

  1. For any external `(name, source, version)` present in both the
     pre-fetch and post-fetch lockfile, the `checksum` must be identical
     (catches tampering / registry corruption, not legitimate re-resolution).
  2. `rama-*` crates get an extra, explicit safety net: the full
     `(name, version, source)` set must be identical before and after,
     independent of the general external-package rule above. This is the
     actual crate family that caused the original bug (alpha pins drifting
     to newer stable releases requiring a newer rustc than the Android
     build environment has), so it stays fail-closed even though the
     general external-package rule was relaxed.
  3. Local workspace members (no `source` field, i.e. path dependencies):
     the set of package names must be unchanged, each name must appear
     exactly once in both lockfiles (no duplicates), every local package's
     `version` must equal `[workspace.package].version` from the patched
     Cargo.toml (the uniform bump is harmless: local packages aren't
     published, so it doesn't affect dependency resolution), and
     `dependencies` may only change by *exactly* the two expected
     additions below -- any other dependency addition or any removal is
     rejected.

New external packages/versions appearing, and existing external
packages/versions fully disappearing, are both allowed without comment:
this is normal feature-graph re-resolution, not lockfile drift.
"""
import sys
import tomllib
from collections import Counter

EXPECTED_LOCAL_DEPENDENCY_ADDITIONS = {
    "codex-http-client": {"openssl-sys"},
    "codex-thread-store": {"libc"},
}


def check(before, after, expected_workspace_version):
    def pkey(p):
        return (p['name'], p.get('source'))

    before_ext = {}
    for p in before['package']:
        if p.get('source'):
            before_ext.setdefault(pkey(p), {})[p['version']] = p.get('checksum')
    after_ext = {}
    for p in after['package']:
        if p.get('source'):
            after_ext.setdefault(pkey(p), {})[p['version']] = p.get('checksum')

    for k, before_by_version in before_ext.items():
        after_by_version = after_ext.get(k, {})
        for version, checksum in before_by_version.items():
            if version in after_by_version and after_by_version[version] != checksum:
                return (
                    f"ERROR: external package {k[0]} {version} (source={k[1]}) "
                    f"checksum changed"
                )

    rama_before = {
        (p['name'], p.get('version'), p.get('source'))
        for p in before['package']
        if p['name'].startswith('rama-') or p['name'] == 'rama'
    }
    rama_after = {
        (p['name'], p.get('version'), p.get('source'))
        for p in after['package']
        if p['name'].startswith('rama-') or p['name'] == 'rama'
    }
    if rama_before != rama_after:
        return f"ERROR: rama-* package set changed: before={rama_before} after={rama_after}"

    before_local_by_name = {}
    for p in before['package']:
        if not p.get('source'):
            before_local_by_name.setdefault(p['name'], []).append(p)
    after_local_by_name = {}
    for p in after['package']:
        if not p.get('source'):
            after_local_by_name.setdefault(p['name'], []).append(p)

    if set(before_local_by_name) != set(after_local_by_name):
        added = set(after_local_by_name) - set(before_local_by_name)
        removed = set(before_local_by_name) - set(after_local_by_name)
        return f"ERROR: local workspace package set changed: added={added} removed={removed}"

    for name in before_local_by_name:
        b_entries = before_local_by_name[name]
        a_entries = after_local_by_name[name]
        if len(b_entries) != 1 or len(a_entries) != 1:
            return (
                f"ERROR: local package {name} has unexpected duplicate/missing "
                f"entries: before={len(b_entries)} after={len(a_entries)}"
            )
        bp, ap = b_entries[0], a_entries[0]
        if ap.get('version') != expected_workspace_version:
            return (
                f"ERROR: local package {name} version {ap.get('version')!r} does not "
                f"match expected workspace version {expected_workspace_version!r}"
            )
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
    import os

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
        "Cargo.lock verified: no external package checksum changed, rama-* set "
        "unchanged, local workspace package set unchanged (version as a uniform bump, "
        "dependencies limited to the two expected additions)"
    )


if __name__ == '__main__':
    main()
