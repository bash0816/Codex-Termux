# Codex-Termux

Codex wrapper package for Termux.

Termux 向け Codex wrapper package です。

## Security Notice / セキュリティ通知

> **0.142.2 contains a security patch. Existing users are recommended to update.**
>
> **0.142.2 はセキュリティパッチを含みます。既存ユーザーも 0.142.2 以降への更新を推奨します。**
>
> - OpenSSL 3.6.3 (patched release)
> - esbuild 0.28.1 (patched release)
> - PowerShell AST safety classifier hardening

## Status / 状態

Active — `@bash0816/codex-termux@0.142.4` is the current stable release.

`@bash0816/codex-termux@0.142.4` が現在の安定版です。

## Manifest Snapshot / manifest スナップショット

- Repository visibility: `public`
- Canonical package name: `@bash0816/codex-termux`
- Latest audited version: `0.142.4`
- Tracked versions: `0.141.0`, `0.140.0`, `0.139.0`, `0.137.0`, `0.131.1`, `0.142.0`, `0.142.2`, `0.142.3`, `0.142.4`

## Install / インストール

```sh
npm install -g @bash0816/codex-termux
codex --version
```

## Update / 更新

```sh
npm install -g @bash0816/codex-termux@latest
codex --version
```

## Rollback / ロールバック

```sh
npm install -g @bash0816/codex-termux@0.142.3
codex --version
```

## Package files

```text
packages/codex-termux
```

## Source Of Truth / 正本

- release manifest:
  - `config/codex-termux-release-manifest.json`
- release guidance:
  - `docs/20260503_codex-termux-release-guidance.md`
