# Codex-Termux

Native Codex wrapper package for Termux.

Termux 向け Codex ネイティブ wrapper package です。

## Status / 状態

- version: `0.133.0-2` (latest)
- package: `@bash0816/codex-termux`
- TUI: **available** ✅
- `codex exec`: **available** ✅

## Install / インストール

```sh
npm install -g @bash0816/codex-termux@latest
codex --version
```

## Usage / 使い方

```sh
# Interactive TUI / 対話型 TUI
codex

# Non-interactive / 非対話
codex exec "echo hello"
```

## Update / 更新

```sh
codex update
```

Or / または:

```sh
npm install -g @bash0816/codex-termux@latest --force
```

## Known Issues / 既知の問題

### `lock() not supported` on Android (Fixed in this package)

Upstream openai/codex 0.133.0 has a bug where `codex exec` crashes on Android with:

```
Error: failed to initialize in-process app-server client: lock() not supported
```

This is caused by `flock(2)` being unsupported on the `/data` partition on Android.
**This bug is patched in `@bash0816/codex-termux@0.133.0-2` and later.** The upstream fix is tracked in [openai/codex#26277](https://github.com/openai/codex/issues/26277).

アップストリームの `codex exec` が Android で `lock() not supported` クラッシュする不具合は、`@bash0816/codex-termux@0.133.0-2` 以降で修正済みです。

## Do Not Use / 非推奨

Do not install the upstream package directly on Termux.

Termux では upstream package を直接 install しないでください。

```sh
npm install -g @openai/codex@latest  # ← Do not use on Termux / Termux では使わないでください
```

## Previous Notices / 過去のお知らせ

### v0.130.0 / v0.131.0 users

v0.130.0 contains a binary bug. v0.131.0 has a broken `codex update` command. Both are fixed. Please update to latest.

v0.130.0 にはバイナリの不具合、v0.131.0 は `codex update` の不具合があります。latest に更新してください。
