# Applied Android Patches

Source repository: openai/codex
Source ref: rust-v0.142.4
Source SHA: d0fd96663e19a6cd5d6f315e3420c4d154562013
Built by: bash0816/Codex-Termux @ main (3696e2f860dcfdd0811542601edadcd51f539688)
Build timestamp: 2026-06-29T20:29:28Z

## Modified Files (stat)
 codex-rs/Cargo.lock                                | 254 ++++++++++-----------
 codex-rs/Cargo.toml                                |   2 +-
 .../src/transport/unix_socket.rs                   |   1 +
 codex-rs/arg0/src/lib.rs                           |   6 +
 codex-rs/core/Cargo.toml                           |   3 +
 codex-rs/core/src/installation_id.rs               |   1 +
 6 files changed, 139 insertions(+), 128 deletions(-)

## Full Diff
diff --git a/codex-rs/Cargo.lock b/codex-rs/Cargo.lock
index 65d581d..e338bf3 100644
--- a/codex-rs/Cargo.lock
+++ b/codex-rs/Cargo.lock
@@ -394,7 +394,7 @@ checksum = "7f202df86484c868dbad7eaa557ef785d5c66295e41b460ef922eca0723b842c"
 
 [[package]]
 name = "app_test_support"
-version = "0.0.0"
+version = "0.142.4"
 dependencies = [
  "anyhow",
  "base64 0.22.1",
@@ -1863,7 +1863,7 @@ dependencies = [
 
 [[package]]
 name = "codex-agent-graph-store"
-version = "0.0.0"
+version = "0.142.4"
 dependencies = [
  "codex-protocol",
  "codex-state",
@@ -1877,7 +1877,7 @@ dependencies = [
 
 [[package]]
 name = "codex-agent-identity"
-version = "0.0.0"
+version = "0.142.4"
 dependencies = [
  "anyhow",
  "base64 0.22.1",
@@ -1896,7 +1896,7 @@ dependencies = [
 
 [[package]]
 name = "codex-analytics"
-version = "0.0.0"
+version = "0.142.4"
 dependencies = [
  "codex-app-server-protocol",
  "codex-git-utils",
@@ -1917,7 +1917,7 @@ dependencies = [
 
 [[package]]
 name = "codex-ansi-escape"
-version = "0.0.0"
+version = "0.142.4"
 dependencies = [
  "ansi-to-tui",
  "ratatui",
@@ -1926,7 +1926,7 @@ dependencies = [
 
 [[package]]
 name = "codex-api"
-version = "0.0.0"
+version = "0.142.4"
 dependencies = [
  "anyhow",
  "assert_matches",
@@ -1959,7 +1959,7 @@ dependencies = [
 
 [[package]]
 name = "codex-app-server"
-version = "0.0.0"
+version = "0.142.4"
 dependencies = [
  "anyhow",
  "app_test_support",
@@ -2051,7 +2051,7 @@ dependencies = [
 
 [[package]]
 name = "codex-app-server-client"
-version = "0.0.0"
+version = "0.142.4"
 dependencies = [
  "codex-app-server",
  "codex-app-server-protocol",
@@ -2078,7 +2078,7 @@ dependencies = [
 
 [[package]]
 name = "codex-app-server-daemon"
-version = "0.0.0"
+version = "0.142.4"
 dependencies = [
  "anyhow",
  "codex-app-server-protocol",
@@ -2099,7 +2099,7 @@ dependencies = [
 
 [[package]]
 name = "codex-app-server-protocol"
-version = "0.0.0"
+version = "0.142.4"
 dependencies = [
  "anyhow",
  "clap",
@@ -2127,7 +2127,7 @@ dependencies = [
 
 [[package]]
 name = "codex-app-server-test-client"
-version = "0.0.0"
+version = "0.142.4"
 dependencies = [
  "anyhow",
  "clap",
@@ -2149,7 +2149,7 @@ dependencies = [
 
 [[package]]
 name = "codex-app-server-transport"
-version = "0.0.0"
+version = "0.142.4"
 dependencies = [
  "anyhow",
  "axum",
@@ -2188,7 +2188,7 @@ dependencies = [
 
 [[package]]
 name = "codex-apply-patch"
-version = "0.0.0"
+version = "0.142.4"
 dependencies = [
  "anyhow",
  "assert_cmd",
@@ -2208,7 +2208,7 @@ dependencies = [
 
 [[package]]
 name = "codex-arg0"
-version = "0.0.0"
+version = "0.142.4"
 dependencies = [
  "anyhow",
  "codex-apply-patch",
@@ -2228,7 +2228,7 @@ dependencies = [
 
 [[package]]
 name = "codex-async-utils"
-version = "0.0.0"
+version = "0.142.4"
 dependencies = [
  "pretty_assertions",
  "tokio",
@@ -2237,7 +2237,7 @@ dependencies = [
 
 [[package]]
 name = "codex-aws-auth"
-version = "0.0.0"
+version = "0.142.4"
 dependencies = [
  "aws-config",
  "aws-credential-types",
@@ -2252,7 +2252,7 @@ dependencies = [
 
 [[package]]
 name = "codex-backend-client"
-version = "0.0.0"
+version = "0.142.4"
 dependencies = [
  "anyhow",
  "codex-api",
@@ -2269,7 +2269,7 @@ dependencies = [
 
 [[package]]
 name = "codex-backend-openapi-models"
-version = "0.0.0"
+version = "0.142.4"
 dependencies = [
  "serde",
  "serde_json",
@@ -2278,7 +2278,7 @@ dependencies = [
 
 [[package]]
 name = "codex-bwrap"
-version = "0.0.0"
+version = "0.142.4"
 dependencies = [
  "cc",
  "libc",
@@ -2287,7 +2287,7 @@ dependencies = [
 
 [[package]]
 name = "codex-chatgpt"
-version = "0.0.0"
+version = "0.142.4"
 dependencies = [
  "anyhow",
  "clap",
@@ -2309,7 +2309,7 @@ dependencies = [
 
 [[package]]
 name = "codex-cli"
-version = "0.0.0"
+version = "0.142.4"
 dependencies = [
  "anyhow",
  "assert_cmd",
@@ -2385,7 +2385,7 @@ dependencies = [
 
 [[package]]
 name = "codex-client"
-version = "0.0.0"
+version = "0.142.4"
 dependencies = [
  "bytes",
  "codex-utils-cargo-bin",
@@ -2418,7 +2418,7 @@ dependencies = [
 
 [[package]]
 name = "codex-cloud-config"
-version = "0.0.0"
+version = "0.142.4"
 dependencies = [
  "base64 0.22.1",
  "chrono",
@@ -2442,7 +2442,7 @@ dependencies = [
 
 [[package]]
 name = "codex-cloud-tasks"
-version = "0.0.0"
+version = "0.142.4"
 dependencies = [
  "anyhow",
  "chrono",
@@ -2473,7 +2473,7 @@ dependencies = [
 
 [[package]]
 name = "codex-cloud-tasks-client"
-version = "0.0.0"
+version = "0.142.4"
 dependencies = [
  "anyhow",
  "chrono",
@@ -2487,7 +2487,7 @@ dependencies = [
 
 [[package]]
 name = "codex-cloud-tasks-mock-client"
-version = "0.0.0"
+version = "0.142.4"
 dependencies = [
  "chrono",
  "codex-cloud-tasks-client",
@@ -2496,7 +2496,7 @@ dependencies = [
 
 [[package]]
 name = "codex-code-mode"
-version = "0.0.0"
+version = "0.142.4"
 dependencies = [
  "codex-code-mode-protocol",
  "codex-protocol",
@@ -2511,11 +2511,11 @@ dependencies = [
 
 [[package]]
 name = "codex-code-mode-host"
-version = "0.0.0"
+version = "0.142.4"
 
 [[package]]
 name = "codex-code-mode-protocol"
-version = "0.0.0"
+version = "0.142.4"
 dependencies = [
  "codex-protocol",
  "pretty_assertions",
@@ -2527,11 +2527,11 @@ dependencies = [
 
 [[package]]
 name = "codex-collaboration-mode-templates"
-version = "0.0.0"
+version = "0.142.4"
 
 [[package]]
 name = "codex-config"
-version = "0.0.0"
+version = "0.142.4"
 dependencies = [
  "anyhow",
  "base64 0.22.1",
@@ -2579,7 +2579,7 @@ dependencies = [
 
 [[package]]
 name = "codex-connectors"
-version = "0.0.0"
+version = "0.142.4"
 dependencies = [
  "anyhow",
  "codex-app-server-protocol",
@@ -2596,7 +2596,7 @@ dependencies = [
 
 [[package]]
 name = "codex-context-fragments"
-version = "0.0.0"
+version = "0.142.4"
 dependencies = [
  "codex-protocol",
  "codex-utils-string",
@@ -2604,7 +2604,7 @@ dependencies = [
 
 [[package]]
 name = "codex-core"
-version = "0.0.0"
+version = "0.142.4"
 dependencies = [
  "anyhow",
  "arc-swap",
@@ -2728,7 +2728,7 @@ dependencies = [
 
 [[package]]
 name = "codex-core-api"
-version = "0.0.0"
+version = "0.142.4"
 dependencies = [
  "codex-analytics",
  "codex-app-server-protocol",
@@ -2748,7 +2748,7 @@ dependencies = [
 
 [[package]]
 name = "codex-core-plugins"
-version = "0.0.0"
+version = "0.142.4"
 dependencies = [
  "anyhow",
  "chrono",
@@ -2793,7 +2793,7 @@ dependencies = [
 
 [[package]]
 name = "codex-core-skills"
-version = "0.0.0"
+version = "0.142.4"
 dependencies = [
  "anyhow",
  "codex-analytics",
@@ -2828,7 +2828,7 @@ dependencies = [
 
 [[package]]
 name = "codex-exec"
-version = "0.0.0"
+version = "0.142.4"
 dependencies = [
  "anyhow",
  "assert_cmd",
@@ -2874,7 +2874,7 @@ dependencies = [
 
 [[package]]
 name = "codex-exec-server"
-version = "0.0.0"
+version = "0.142.4"
 dependencies = [
  "anyhow",
  "arc-swap",
@@ -2919,7 +2919,7 @@ dependencies = [
 
 [[package]]
 name = "codex-execpolicy"
-version = "0.0.0"
+version = "0.142.4"
 dependencies = [
  "anyhow",
  "clap",
@@ -2936,7 +2936,7 @@ dependencies = [
 
 [[package]]
 name = "codex-execpolicy-legacy"
-version = "0.0.0"
+version = "0.142.4"
 dependencies = [
  "allocative",
  "anyhow",
@@ -2956,7 +2956,7 @@ dependencies = [
 
 [[package]]
 name = "codex-experimental-api-macros"
-version = "0.0.0"
+version = "0.142.4"
 dependencies = [
  "proc-macro2",
  "quote",
@@ -2965,7 +2965,7 @@ dependencies = [
 
 [[package]]
 name = "codex-extension-api"
-version = "0.0.0"
+version = "0.142.4"
 dependencies = [
  "codex-config",
  "codex-context-fragments",
@@ -2978,7 +2978,7 @@ dependencies = [
 
 [[package]]
 name = "codex-external-agent-migration"
-version = "0.0.0"
+version = "0.142.4"
 dependencies = [
  "codex-hooks",
  "pretty_assertions",
@@ -2990,7 +2990,7 @@ dependencies = [
 
 [[package]]
 name = "codex-external-agent-sessions"
-version = "0.0.0"
+version = "0.142.4"
 dependencies = [
  "chrono",
  "codex-app-server-protocol",
@@ -3004,7 +3004,7 @@ dependencies = [
 
 [[package]]
 name = "codex-features"
-version = "0.0.0"
+version = "0.142.4"
 dependencies = [
  "codex-otel",
  "codex-protocol",
@@ -3017,7 +3017,7 @@ dependencies = [
 
 [[package]]
 name = "codex-feedback"
-version = "0.0.0"
+version = "0.142.4"
 dependencies = [
  "anyhow",
  "codex-login",
@@ -3030,7 +3030,7 @@ dependencies = [
 
 [[package]]
 name = "codex-file-search"
-version = "0.0.0"
+version = "0.142.4"
 dependencies = [
  "anyhow",
  "clap",
@@ -3046,7 +3046,7 @@ dependencies = [
 
 [[package]]
 name = "codex-file-system"
-version = "0.0.0"
+version = "0.142.4"
 dependencies = [
  "bytes",
  "codex-protocol",
@@ -3058,7 +3058,7 @@ dependencies = [
 
 [[package]]
 name = "codex-file-watcher"
-version = "0.0.0"
+version = "0.142.4"
 dependencies = [
  "notify",
  "pretty_assertions",
@@ -3069,7 +3069,7 @@ dependencies = [
 
 [[package]]
 name = "codex-git-utils"
-version = "0.0.0"
+version = "0.142.4"
 dependencies = [
  "anyhow",
  "chrono",
@@ -3094,7 +3094,7 @@ dependencies = [
 
 [[package]]
 name = "codex-goal-extension"
-version = "0.0.0"
+version = "0.142.4"
 dependencies = [
  "anyhow",
  "chrono",
@@ -3116,7 +3116,7 @@ dependencies = [
 
 [[package]]
 name = "codex-guardian"
-version = "0.0.0"
+version = "0.142.4"
 dependencies = [
  "codex-core",
  "codex-extension-api",
@@ -3125,7 +3125,7 @@ dependencies = [
 
 [[package]]
 name = "codex-home"
-version = "0.0.0"
+version = "0.142.4"
 dependencies = [
  "codex-extension-api",
  "codex-utils-absolute-path",
@@ -3136,7 +3136,7 @@ dependencies = [
 
 [[package]]
 name = "codex-hooks"
-version = "0.0.0"
+version = "0.142.4"
 dependencies = [
  "anyhow",
  "chrono",
@@ -3159,7 +3159,7 @@ dependencies = [
 
 [[package]]
 name = "codex-image-generation-extension"
-version = "0.0.0"
+version = "0.142.4"
 dependencies = [
  "codex-api",
  "codex-core",
@@ -3182,7 +3182,7 @@ dependencies = [
 
 [[package]]
 name = "codex-install-context"
-version = "0.0.0"
+version = "0.142.4"
 dependencies = [
  "codex-utils-absolute-path",
  "codex-utils-home-dir",
@@ -3192,7 +3192,7 @@ dependencies = [
 
 [[package]]
 name = "codex-keyring-store"
-version = "0.0.0"
+version = "0.142.4"
 dependencies = [
  "keyring",
  "tracing",
@@ -3200,7 +3200,7 @@ dependencies = [
 
 [[package]]
 name = "codex-linux-sandbox"
-version = "0.0.0"
+version = "0.142.4"
 dependencies = [
  "clap",
  "codex-core",
@@ -3224,7 +3224,7 @@ dependencies = [
 
 [[package]]
 name = "codex-lmstudio"
-version = "0.0.0"
+version = "0.142.4"
 dependencies = [
  "codex-core",
  "codex-model-provider-info",
@@ -3238,7 +3238,7 @@ dependencies = [
 
 [[package]]
 name = "codex-login"
-version = "0.0.0"
+version = "0.142.4"
 dependencies = [
  "anyhow",
  "base64 0.22.1",
@@ -3280,7 +3280,7 @@ dependencies = [
 
 [[package]]
 name = "codex-mcp"
-version = "0.0.0"
+version = "0.142.4"
 dependencies = [
  "anyhow",
  "arc-swap",
@@ -3314,7 +3314,7 @@ dependencies = [
 
 [[package]]
 name = "codex-mcp-extension"
-version = "0.0.0"
+version = "0.142.4"
 dependencies = [
  "codex-config",
  "codex-core",
@@ -3338,7 +3338,7 @@ dependencies = [
 
 [[package]]
 name = "codex-mcp-server"
-version = "0.0.0"
+version = "0.142.4"
 dependencies = [
  "anyhow",
  "codex-arg0",
@@ -3371,7 +3371,7 @@ dependencies = [
 
 [[package]]
 name = "codex-memories-extension"
-version = "0.0.0"
+version = "0.142.4"
 dependencies = [
  "codex-core",
  "codex-extension-api",
@@ -3392,7 +3392,7 @@ dependencies = [
 
 [[package]]
 name = "codex-memories-read"
-version = "0.0.0"
+version = "0.142.4"
 dependencies = [
  "codex-protocol",
  "codex-shell-command",
@@ -3402,7 +3402,7 @@ dependencies = [
 
 [[package]]
 name = "codex-memories-write"
-version = "0.0.0"
+version = "0.142.4"
 dependencies = [
  "anyhow",
  "chrono",
@@ -3439,7 +3439,7 @@ dependencies = [
 
 [[package]]
 name = "codex-message-history"
-version = "0.0.0"
+version = "0.142.4"
 dependencies = [
  "codex-config",
  "memchr",
@@ -3453,7 +3453,7 @@ dependencies = [
 
 [[package]]
 name = "codex-model-provider"
-version = "0.0.0"
+version = "0.142.4"
 dependencies = [
  "codex-agent-identity",
  "codex-api",
@@ -3476,7 +3476,7 @@ dependencies = [
 
 [[package]]
 name = "codex-model-provider-info"
-version = "0.0.0"
+version = "0.142.4"
 dependencies = [
  "codex-api",
  "codex-app-server-protocol",
@@ -3493,7 +3493,7 @@ dependencies = [
 
 [[package]]
 name = "codex-models-manager"
-version = "0.0.0"
+version = "0.142.4"
 dependencies = [
  "chrono",
  "codex-app-server-protocol",
@@ -3513,7 +3513,7 @@ dependencies = [
 
 [[package]]
 name = "codex-network-proxy"
-version = "0.0.0"
+version = "0.142.4"
 dependencies = [
  "anyhow",
  "base64 0.22.1",
@@ -3548,7 +3548,7 @@ dependencies = [
 
 [[package]]
 name = "codex-ollama"
-version = "0.0.0"
+version = "0.142.4"
 dependencies = [
  "assert_matches",
  "async-stream",
@@ -3568,7 +3568,7 @@ dependencies = [
 
 [[package]]
 name = "codex-otel"
-version = "0.0.0"
+version = "0.142.4"
 dependencies = [
  "chrono",
  "codex-api",
@@ -3600,7 +3600,7 @@ dependencies = [
 
 [[package]]
 name = "codex-plugin"
-version = "0.0.0"
+version = "0.142.4"
 dependencies = [
  "codex-config",
  "codex-protocol",
@@ -3612,7 +3612,7 @@ dependencies = [
 
 [[package]]
 name = "codex-process-hardening"
-version = "0.0.0"
+version = "0.142.4"
 dependencies = [
  "libc",
  "pretty_assertions",
@@ -3620,7 +3620,7 @@ dependencies = [
 
 [[package]]
 name = "codex-prompts"
-version = "0.0.0"
+version = "0.142.4"
 dependencies = [
  "anyhow",
  "codex-context-fragments",
@@ -3634,7 +3634,7 @@ dependencies = [
 
 [[package]]
 name = "codex-protocol"
-version = "0.0.0"
+version = "0.142.4"
 dependencies = [
  "anyhow",
  "chardetng",
@@ -3675,7 +3675,7 @@ dependencies = [
 
 [[package]]
 name = "codex-realtime-webrtc"
-version = "0.0.0"
+version = "0.142.4"
 dependencies = [
  "libwebrtc",
  "thiserror 2.0.18",
@@ -3684,7 +3684,7 @@ dependencies = [
 
 [[package]]
 name = "codex-response-debug-context"
-version = "0.0.0"
+version = "0.142.4"
 dependencies = [
  "base64 0.22.1",
  "codex-api",
@@ -3695,7 +3695,7 @@ dependencies = [
 
 [[package]]
 name = "codex-responses-api-proxy"
-version = "0.0.0"
+version = "0.142.4"
 dependencies = [
  "anyhow",
  "clap",
@@ -3712,7 +3712,7 @@ dependencies = [
 
 [[package]]
 name = "codex-rmcp-client"
-version = "0.0.0"
+version = "0.142.4"
 dependencies = [
  "anyhow",
  "axum",
@@ -3754,7 +3754,7 @@ dependencies = [
 
 [[package]]
 name = "codex-rollout"
-version = "0.0.0"
+version = "0.142.4"
 dependencies = [
  "anyhow",
  "chrono",
@@ -3779,7 +3779,7 @@ dependencies = [
 
 [[package]]
 name = "codex-rollout-trace"
-version = "0.0.0"
+version = "0.142.4"
 dependencies = [
  "anyhow",
  "codex-code-mode",
@@ -3795,7 +3795,7 @@ dependencies = [
 
 [[package]]
 name = "codex-sandboxing"
-version = "0.0.0"
+version = "0.142.4"
 dependencies = [
  "anyhow",
  "codex-network-proxy",
@@ -3818,7 +3818,7 @@ dependencies = [
 
 [[package]]
 name = "codex-secrets"
-version = "0.0.0"
+version = "0.142.4"
 dependencies = [
  "age",
  "anyhow",
@@ -3839,7 +3839,7 @@ dependencies = [
 
 [[package]]
 name = "codex-shell-command"
-version = "0.0.0"
+version = "0.142.4"
 dependencies = [
  "anyhow",
  "base64 0.22.1",
@@ -3860,7 +3860,7 @@ dependencies = [
 
 [[package]]
 name = "codex-shell-escalation"
-version = "0.0.0"
+version = "0.142.4"
 dependencies = [
  "anyhow",
  "clap",
@@ -3880,7 +3880,7 @@ dependencies = [
 
 [[package]]
 name = "codex-skills"
-version = "0.0.0"
+version = "0.142.4"
 dependencies = [
  "codex-utils-absolute-path",
  "include_dir",
@@ -3889,7 +3889,7 @@ dependencies = [
 
 [[package]]
 name = "codex-skills-extension"
-version = "0.0.0"
+version = "0.142.4"
 dependencies = [
  "codex-core-skills",
  "codex-exec-server",
@@ -3911,7 +3911,7 @@ dependencies = [
 
 [[package]]
 name = "codex-state"
-version = "0.0.0"
+version = "0.142.4"
 dependencies = [
  "anyhow",
  "chrono",
@@ -3935,7 +3935,7 @@ dependencies = [
 
 [[package]]
 name = "codex-stdio-to-uds"
-version = "0.0.0"
+version = "0.142.4"
 dependencies = [
  "anyhow",
  "codex-uds",
@@ -3947,7 +3947,7 @@ dependencies = [
 
 [[package]]
 name = "codex-terminal-detection"
-version = "0.0.0"
+version = "0.142.4"
 dependencies = [
  "pretty_assertions",
  "tracing",
@@ -3955,7 +3955,7 @@ dependencies = [
 
 [[package]]
 name = "codex-test-binary-support"
-version = "0.0.0"
+version = "0.142.4"
 dependencies = [
  "codex-arg0",
  "tempfile",
@@ -3963,7 +3963,7 @@ dependencies = [
 
 [[package]]
 name = "codex-thread-manager-sample"
-version = "0.0.0"
+version = "0.142.4"
 dependencies = [
  "anyhow",
  "clap",
@@ -3974,7 +3974,7 @@ dependencies = [
 
 [[package]]
 name = "codex-thread-store"
-version = "0.0.0"
+version = "0.142.4"
 dependencies = [
  "chrono",
  "codex-git-utils",
@@ -3995,7 +3995,7 @@ dependencies = [
 
 [[package]]
 name = "codex-tools"
-version = "0.0.0"
+version = "0.142.4"
 dependencies = [
  "codex-app-server-protocol",
  "codex-code-mode",
@@ -4019,7 +4019,7 @@ dependencies = [
 
 [[package]]
 name = "codex-tui"
-version = "0.0.0"
+version = "0.142.4"
 dependencies = [
  "anyhow",
  "app_test_support",
@@ -4129,7 +4129,7 @@ dependencies = [
 
 [[package]]
 name = "codex-uds"
-version = "0.0.0"
+version = "0.142.4"
 dependencies = [
  "async-io",
  "pretty_assertions",
@@ -4141,7 +4141,7 @@ dependencies = [
 
 [[package]]
 name = "codex-utils-absolute-path"
-version = "0.0.0"
+version = "0.142.4"
 dependencies = [
  "dirs",
  "dunce",
@@ -4155,14 +4155,14 @@ dependencies = [
 
 [[package]]
 name = "codex-utils-approval-presets"
-version = "0.0.0"
+version = "0.142.4"
 dependencies = [
  "codex-protocol",
 ]
 
 [[package]]
 name = "codex-utils-cache"
-version = "0.0.0"
+version = "0.142.4"
 dependencies = [
  "lru 0.16.3",
  "sha1 0.10.6",
@@ -4171,7 +4171,7 @@ dependencies = [
 
 [[package]]
 name = "codex-utils-cargo-bin"
-version = "0.0.0"
+version = "0.142.4"
 dependencies = [
  "assert_cmd",
  "runfiles",
@@ -4180,7 +4180,7 @@ dependencies = [
 
 [[package]]
 name = "codex-utils-cli"
-version = "0.0.0"
+version = "0.142.4"
 dependencies = [
  "clap",
  "codex-protocol",
@@ -4192,15 +4192,15 @@ dependencies = [
 
 [[package]]
 name = "codex-utils-elapsed"
-version = "0.0.0"
+version = "0.142.4"
 
 [[package]]
 name = "codex-utils-fuzzy-match"
-version = "0.0.0"
+version = "0.142.4"
 
 [[package]]
 name = "codex-utils-home-dir"
-version = "0.0.0"
+version = "0.142.4"
 dependencies = [
  "codex-utils-absolute-path",
  "dirs",
@@ -4210,7 +4210,7 @@ dependencies = [
 
 [[package]]
 name = "codex-utils-image"
-version = "0.0.0"
+version = "0.142.4"
 dependencies = [
  "base64 0.22.1",
  "codex-utils-cache",
@@ -4223,7 +4223,7 @@ dependencies = [
 
 [[package]]
 name = "codex-utils-json-to-toml"
-version = "0.0.0"
+version = "0.142.4"
 dependencies = [
  "pretty_assertions",
  "serde_json",
@@ -4232,7 +4232,7 @@ dependencies = [
 
 [[package]]
 name = "codex-utils-oss"
-version = "0.0.0"
+version = "0.142.4"
 dependencies = [
  "codex-core",
  "codex-lmstudio",
@@ -4242,7 +4242,7 @@ dependencies = [
 
 [[package]]
 name = "codex-utils-output-truncation"
-version = "0.0.0"
+version = "0.142.4"
 dependencies = [
  "codex-protocol",
  "codex-utils-string",
@@ -4251,7 +4251,7 @@ dependencies = [
 
 [[package]]
 name = "codex-utils-path"
-version = "0.0.0"
+version = "0.142.4"
 dependencies = [
  "codex-utils-absolute-path",
  "dunce",
@@ -4261,7 +4261,7 @@ dependencies = [
 
 [[package]]
 name = "codex-utils-path-uri"
-version = "0.0.0"
+version = "0.142.4"
 dependencies = [
  "base64 0.22.1",
  "codex-utils-absolute-path",
@@ -4277,7 +4277,7 @@ dependencies = [
 
 [[package]]
 name = "codex-utils-plugins"
-version = "0.0.0"
+version = "0.142.4"
 dependencies = [
  "codex-exec-server",
  "codex-utils-absolute-path",
@@ -4290,7 +4290,7 @@ dependencies = [
 
 [[package]]
 name = "codex-utils-pty"
-version = "0.0.0"
+version = "0.142.4"
 dependencies = [
  "anyhow",
  "filedescriptor",
@@ -4306,7 +4306,7 @@ dependencies = [
 
 [[package]]
 name = "codex-utils-readiness"
-version = "0.0.0"
+version = "0.142.4"
 dependencies = [
  "assert_matches",
  "thiserror 2.0.18",
@@ -4316,14 +4316,14 @@ dependencies = [
 
 [[package]]
 name = "codex-utils-rustls-provider"
-version = "0.0.0"
+version = "0.142.4"
 dependencies = [
  "rustls",
 ]
 
 [[package]]
 name = "codex-utils-sandbox-summary"
-version = "0.0.0"
+version = "0.142.4"
 dependencies = [
  "codex-core",
  "codex-model-provider-info",
@@ -4334,7 +4334,7 @@ dependencies = [
 
 [[package]]
 name = "codex-utils-sleep-inhibitor"
-version = "0.0.0"
+version = "0.142.4"
 dependencies = [
  "core-foundation 0.9.4",
  "libc",
@@ -4344,14 +4344,14 @@ dependencies = [
 
 [[package]]
 name = "codex-utils-stream-parser"
-version = "0.0.0"
+version = "0.142.4"
 dependencies = [
  "pretty_assertions",
 ]
 
 [[package]]
 name = "codex-utils-string"
-version = "0.0.0"
+version = "0.142.4"
 dependencies = [
  "pretty_assertions",
  "regex-lite",
@@ -4361,14 +4361,14 @@ dependencies = [
 
 [[package]]
 name = "codex-utils-template"
-version = "0.0.0"
+version = "0.142.4"
 dependencies = [
  "pretty_assertions",
 ]
 
 [[package]]
 name = "codex-v8-poc"
-version = "0.0.0"
+version = "0.142.4"
 dependencies = [
  "pretty_assertions",
  "v8",
@@ -4376,7 +4376,7 @@ dependencies = [
 
 [[package]]
 name = "codex-web-search-extension"
-version = "0.0.0"
+version = "0.142.4"
 dependencies = [
  "codex-api",
  "codex-core",
@@ -4395,7 +4395,7 @@ dependencies = [
 
 [[package]]
 name = "codex-windows-sandbox"
-version = "0.0.0"
+version = "0.142.4"
 dependencies = [
  "anyhow",
  "base64 0.22.1",
@@ -4652,7 +4652,7 @@ dependencies = [
 
 [[package]]
 name = "core_test_support"
-version = "0.0.0"
+version = "0.142.4"
 dependencies = [
  "anyhow",
  "assert_cmd",
@@ -9038,7 +9038,7 @@ dependencies = [
 
 [[package]]
 name = "mcp_test_support"
-version = "0.0.0"
+version = "0.142.4"
 dependencies = [
  "anyhow",
  "codex-login",
diff --git a/codex-rs/Cargo.toml b/codex-rs/Cargo.toml
index 9c0a91d..cb4ed4e 100644
--- a/codex-rs/Cargo.toml
+++ b/codex-rs/Cargo.toml
@@ -367,7 +367,7 @@ rcgen = { version = "0.14.7", default-features = false, features = [
 ] }
 regex = "1.12.3"
 regex-lite = "0.1.8"
-reqwest = { version = "0.12", features = ["cookies"] }
+reqwest = { version = "0.12", default-features = false, features = ["cookies", "rustls-tls"] }
 rmcp = { version = "1.7.0", default-features = false }
 runfiles = { git = "https://github.com/dzbarsky/rules_rust", rev = "b56cbaa8465e74127f1ea216f813cd377295ad81" }
 rustls = { version = "0.23", default-features = false, features = [
diff --git a/codex-rs/app-server-transport/src/transport/unix_socket.rs b/codex-rs/app-server-transport/src/transport/unix_socket.rs
index dd46d88..5cb14da 100644
--- a/codex-rs/app-server-transport/src/transport/unix_socket.rs
+++ b/codex-rs/app-server-transport/src/transport/unix_socket.rs
@@ -148,6 +148,7 @@ pub async fn acquire_app_server_startup_lock(
             .read(true)
             .write(true)
             .open(startup_lock_path.as_path())?;
+        #[cfg(not(target_os = "android"))]
         file.lock()?;
         Ok(AppServerStartupLock { _file: file })
     })
diff --git a/codex-rs/arg0/src/lib.rs b/codex-rs/arg0/src/lib.rs
index 1c28f81..e86be57 100644
--- a/codex-rs/arg0/src/lib.rs
+++ b/codex-rs/arg0/src/lib.rs
@@ -20,7 +20,10 @@ const MISSPELLED_APPLY_PATCH_ARG0: &str = "applypatch";
 #[cfg(unix)]
 const EXECVE_WRAPPER_ARG0: &str = "codex-execve-wrapper";
 const LOCK_FILENAME: &str = ".lock";
+#[cfg(not(target_os = "android"))]
 const TOKIO_WORKER_STACK_SIZE_BYTES: usize = 16 * 1024 * 1024;
+#[cfg(target_os = "android")]
+const TOKIO_WORKER_STACK_SIZE_BYTES: usize = 8 * 1024 * 1024; // pthread_create fails with 16 MiB on Android
 
 #[derive(Clone, Debug, Default, Eq, PartialEq)]
 pub struct Arg0DispatchPaths {
@@ -371,6 +374,7 @@ fn prepare_path_entry_for_codex_aliases(
         .create(true)
         .truncate(false)
         .open(&lock_path)?;
+    #[cfg(not(target_os = "android"))]
     lock_file.try_lock()?;
 
     for filename in &[
@@ -507,6 +511,8 @@ fn try_lock_dir(dir: &Path) -> std::io::Result<Option<File>> {
     match lock_file.try_lock() {
         Ok(()) => Ok(Some(lock_file)),
         Err(std::fs::TryLockError::WouldBlock) => Ok(None),
+        #[cfg(target_os = "android")]
+        Err(_) => Ok(None),
         Err(err) => Err(err.into()),
     }
 }
diff --git a/codex-rs/core/Cargo.toml b/codex-rs/core/Cargo.toml
index d16e8d9..55f7d38 100644
--- a/codex-rs/core/Cargo.toml
+++ b/codex-rs/core/Cargo.toml
@@ -128,6 +128,9 @@ openssl-sys = { workspace = true, features = ["vendored"] }
 [target.aarch64-unknown-linux-musl.dependencies]
 openssl-sys = { workspace = true, features = ["vendored"] }
 
+[target.aarch64-linux-android.dependencies]
+openssl-sys = { workspace = true, features = ["vendored"] }
+
 [target.'cfg(unix)'.dependencies]
 codex-shell-escalation = { workspace = true }
 
diff --git a/codex-rs/core/src/installation_id.rs b/codex-rs/core/src/installation_id.rs
index a42e6b6..cc1fb33 100644
--- a/codex-rs/core/src/installation_id.rs
+++ b/codex-rs/core/src/installation_id.rs
@@ -29,6 +29,7 @@ pub async fn resolve_installation_id(codex_home: &AbsolutePathBuf) -> Result<Str
         }
 
         let mut file = options.open(&path)?;
+        #[cfg(not(target_os = "android"))]
         file.lock()?;
 
         #[cfg(unix)]
