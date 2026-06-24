# 2026-05-03 Codex-Termux Release Guidance

## Status

- this repository is public
- the package is staged for publish review
- public support remains withheld until publish completes
- package name: `@bash0816/codex-termux`
- latest audited version: `0.142.0`
- tracked versions: `0.141.0`, `0.140.0`, `0.139.0`, `0.137.0`, `0.131.1`, `0.142.0`

## Current Scope

- package skeleton is in `packages/codex-termux`
- CI currently covers:
  - syntax check
  - manifest / README drift check
  - `npm pack --dry-run`
- publish remains gated by manifest status and runtime staging

## Install

Public install guidance remains withheld.

## Update

Public update guidance remains withheld.

Do not install the upstream `@openai/codex` package directly on Termux.

## Rollback

Rollback guidance will be published after the release gate passes.

## Source Of Truth

- `config/codex-termux-release-manifest.json`
