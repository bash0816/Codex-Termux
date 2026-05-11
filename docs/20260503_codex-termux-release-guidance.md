# 2026-05-03 Codex-Termux Release Guidance

## 目的

- public repo がどの条件まで package-prep を進めるかを明確にする

## 現時点の前提

- public distribution は withheld
- tracked version は `0.130.0`
- tracked internal baseline は更新済み
- previous baseline `0.128.0` は retained
- `@bash0816/codex-termux` は package-prep 前提だが、まだ publish 済みではない
- `canonical_package_name` は registry verification 後に昇格する
- gate summary: tracked internal baseline updated; previous baseline retained; public support remains withheld

## Install

- 現時点では public end-user 向け install guidance は出さない
- package-prep の範囲では stage / pack / drift check だけを扱う

## Update

- manifest 上の update strategy は `not_publicly_distributed`
- public end-user 向け update guidance は出さない

## Rollback

- public end-user 向け rollback guidance は出さない

## Package Prep

- package skeleton は `packages/codex-termux` に置く
- CI では syntax check / manifest-README drift check / `npm pack --dry-run` を行う
- local stage は provenance-aware helper を使う

## Source of Truth

- tracked runtime と distribution policy の正本は
  - `config/codex-termux-release-manifest.json`
