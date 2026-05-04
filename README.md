# Codex-Termux

Codex を Termux で配布するための public リポジトリ。

## 役割

- end-user 向け README
- release artifact / package / CI/CD
- 公開用の manifest / release docs / package 導線を管理

## 現在の状態

- public bootstrap 段階
- public 側は README / manifest / release docs の正本を持つ
- まだ公開配布の条件を満たしていないため、OSS 配布物としては公開しない
- `@bash0816/codex-termux` は planned wrapper package だが、まだ公開されておらず install できない
- `canonical_package_name: null` は public wrapper package 未提供を意味する
- gate summary: canonical昇格は publish / registry verification 後、install guidance は別 gate。

## Current Scope

現時点では public OSS 配布の support 表明ではない。

- latest audited runtime line: `0.124.0-termux`
- platform: `android`
- arch: `arm64`

正本は [config/codex-termux-release-manifest.json](/data/data/com.termux/files/home/Codex-Termux/config/codex-termux-release-manifest.json)。

## Public Distribution

- install / update / rollback の end-user guidance も現時点では公開しない
- planned wrapper package があるが、現時点では公開 install 導線として使えない

release guidance は [docs/20260503_codex-termux-release-guidance.md](/data/data/com.termux/files/home/Codex-Termux/docs/20260503_codex-termux-release-guidance.md) を参照。
