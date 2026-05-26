# Codex-Termux

Native Codex wrapper package for Termux.

Termux 向け Codex ネイティブ wrapper package です。

## ⚠️ Notice for v0.130.0 / v0.131.0 users

v0.130.0 contains a binary bug. v0.131.0 has a broken `codex update` command. Both are fixed in v0.131.1. Please update.

v0.130.0 にはバイナリの不具合があります。v0.131.0 は `codex update` が動作しない不具合があります。v0.131.1 で修正済みです。更新してください。

```sh
npm install -g @bash0816/codex-termux@latest --force
```

## Status / 状態

- tracked version: `0.131.1`
- package: `@bash0816/codex-termux`

## Install / インストール

```sh
npm install -g @bash0816/codex-termux@latest
codex --version
```

## Update / 更新

```sh
codex update
```

Or / または:

```sh
npm install -g @bash0816/codex-termux@latest --force
```

## Do Not Use / 非推奨

Do not install the upstream package directly on Termux.

Termux では upstream package を直接 install しないでください。

```sh
npm install -g @openai/codex@latest  # ← Do not use on Termux
```
