# 2026-05-03 Codex-Termux Release Guidance

## 目的

- public repo がどの条件まで end user 向け guidance を出さないかを明確にする

## 現時点の前提

- public npm package はまだ提供していない
- current audited runtime は `@mmmbuto/codex-cli-termux@0.124.0-termux`
- ただし `@mmmbuto/codex-cli-termux` を runtime line として使っている間は、public OSS 配布物としては出さない
- `canonical_package_name: null` は public wrapper package 未提供を意味する

## Install

- 現時点では public end-user 向け install guidance は出さない
- private 監査で使っている install command は evidence として private repo に残す

## Update

- manifest 上の update strategy は `not_publicly_distributed_while_using_mmmbuto_runtime`
- `0.128.0-termux` では `codex update` capability は観測済みだが、まだ public guidance には採用していない
- public end-user 向け update guidance は出さない

## Rollback

- public end-user 向け rollback guidance は出さない
- rollback/restore の evidence は private repo に保持する

## Source of Truth

- tracked runtime と distribution policy の正本は
  - `config/codex-termux-release-manifest.json`
- runtime provenance と実機監査ログの正本は private repo に保持する
- current audit evidence reference:
  - `Codex-Termux-Private:docs/audits/0.124.0-termux.md`
