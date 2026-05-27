# Codex-Termux

Native Codex wrapper package for Termux.

Termux 向け Codex ネイティブ wrapper package です。

## ⚠️ Notice for v0.130.0 / v0.131.0 users

v0.130.0 contains a binary bug. v0.131.0 has a broken `codex update` command. Both are fixed in v0.131.1. Please update.

v0.130.0 にはバイナリの不具合があります。v0.131.0 は `codex update` が動作しない不具合があります。v0.131.1 で修正済みです。更新してください。

```sh
npm install -g @bash0816/codex-termux@latest --force
```

## ⚠️ Provisional Release / 暫定リリース

**v0.131.1 is a provisional release. The interactive TUI (`codex` without arguments) does not work at all in this build.** TUI support requires a full Android cross-compilation build and is planned for a future release.

If you need the interactive TUI, please wait for the next release.

**v0.131.1 は暫定リリースです。対話型 TUI（引数なしの `codex`）はこのビルドでは完全に動作しません。** TUI 対応には Android クロスコンパイルビルドが必要であり、次回リリースで対応予定です。

対話型 TUI が必要な場合は、次のリリースをお待ちください。

## Status / 状態

- tracked version: `0.131.1`
- package: `@bash0816/codex-termux`
- TUI: **not available** (planned for next release)

## Limitations / 制限事項

The interactive TUI is **completely non-functional** in this build. Running `codex` without arguments will immediately exit with:

```
interactive TUI is unavailable in this Android core build
```

`codex exec` works and is the only supported mode in this release.

この暫定ビルドでは対話型 TUI は**完全に動作しません**。引数なしで `codex` を実行すると即座に終了します。

`codex exec` は動作します。現リリースで使用できるのはこのモードのみです。

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
