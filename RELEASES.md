## 0.133.0-1 — 2026-06-05

Wrapper patch release on top of upstream openai/codex 0.133.0.

**This is the recommended release.** It fixes the `lock() not supported` crash on Android that prevents `codex exec` from running ([openai/codex#26277](https://github.com/openai/codex/issues/26277)).

### What's fixed

- **`codex exec` crash on Android** — Applied patches at 3 locations in `arg0/src/lib.rs`, `core/src/installation_id.rs`, and `app-server-transport/src/transport/unix_socket.rs` to guard `lock()` / `try_lock()` calls with `#[cfg(not(target_os = "android"))]`. The upstream fix is pending in [openai/codex#26277](https://github.com/openai/codex/issues/26277).
- **Spurious update notifications suppressed** — The launcher now passes `-c check_for_update_on_startup=false` to prevent noise from stale version cache.
- **Stale temp directory cleanup** — Startup cleans up `~/.codex/tmp/arg0/codex-arg0-*` directories older than 7 days.

### Install

```sh
npm install -g @bash0816/codex-termux@latest
codex --version
```

---

## 0.133.0 — 2026-05-30

Candidate release. Contains the `lock() not supported` fix but had spurious update notifications. Use 0.133.0-1 instead.

### Install

```sh
npm install -g @bash0816/codex-termux@0.133.0
```

---

## 0.131.1 — 2026-05-25

Provisional release. `codex exec` works. Interactive TUI not available in this build.

### Install

```sh
npm install -g @bash0816/codex-termux@0.131.1
```
