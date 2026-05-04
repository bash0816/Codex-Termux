# 2026-05-03 Codex-Termux Release Guidance

## 目的

- public repo で end user に約束する install/update/rollback 導線を明確にする

## 現時点の前提

- public npm package はまだ提供していない
- support 対象は audited metadata に登録済みの runtime のみ
- current audited runtime は `@mmmbuto/codex-cli-termux@0.124.0-termux`
- `canonical_package_name: null` は public wrapper package 未提供を意味する

## Install

```sh
npm install -g @mmmbuto/codex-cli-termux@0.124.0-termux
codex --version
codex login status
```

## Update

- current runtime には public な self-update command が見えていない
- manifest 上の update strategy は `manual_reinstall_audited_runtime`
- そのため update は audited version を明示した再 install で行う
- `0.128.0-termux` では `codex update` capability は観測済みだが、まだ public guidance には採用していない

```sh
npm install -g @mmmbuto/codex-cli-termux@0.124.0-termux
```

## Rollback

- rollback は最後の audited runtime version を明示して再 install する
- current rollback target は `0.124.0-termux`

```sh
npm install -g @mmmbuto/codex-cli-termux@0.124.0-termux
```

## Source of Truth

- support version と install/update command の正本は
  - `config/codex-termux-release-manifest.json`
- runtime provenance と実機監査ログの正本は private repo に保持する
- current audit evidence reference:
  - `Codex-Termux-Private:docs/audits/0.124.0-termux.md`
