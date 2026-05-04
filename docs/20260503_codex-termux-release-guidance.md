# 2026-05-03 Codex-Termux Release Guidance

## 目的

- public repo がどの条件まで end user 向け guidance を出さないかを明確にする

## 現時点の前提

- public npm package はまだ提供していない
- current audited runtime line は `0.124.0-termux`
- まだ公開配布の条件を満たしていないため、public OSS 配布物としては出さない
- `@bash0816/codex-termux` は planned wrapper package だが、まだ公開されておらず install できない
- `canonical_package_name: null` は public wrapper package 未提供を意味する
- gate summary: canonical昇格は publish / registry verification 後、install guidance は別 gate。

## Install

- 現時点では public end-user 向け install guidance は出さない
- planned wrapper package があるが、public install guidance としてはまだ使わない

## Update

- manifest 上の update strategy は `not_publicly_distributed`
- public end-user 向け update guidance は出さない

## Rollback

- public end-user 向け rollback guidance は出さない

## Source of Truth

- tracked runtime と distribution policy の正本は
  - `config/codex-termux-release-manifest.json`
