# Codex-Termux

Codex を Termux で配布するための public リポジトリ。

## 役割

- end-user 向け README
- release artifact / package / CI/CD
- private 側で監査・検証済みの成果だけを公開

## 現在の状態

- public bootstrap 段階
- 実調査と runtime 監査は private repo `Codex-Termux-Private` で進行
- public 側は README / manifest / release docs の正本を持つ
- ただし runtime が `@mmmbuto/codex-cli-termux` に依存している間は、OSS 配布物としては公開しない
- `canonical_package_name: null` は public wrapper package 未提供を意味する

## private repo

- `Codex-Termux-Private`

## 方針

- ClaudeCode-Termux と同様に、分析は private、配布は public に分ける
- public へは検証済み manifest / release 導線だけを先に持ち込む
- wrapper package は後段 PoC に回す

## Tracked Runtime

監査対象として追跡している runtime 情報。
現時点では public OSS 配布の support 表明ではない。

- runtime package: `@mmmbuto/codex-cli-termux`
- latest audited runtime: `0.124.0-termux`
- upstream reference: `@openai/codex@0.128.0`
- platform: `android`
- arch: `arm64`

正本は [config/codex-termux-release-manifest.json](/data/data/com.termux/files/home/Codex-Termux/config/codex-termux-release-manifest.json)。

## Public Distribution

- `@mmmbuto/codex-cli-termux` を runtime line として使っている間は、public OSS 配布物としては出さない
- install / update / rollback の end-user guidance も現時点では公開しない
- `0.128.0-termux` で `codex update` capability 自体は観測済みだが、public guidance には採用していない

release guidance は [docs/20260503_codex-termux-release-guidance.md](/data/data/com.termux/files/home/Codex-Termux/docs/20260503_codex-termux-release-guidance.md) を参照。
