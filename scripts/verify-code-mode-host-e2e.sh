#!/bin/sh
# Manual, one-off verification script (NOT run by CI). Executed on a Termux
# device against a locally staged Android build artifact bundle to confirm
# codex-code-mode-host actually spawns, and that the V8 runtime inside it
# actually initializes and executes JS — not just that the binary exists or
# that a bare invocation doesn't crash within the first few milliseconds.
#
# usage: scripts/verify-code-mode-host-e2e.sh <path-to-package-root>
#
# <path-to-package-root> must be a packages/codex-termux tree that already
# has codex.bin / codex-exec.bin / codex-code-mode-host / libc++_shared.so
# staged into bin/ (i.e. stage-public-android-runtime.sh or
# stage-android-runtime.sh has already run against the build artifact under
# test — this script does not itself fetch or stage anything).
set -eu

if [ "$#" -ne 1 ]; then
  echo "usage: $0 <path-to-package-root>" >&2
  exit 2
fi

PACKAGE_ROOT=$1
BIN_DIR="$PACKAGE_ROOT/bin"

for required in codex.bin codex-exec.bin codex-code-mode-host libc++_shared.so; do
  if [ ! -e "$BIN_DIR/$required" ]; then
    echo "missing staged artifact: $BIN_DIR/$required (run stage-public-android-runtime.sh first)" >&2
    exit 1
  fi
done

TMP_BASE="${TMPDIR:-/data/data/com.termux/files/usr/tmp}"
RUN_ID=$(date -u +%Y%m%d%H%M%S)-$$
TOKEN=$(head -c 16 /dev/urandom | base64 | tr -dc 'a-zA-Z0-9' | head -c 16)
INVOCATION_LOG=$(mktemp "$TMP_BASE/code-mode-host-invocations-XXXXXX.log")
export INVOCATION_LOG

CODEX_HOME_TEST=$(mktemp -d "$TMP_BASE/codex-home-e2e-test.XXXXXX")
CODEX_HOME_TEST_NORMAL=$(mktemp -d "$TMP_BASE/codex-home-e2e-normal.XXXXXX")
cp -r "$HOME/.codex/." "$CODEX_HOME_TEST/"
cp -r "$HOME/.codex/." "$CODEX_HOME_TEST_NORMAL/"

STAGED=0
cleanup() {
  mv "$BIN_DIR/codex-code-mode-host.real" "$BIN_DIR/codex-code-mode-host" 2>/dev/null || true
  rm -rf "$CODEX_HOME_TEST" "$CODEX_HOME_TEST_NORMAL"
}
trap cleanup EXIT INT TERM

# --- pre-check: no existing [features] table in either test CODEX_HOME ---
python3 -c "
import sys, tomllib
for path in ['$CODEX_HOME_TEST/config.toml', '$CODEX_HOME_TEST_NORMAL/config.toml']:
    with open(path, 'rb') as f:
        data = tomllib.load(f)
    if 'features' in data:
        print(f'ERROR: existing [features] table found in {path}, aborting', file=sys.stderr)
        sys.exit(1)
print('pre-check OK: no existing [features] table in either CODEX_HOME')
"

# --- append: force code_mode_host in the "test" CODEX_HOME, leave the "normal" one untouched ---
cat >> "$CODEX_HOME_TEST/config.toml" << 'TOMLEOF'

[features]
code_mode_only = true

[features.code_mode_host]
enabled = true
disable_in_process_fallback = true
TOMLEOF

# --- post-check: parsed values match intent ---
python3 -c "
import tomllib
with open('$CODEX_HOME_TEST/config.toml', 'rb') as f:
    data = tomllib.load(f)
assert data['features']['code_mode_only'] is True
assert data['features']['code_mode_host']['enabled'] is True
assert data['features']['code_mode_host']['disable_in_process_fallback'] is True
print('post-check OK: features table correctly written and parseable')
"

# --- install verification wrapper in place of the real host binary ---
mv "$BIN_DIR/codex-code-mode-host" "$BIN_DIR/codex-code-mode-host.real"
cat > "$BIN_DIR/codex-code-mode-host" << WRAPEOF
#!/bin/sh
printf '{"run_id":"%s","invoked_at":"%s","pid":%s,"executable":"%s","args":"%s"}\n' \\
  "\${RUN_ID:-unknown}" "\$(date -u +%Y-%m-%dT%H:%M:%S.%NZ)" "\$\$" \\
  "\$(dirname "\$0")/codex-code-mode-host.real" "\$*" \\
  >> "\${INVOCATION_LOG:?INVOCATION_LOG not set}"
exec "\$(dirname "\$0")/codex-code-mode-host.real" "\$@"
WRAPEOF
chmod +x "$BIN_DIR/codex-code-mode-host"
STAGED=1

PROMPT="Run the shell command: echo VERIFY_${TOKEN}_END
Then report exactly what stdout printed, nothing else."
PROMPT_NORMAL="Run the shell command: echo VERIFY_${TOKEN}_normal_END
Then report exactly what stdout printed, nothing else."

echo "=== code-mode-host-enabled run ==="
CODEX_EXIT=0
timeout 120 env CODEX_HOME="$CODEX_HOME_TEST" RUN_ID="$RUN_ID" "$BIN_DIR/codex" exec --json "$PROMPT" \
  > "$TMP_BASE/codex-exec-output-${RUN_ID}.jsonl" || CODEX_EXIT=$?

echo "=== normal-mode comparison run ==="
NORMAL_EXIT=0
timeout 120 env CODEX_HOME="$CODEX_HOME_TEST_NORMAL" "$BIN_DIR/codex" exec --json "$PROMPT_NORMAL" \
  > "$TMP_BASE/codex-exec-output-normal-${RUN_ID}.jsonl" || NORMAL_EXIT=$?

JSON_CHECK_EXIT=0
node -e '
const fs = require("fs");
const token = process.argv[2];
const lines = fs.readFileSync(process.argv[1], "utf8").trim().split("\n").filter(Boolean);
const events = lines.map((l) => JSON.parse(l));
const ok = events.some((e) =>
  e.type === "item.completed" &&
  e.item &&
  e.item.type === "command_execution" &&
  e.item.status === "completed" &&
  e.item.exit_code === 0 &&
  typeof e.item.aggregated_output === "string" &&
  e.item.aggregated_output.includes("VERIFY_" + token + "_END")
);
if (!ok) {
  console.error("FAIL: no matching successful command_execution item.completed event found for token " + token);
  process.exit(1);
}
console.log("PASS: command_execution success event found with matching token");
' "$TMP_BASE/codex-exec-output-${RUN_ID}.jsonl" "$TOKEN" || JSON_CHECK_EXIT=$?

HOST_LOG_EXIT=0
node -e '
const fs = require("fs");
const runId = process.argv[2];
const lines = fs.readFileSync(process.argv[1], "utf8").trim().split("\n").filter(Boolean);
const records = lines.map((l) => JSON.parse(l));
const ok = records.some((r) => r.run_id === runId && r.executable && r.executable.endsWith("codex-code-mode-host.real"));
if (!ok) {
  console.error("FAIL: no matching host invocation record found for run_id " + runId);
  process.exit(1);
}
console.log("PASS: host invocation record found for run_id " + runId);
' "$INVOCATION_LOG" "$RUN_ID" || HOST_LOG_EXIT=$?

NORMAL_JSON_CHECK_EXIT=0
node -e '
const fs = require("fs");
const token = process.argv[2];
const lines = fs.readFileSync(process.argv[1], "utf8").trim().split("\n").filter(Boolean);
const events = lines.map((l) => JSON.parse(l));
const ok = events.some((e) =>
  e.type === "item.completed" &&
  e.item &&
  e.item.type === "command_execution" &&
  e.item.status === "completed" &&
  e.item.exit_code === 0 &&
  typeof e.item.aggregated_output === "string" &&
  e.item.aggregated_output.includes("VERIFY_" + token + "_normal_END")
);
if (!ok) {
  console.error("FAIL: normal-mode comparison run did not produce a matching command_execution success event");
  process.exit(1);
}
console.log("PASS: normal-mode comparison run succeeded");
' "$TMP_BASE/codex-exec-output-normal-${RUN_ID}.jsonl" "$TOKEN" || NORMAL_JSON_CHECK_EXIT=$?

echo "=== summary ==="
echo "code-mode-host run exit code: $CODEX_EXIT"
echo "normal-mode run exit code: $NORMAL_EXIT"
echo "command_execution+token check (code-mode-host run): exit $JSON_CHECK_EXIT"
echo "host invocation log check: exit $HOST_LOG_EXIT"
echo "command_execution+token check (normal-mode run): exit $NORMAL_JSON_CHECK_EXIT"

if [ "$CODEX_EXIT" -eq 0 ] && [ "$NORMAL_EXIT" -eq 0 ] && [ "$JSON_CHECK_EXIT" -eq 0 ] \
  && [ "$HOST_LOG_EXIT" -eq 0 ] && [ "$NORMAL_JSON_CHECK_EXIT" -eq 0 ]; then
  echo "OVERALL: PASS"
  exit 0
else
  echo "OVERALL: FAIL"
  exit 1
fi
