# Codex-Termux

Codex を Termux で配布するための public リポジトリ。

## 役割

- end-user 向け README
- release artifact / package / CI/CD
- private 側で監査・検証済みの成果だけを公開

## 現在の状態

- bootstrap 段階
- 実調査と PoC は private repo `Codex-Termux-Private` で進行
- public 側は配布正本として後から整備する

## private repo

- `Codex-Termux-Private`

## 方針

- ClaudeCode-Termux と同様に、分析は private、配布は public に分ける
- public へは検証済み wrapper / manifest / release 導線だけを持ち込む
