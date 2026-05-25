# 2026-05-25 Codex-Termux Release Guidance

## Status

- this repository is public
- the package is published
- public support is available
- tracked version: `0.131.0`
- package name: `@bash0816/codex-termux`

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
npm install -g @bash0816/codex-termux@latest --force
```

Do not install the upstream `@openai/codex` package directly on Termux.

## Source Of Truth

- `config/codex-termux-release-manifest.json`
