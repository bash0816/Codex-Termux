## 0.141.0 — 2026-06-22

upstream openai/codex@0.141.0 追従。

### Install

```sh
npm install -g @bash0816/codex-termux@0.141.0
codex --version
```

## 0.140.0 — 2026-06-16 ✅ Current stable / 現在の安定版
upstream `openai/codex@0.140.0` 追従。Termux 固有の変更はありません。

**Upstream highlights / 主な変更（upstream）**

- **`/usage`** — 日次・週次・累計のアカウントトークン使用量ビューを追加
- **`/goal` 改善** — 大容量テキスト・大量ペースト・画像アタッチメントを保持（リモートセッション含む）
- **`codex delete` / `/deleteb** — セッションの永続削除（確認プロンプト・サブエージェントクリーンアップ付き）
- **`/importb** — Claude Code からセットアップ・プロジェクト設定・最近のチャットをインポート
- **`@` メンションメニュー** — ファイル・プラグイン・スキルを統合メンションメニューで選択可能に
- **Amazon Bedrock 認証** — マネージド Bedrock API キー認証と MCP OAuth 認証情報の暗号化ローカルストレージ
- **SQLite 自動修復** — 破損した状態 DB を自動バックアップして再構築
- **MCP 信頼性向上** — 起動失敗のリトライ・OAuth エラー表示改善・無効化サーバーの保持
- **非 TTY Ctrl-C** — バックグラウンドコマンドを Ctrl-C で割り込み可能に

### Install

```sh
npm install -g @bash0816/codex-termux@0.140.0
codex --version
```

## 0.139.0 — 2026-06-12

upstream openai/codex@0.139.0 追従。

### Install

```sh
npm install -g @bash0816/codex-termux@0.139.0
codex --version
```

## 0.137.0 — 2026-06-06

Native Codex wrapper for Termux (aarch64). Upstream openai/codex 0.137.0 with Android lock patches (unix_socket.rs, installation_id.rs, arg0/lib.rs) and 8MiB stack size fix.

### Install

```sh
npm install -g @bash0816/codex-termux@0.137.0
codex --version
```

## 0.133.0-2 — 2026-06-05

@bash0816/codex-termux@0.133.0-2
Native Codex wrapper package for Termux (aarch64).

Termux (aarch64) 向け Codex ネイティブ wrapper package です。

**Changes / 変更内容**

Fix: codex update --dry-run argv parse bug — The `--dry-run` flag was incorrectly parsed as `currentVersion`, causing the command to show a downgrade install command instead of "Already on latest".
codex update --dry-run の引数解析バグを修正。--dry-run が currentVersion として誤解析され、ダウングレードのインストールコマンドが表示される問題を修正しました。

Fix: codex doctor "newer version is available" suppressed — Upstream update notice was not filtered in `codex doctor` output on Termux.
codex doctor の "newer version is available" 表示を抑制。upstream からの更新通知が Termux の doctor 出力に残る問題を修正しました。

### Install

```sh
npm install -g @bash0816/codex-termux@latest
codex --version
```

---

## 0.133.0-1 — 2026-06-04

@bash0816/codex-termux@0.133.0-1
Native Codex wrapper package for Termux (aarch64).

Termux (aarch64) 向け Codex ネイティブ wrapper package です。

**Changes / 変更内容**

Fix: codex exec crash on Android (lock() not supported) — The underlying 0.133.0 binary includes build-time patches for flock(2) being unsupported on the Android /data partition. Since 0.133.0 was a candidate release, 0.133.0-1 is the first stable release to deliver this fix. See [openai/codex#26277](https://github.com/openai/codex/issues/26277).
Android で codex exec が lock() not supported でクラッシュする問題を修正。0.133.0 バイナリにビルド時パッチを適用済みです。0.133.0-1 が倝裛がの修正します。
Fix: Spurious update notifications suppressed — Passes `-c check_for_update_on_startup=false` to suppress noise from stale version cache.
更新通知の抑制。古いバージョンキャッシュによるノイズを抑えるため `-c check_for_update_on_startup=false` を渡します。

Fix: Stale temp directory cleanup — Cleans up `~/.codex/tmp/arg0/codex-arg0-*` directories older than 7 days on startup.
起動時に `~/.codex/tmp/arg0/codex-arg0-*` の古い一時ディレクトリ（7日超）を自動削除します。

### Install

```sh
npm install -g @bash0816/codex-termux@latest
codex --version
```

---

## 0.133.0 — 2026-06-04

Candidate release only — not promoted to @latest. Use 0.133.0-1 instead.
候補リリースのみ。@latest には昇格しませんでした。0.133.0-1 をお使いください。

---

## 0.131.1 — 2026-05-25

Provisional release. `codex exec` works. Interactive TUI not available in this build.

### Install

```sh
npm install -g @bash0816/codex-termux@0.131.1
```
