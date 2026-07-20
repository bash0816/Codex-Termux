## 0.144.6 — 2026-07-20

upstream openai/codex 0.144.6 追従。

**Upstream highlights / 主な変更（upstream）**

## Bug Fixes

- Refreshed bundled instructions for GPT-5.6 Sol, Terra, and Luna, and corrected their context windows to 272,000 tokens. (#33972, #34009)

## Changelog

Full Changelog: https://github.com/openai/codex/compare/rust-v0.144.5...rust-v0.144.6

- #33972 Backport refreshed bundled model metadata to 0.144 @sayan-oai
- #34009 Narrow 0.144 hotfix to GPT-5.6 prompts and context @sayan-oai

### Install

```sh
npm install -g @bash0816/codex-termux@0.144.6
codex --version
```
## 0.144.5 — 2026-07-18

upstream openai/codex 0.144.5 追従。

**Upstream highlights / 主な変更（upstream）**

## Bug Fixes

- Improved dangerous-command detection, including more forced `rm` forms, and provides clearer rejection reasons when commands are denied. (#33455)

## Changelog

Full Changelog: https://github.com/openai/codex/compare/rust-v0.144.4...rust-v0.144.5

- #33455 [release/0.144] fix(core) expand is_dangerous_command @dylan-hurd-oai

### Install

```sh
npm install -g @bash0816/codex-termux@0.144.5
codex --version
```
## 0.144.4 — 2026-07-15

upstream openai/codex@0.144.4 追従。

### Install

```sh
npm install -g @bash0816/codex-termux@0.144.4
codex --version
```

## 0.144.3 — 2026-07-15

upstream openai/codex@0.144.3 追従。

### Install

```sh
npm install -g @bash0816/codex-termux@0.144.3
codex --version
```

## 0.144.1 — 2026-07-10

upstream openai/codex@0.144.1 追従。

### Install

```sh
npm install -g @bash0816/codex-termux@0.144.1
codex --version
```

## 0.143.0 — 2026-07-09

upstream openai/codex@0.143.0 追従。

### Install

```sh
npm install -g @bash0816/codex-termux@0.143.0
codex --version
```

## 0.142.5 — 2026-07-02

upstream openai/codex@rust-v0.142.5 追従。Bug fix: Responses WebSocketのリクエストペイロード全体がtrace logに書き込まれる問題を修正（#30771、release/0.142へのbackport）。

### Install

```sh
npm install -g @bash0816/codex-termux@0.142.5
codex --version
```

## 0.142.4 — 2026-06-30

upstream openai/codex@0.142.4 追従。

### Install

```sh
npm install -g @bash0816/codex-termux@0.142.4
codex --version
```

## 0.142.3 — 2026-06-28

upstream openai/codex@0.142.3 追従。

### Install

```sh
npm install -g @bash0816/codex-termux@0.142.3
codex --version
```

## 0.142.2 — 2026-06-26

upstream openai/codex@0.142.2 追従。セキュリティパッチ（OpenSSL 3.6.3・esbuild 0.28.1）適用・PowerShell AST 安全チェック強化。**既存ユーザーも 0.142.2 以降への更新を推奨。**

### Install

```sh
npm install -g @bash0816/codex-termux@0.142.2
codex --version
```

## 0.141.0 — 2026-06-22

upstream openai/codex@0.141.0 追従。lock() guard・TUI パッチ・llvm-strip 適用。

### Install

```sh
npm install -g @bash0816/codex-termux@0.141.0
codex --version
```

## 0.142.0 — 2026-06-24

upstream openai/codex@0.142.0 追従。Android クラッシュ修正（スタックサイズ・flock・TLS）。

### Install

```sh
npm install -g @bash0816/codex-termux@0.142.0
codex --version
```

