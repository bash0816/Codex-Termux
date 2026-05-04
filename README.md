# Codex-Termux

Codex を Termux で配布するための public リポジトリ。

## 役割

- end-user 向け README
- release artifact / package / CI/CD
- private 側で監査・検証済みの成果だけを公開

## 現在の状態

- public bootstrap 段階
- 実調査と runtime 監査は private repo `Codex-Termux-Private` で進行
- public 側は user-facing な README / manifest / release docs を正本として持つ
- まだ public npm package は提供していない
- `canonical_package_name: null` は、public wrapper package 未提供を意味する

## private repo

- `Codex-Termux-Private`

## 方針

- ClaudeCode-Termux と同様に、分析は private、配布は public に分ける
- public へは検証済み manifest / release 導線だけを先に持ち込む
- wrapper package は後段 PoC に回す

## Supported Runtime

audited metadata に登録済みの runtime だけを support 対象とする。

- runtime package: `@mmmbuto/codex-cli-termux`
- latest audited runtime: `0.124.0-termux`
- upstream reference: `@openai/codex@0.128.0`
- platform: `android`
- arch: `arm64`

正本は [config/codex-termux-release-manifest.json](/data/data/com.termux/files/home/Codex-Termux/config/codex-termux-release-manifest.json)。

## Install

現時点の audited runtime install 例:

```sh
npm install -g @mmmbuto/codex-cli-termux@0.124.0-termux
codex --version
codex login status
```

## Update

この line には public な self-update command が見えていない。
更新は `manual_reinstall_audited_runtime` strategy として扱い、audited metadata を確認したうえで対象 version を明示して再 install する。
`0.128.0-termux` では `codex update` capability 自体は観測済みだが、audited guidance にはまだ採用していない。

例:

```sh
npm install -g @mmmbuto/codex-cli-termux@0.124.0-termux
```

release guidance は [docs/20260503_codex-termux-release-guidance.md](/data/data/com.termux/files/home/Codex-Termux/docs/20260503_codex-termux-release-guidance.md) を参照。
