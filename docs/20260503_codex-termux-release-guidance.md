# 2026-05-03 Codex-Termux Release Guidance

## Status

- this repository is public
- public publish gate is ready
- the package is not published yet
- public support remains withheld
- tracked version: `0.130.0`
- package name: `@bash0816/codex-termux`

## Current Scope

- package skeleton is in `packages/codex-termux`
- CI currently covers:
  - syntax check
  - manifest / README drift check
  - `npm pack --dry-run`
- local runtime staging uses:
  - `scripts/stage-public-android-runtime.sh`

## Not Available Yet

- install guidance
- update guidance
- rollback guidance
- supported-version claim

## Source Of Truth

- `config/codex-termux-release-manifest.json`
