# @bash0816/codex-termux

Termux 向け Codex package です。

## Manifest Snapshot

- Canonical package status: `published`
- Public distribution status: `published`
- Support status: `active`
- Latest audited version: `0.144.1`
- Tracked versions: `0.141.0`, `0.140.0`, `0.139.0`, `0.137.0`, `0.131.1`, `0.142.0`, `0.142.2`, `0.142.3`, `0.142.4`, `0.142.5`, `0.143.0`, `0.144.1`
- Update strategy: `npm_reinstall_audited_package`

## Scope

- `codex` / `codex-exec` launcher entrypoints
- `LD_LIBRARY_PATH` sanitization for Termux
- `CODEX_SELF_EXE` wiring
- `exec` routing for non-command arguments
- optional passthrough to locally staged Android artifacts

## Package Shape

- `bin/codex`
- `bin/codex-exec`
- `bin/codex-termux`
- `bin/codex.js`
- `bin/codex-exec.js`
- `lib/stage-android-runtime.sh`

## Resolution Order

The JS launcher first routes to the shell launcher in `bin/`, which then looks
for locally staged native artifacts under this package.
If they are not present, it can fall back to an installed upstream
`@openai/codex` package together with the Android platform package when present.

The shell launcher keeps the Termux library path clean by removing the default
Termux `lib` and `libexec` entries before prepending the package `bin/`
directory.

## Notes

- Install with `npm install -g @bash0816/codex-termux@latest`
- `codex update` is intercepted and rerouted to the same npm install command
- Update with `codex update`
- Roll back by installing an explicit published version
