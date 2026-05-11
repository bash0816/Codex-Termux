# Codex-Termux

Codex を Termux 向けに整えるための public release prep リポジトリ。

## 役割

- package-prep 用の README / manifest / workflow を管理する
- `packages/codex-termux` の public skeleton を保持する
- release artifact の stage 補助と drift check をまとめる

## 現在の状態

- public distribution は withheld
- `@bash0816/codex-termux` は package-prep 前提で、まだ publish 済みではない
- tracked internal baseline は `0.130.0` に更新済み
- previous baseline `0.128.0` は retained
- install / update / rollback の end-user guidance はまだ出さない
- canonical package は registry verification 後に扱う

## 現在のスコープ

- tracked version: `0.130.0`
- platform: `android`
- arch: `arm64`
- package skeleton: [`packages/codex-termux`](packages/codex-termux)

## Guidance

- release guidance: [`docs/20260503_codex-termux-release-guidance.md`](docs/20260503_codex-termux-release-guidance.md)
- release manifest: [`config/codex-termux-release-manifest.json`](config/codex-termux-release-manifest.json)
- provenance-aware local stage helper: [`scripts/stage-public-android-runtime.sh`](scripts/stage-public-android-runtime.sh)
