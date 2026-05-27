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

## Limitations / 制限事項

Interactive TUI is currently unavailable in the Android build of `@bash0816/codex-termux`. If you run `codex` without arguments, it will exit with a message such as `interactive TUI is unavailable in this Android core build`.

Use `codex exec` instead for non-interactive operation.

Android ビルドの `@bash0816/codex-termux` では、Interactive TUI は現在利用できません。引数なしで `codex` を実行すると、`interactive TUI is unavailable in this Android core build` のようなメッセージを表示して終了します。

非対話モードで動かす場合は `codex exec` を使用してください。

## Usage / 使い方

```sh
codex exec "echo hello"
```

`codex exec` runs Codex in non-interactive mode and is the supported way to use this Android build.

`codex exec` は非対話モードで Codex を実行します。Android ビルドではこちらを使用してください。

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
