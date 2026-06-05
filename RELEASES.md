## 0.133.0-2 — 2026-06-05

fix: update --dry-run argv parse bug + doctor suppress newer version。upstream openai/codex@0.133.0 追従。

### Install

```sh
npm install -g @bash0816/codex-termux@0.133.0-2
codex --version
```

## 0.133.0-1 — 2026-06-05

Wrapper patch release on top of upstream openai/codex 0.133.0 binary.

### What's fixed (wrapper layer)

- **LD_PRELOAD flock shim** — Adds `libflock_noop.so` via `LD_PRELOAD` as a runtime safety net for any remaining `flock(2)` calls on Android. The underlying 0.133.0 binary already has compile-time `#[cfg(not(target_os = "android"))]` guards at the three affected locations.
- **Spurious update notifications suppressed** — Passes `-c check_for_update_on_startup=false` to the binary to prevent noise from stale version cache.
- **Stale temp directory cleanup** — Cleans up `~/.codex/tmp/arg0/codex-arg0-*` directories older than 7 days on startup.

> The `lock() not supported` crash fix originates in the **0.133.0 binary** (build-time patches). 0.133.0-1 adds the LD_PRELOAD shim as an extra layer. See [openai/codex#26277](https://github.com/openai/codex/issues/26277).

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
