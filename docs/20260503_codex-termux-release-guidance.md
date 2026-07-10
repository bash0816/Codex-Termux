# 2026-05-03 Codex-Termux Release Guidance

## Status

- this repository is public
- the package is published
- public support is available
- package name: `@bash0816/codex-termux`
- latest audited version: `0.144.1`
- tracked versions: `0.141.0`, `0.140.0`, `0.139.0`, `0.137.0`, `0.131.1`, `0.142.0`, `0.142.2`, `0.142.3`, `0.142.4`, `0.142.5`, `0.143.0`, `0.144.1`

## Current Scope

- package skeleton is in `packages/codex-termux`
- CI currently covers:
  - syntax check
  - manifest / README drift check
  - `npm pack --dry-run`
- publish and registry verification have completed

## Install

```sh
npm install -g @bash0816/codex-termux@latest
codex --version
codex login status
```

## Update

```sh
codex update
```

Do not install the upstream `@openai/codex` package directly on Termux.

## Rollback

```sh
npm install -g @bash0816/codex-termux@0.143.0
```

## Source Of Truth

- `config/codex-termux-release-manifest.json`
