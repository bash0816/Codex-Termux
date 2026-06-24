# Applied Android Patches

Source repository: openai/codex
Source ref: rust-v0.142.0
Source SHA: 3a76f3ac68c8949d1cac6ea769b6ec7b8953a415
Built by: bash0816/Codex-Termux @ main (213f1e83464120908dcacac9ce061f437d292646)
Build timestamp: 2026-06-23T22:25:38Z

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
index cd658f9..314f8e5 100644
--- a/codex-rs/Cargo.lock
+++ b/codex-rs/Cargo.lock
@@ -394,7 +394,7 @@ checksum = "7f202df86484c868dbad7eaa557ef785d5c66295e41b460ef922eca0723b842c"
 
 [[package]]
 name = "app_test_support"
-version = "0.0.0"
+version = "0.142.0"
 dependencies = [
  "anyhow",
  "base64 0.22.1",
@@ -1863,7 +1863,7 @@ dependencies = [
 
 [[package]]
 name = "codex-agent-graph-store"
-version = "0.0.0"
+version = "0.142.0"
 dependencies = [
  "codex-protocol",
  "codex-state",
@@ -1877,7 +1877,7 @@ dependencies = [
 
 [[package]]
 name = "codex-agent-identity"
-version = "0.0.0"
+version = "0.142.0"
 dependencies = [
  "anyhow",
  "base64 0.22.1",
@@ -1896,7 +1896,7 @@ dependencies = [
 
 [[package]]
 name = "codex-analytics"
-version = "0.0.0"
+version = "0.142.0"
 dependencies = [
  "codex-app-server-protocol",
  "codex-git-utils",
@@ -1917,7 +1917,7 @@ dependencies = [
 
 [[package]]
 name = "codex-ansi-escape"
-version = "0.0.0"
+version = "0.142.0"
 dependencies = [
  "ansi-to-tui",
  "ratatui",
@@ -1926,7 +1926,7 @@ dependencies = [
 
 [[package]]
 name = "codex-api"
-version = "0.0.0"
+version = "0.142.0"
 dependencies = [
  "anyhow",
  "assert_matches",
@@ -1959,7 +1959,7 @@ dependencies = [
 
 [[package]]
 name = "codex-app-server"
-version = "0.0.0"
+version = "0.142.0"
 dependencies = [
  "anyhow",
  "app_test_support",
@@ -2051,7 +2051,7 @@ dependencies = [
 
 [[package]]
 name = "codex-app-server-client"
-version = "0.0.0"
+version = "0.142.0"
 dependencies = [
  "codex-app-server",
  "codex-app-server-protocol",
@@ -2078,7 +2078,7 @@ dependencies = [
 
 [[package]]
 name = "codex-app-server-daemon"
-version = "0.0.0"
+version = "0.142.0"
 dependencies = [
  "anyhow",
  "codex-app-server-protocol",
@@ -2099,7 +2099,7 @@ dependencies = [
 
 [[package]]
 name = "codex-app-server-protocol"
-version = "0.0.0"
+version = "0.142.0"
 dependencies = [
  "anyhow",
  "clap",
@@ -2127,7 +2127,7 @@ dependencies = [
 
 [[package]]
 name = "codex-app-server-test-client"
-version = "0.0.0"
+version = "0.142.0"
 dependencies = [
  "anyhow",
  "clap",
@@ -2149,7 +2149,7 @@ dependencies = [
 
 [[package]]
 name = "codex-app-server-transport"
-version = "0.0.0"
+version = "0.142.0"
 dependencies = [
  "anyhow",
  "axum",
@@ -2188,7 +2188,7 @@ dependencies = [
 
 [[package]]
 name = "codex-apply-patch"
-version = "0.0.0"
+version = "0.142.0"
 dependencies = [
  "anyhow",
  "assert_cmd",
@@ -2208,7 +2208,7 @@ dependencies = [
 
 [[package]]
 name = "codex-arg0"
-version = "0.0.0"
+version = "0.142.0"
 dependencies = [
  "anyhow",
  "codex-apply-patch",
@@ -2228,7 +2228,7 @@ dependencies = [
 
 [[package]]
 name = "codex-async-utils"
-version = "0.0.0"
+version = "0.142.0"
 dependencies = [
  "pretty_assertions",
  "tokio",
@@ -2237,7 +2237,7 @@ dependencies = [
 
 [[package]]
 name = "codex-aws-auth"
-version = "0.0.0"
+version = "0.142.0"
 dependencies = [
  "aws-config",
  "aws-credential-types",
@@ -2252,7 +2252,7 @@ dependencies = [
 
 [[package]]
 name = "codex-backend-client"
-version = "0.0.0"
+version = "0.142.0"
 dependencies = [
  "anyhow",
  "codex-api",
@@ -2269,7 +2269,7 @@ dependencies = [
 
 [[package]]
 name = "codex-backend-openapi-models"
-version = "0.0.0"
+version = "0.142.0"
 dependencies = [
  "serde",
  "serde_json",
@@ -2278,7 +2278,7 @@ dependencies = [
 
 [[package]]
 name = "codex-bwrap"
-version = "0.0.0"
+version = "0.142.0"
 dependencies = [
  "cc",
  "libc",
@@ -2287,7 +2287,7 @@ dependencies = [
 
 [[package]]
 name = "codex-chatgpt"
-version = "0.0.0"
+version = "0.142.0"
 dependencies = [
  "anyhow",
  "clap",
@@ -2309,7 +2309,7 @@ dependencies = [
 
 [[package]]
 name = "codex-cli"
-version = "0.0.0"
+version = "0.142.0"
 dependencies = [
  "anyhow",
  "assert_cmd",
@@ -2385,7 +2385,7 @@ dependencies = [
 
 [[package]]
 name = "codex-client"
-version = "0.0.0"
+version = "0.142.0"
 dependencies = [
  "bytes",
  "codex-utils-cargo-bin",
@@ -2415,7 +2415,7 @@ dependencies = [
 
 [[package]]
 name = "codex-cloud-config"
-version = "0.0.0"
+version = "0.142.0"
 dependencies = [
  "base64 0.22.1",
  "chrono",
@@ -2439,7 +2439,7 @@ dependencies = [
 
 [[package]]
 name = "codex-cloud-tasks"
-version = "0.0.0"
+version = "0.142.0"
 dependencies = [
  "anyhow",
  "chrono",
@@ -2470,7 +2470,7 @@ dependencies = [
 
 [[package]]
 name = "codex-cloud-tasks-client"
-version = "0.0.0"
+version = "0.142.0"
 dependencies = [
  "anyhow",
  "chrono",
@@ -2484,7 +2484,7 @@ dependencies = [
 
 [[package]]
 name = "codex-cloud-tasks-mock-client"
-version = "0.0.0"
+version = "0.142.0"
 dependencies = [
  "chrono",
  "codex-cloud-tasks-client",
@@ -2493,7 +2493,7 @@ dependencies = [
 
 [[package]]
 name = "codex-code-mode"
-version = "0.0.0"
+version = "0.142.0"
 dependencies = [
  "codex-code-mode-protocol",
  "codex-protocol",
@@ -2508,11 +2508,11 @@ dependencies = [
 
 [[package]]
 name = "codex-code-mode-host"
-version = "0.0.0"
+version = "0.142.0"
 
 [[package]]
 name = "codex-code-mode-protocol"
-version = "0.0.0"
+version = "0.142.0"
 dependencies = [
  "codex-protocol",
  "pretty_assertions",
@@ -2524,11 +2524,11 @@ dependencies = [
 
 [[package]]
 name = "codex-collaboration-mode-templates"
-version = "0.0.0"
+version = "0.142.0"
 
 [[package]]
 name = "codex-config"
-version = "0.0.0"
+version = "0.142.0"
 dependencies = [
  "anyhow",
  "base64 0.22.1",
@@ -2576,7 +2576,7 @@ dependencies = [
 
 [[package]]
 name = "codex-connectors"
-version = "0.0.0"
+version = "0.142.0"
 dependencies = [
  "anyhow",
  "codex-app-server-protocol",
@@ -2593,7 +2593,7 @@ dependencies = [
 
 [[package]]
 name = "codex-context-fragments"
-version = "0.0.0"
+version = "0.142.0"
 dependencies = [
  "codex-protocol",
  "codex-utils-string",
@@ -2601,7 +2601,7 @@ dependencies = [
 
 [[package]]
 name = "codex-core"
-version = "0.0.0"
+version = "0.142.0"
 dependencies = [
  "anyhow",
  "arc-swap",
@@ -2725,7 +2725,7 @@ dependencies = [
 
 [[package]]
 name = "codex-core-api"
-version = "0.0.0"
+version = "0.142.0"
 dependencies = [
  "codex-analytics",
  "codex-app-server-protocol",
@@ -2745,7 +2745,7 @@ dependencies = [
 
 [[package]]
 name = "codex-core-plugins"
-version = "0.0.0"
+version = "0.142.0"
 dependencies = [
  "anyhow",
  "chrono",
@@ -2790,7 +2790,7 @@ dependencies = [
 
 [[package]]
 name = "codex-core-skills"
-version = "0.0.0"
+version = "0.142.0"
 dependencies = [
  "anyhow",
  "codex-analytics",
@@ -2825,7 +2825,7 @@ dependencies = [
 
 [[package]]
 name = "codex-exec"
-version = "0.0.0"
+version = "0.142.0"
 dependencies = [
  "anyhow",
  "assert_cmd",
@@ -2871,7 +2871,7 @@ dependencies = [
 
 [[package]]
 name = "codex-exec-server"
-version = "0.0.0"
+version = "0.142.0"
 dependencies = [
  "anyhow",
  "arc-swap",
@@ -2916,7 +2916,7 @@ dependencies = [
 
 [[package]]
 name = "codex-execpolicy"
-version = "0.0.0"
+version = "0.142.0"
 dependencies = [
  "anyhow",
  "clap",
@@ -2933,7 +2933,7 @@ dependencies = [
 
 [[package]]
 name = "codex-execpolicy-legacy"
-version = "0.0.0"
+version = "0.142.0"
 dependencies = [
  "allocative",
  "anyhow",
@@ -2953,7 +2953,7 @@ dependencies = [
 
 [[package]]
 name = "codex-experimental-api-macros"
-version = "0.0.0"
+version = "0.142.0"
 dependencies = [
  "proc-macro2",
  "quote",
@@ -2962,7 +2962,7 @@ dependencies = [
 
 [[package]]
 name = "codex-extension-api"
-version = "0.0.0"
+version = "0.142.0"
 dependencies = [
  "codex-config",
  "codex-context-fragments",
@@ -2975,7 +2975,7 @@ dependencies = [
 
 [[package]]
 name = "codex-external-agent-migration"
-version = "0.0.0"
+version = "0.142.0"
 dependencies = [
  "codex-hooks",
  "pretty_assertions",
@@ -2987,7 +2987,7 @@ dependencies = [
 
 [[package]]
 name = "codex-external-agent-sessions"
-version = "0.0.0"
+version = "0.142.0"
 dependencies = [
  "chrono",
  "codex-app-server-protocol",
@@ -3001,7 +3001,7 @@ dependencies = [
 
 [[package]]
 name = "codex-features"
-version = "0.0.0"
+version = "0.142.0"
 dependencies = [
  "codex-otel",
  "codex-protocol",
@@ -3014,7 +3014,7 @@ dependencies = [
 
 [[package]]
 name = "codex-feedback"
-version = "0.0.0"
+version = "0.142.0"
 dependencies = [
  "anyhow",
  "codex-login",
@@ -3027,7 +3027,7 @@ dependencies = [
 
 [[package]]
 name = "codex-file-search"
-version = "0.0.0"
+version = "0.142.0"
 dependencies = [
  "anyhow",
  "clap",
@@ -3043,7 +3043,7 @@ dependencies = [
 
 [[package]]
 name = "codex-file-system"
-version = "0.0.0"
+version = "0.142.0"
 dependencies = [
  "bytes",
  "codex-protocol",
@@ -3055,7 +3055,7 @@ dependencies = [
 
 [[package]]
 name = "codex-file-watcher"
-version = "0.0.0"
+version = "0.142.0"
 dependencies = [
  "notify",
  "pretty_assertions",
@@ -3066,7 +3066,7 @@ dependencies = [
 
 [[package]]
 name = "codex-git-utils"
-version = "0.0.0"
+version = "0.142.0"
 dependencies = [
  "anyhow",
  "chrono",
@@ -3091,7 +3091,7 @@ dependencies = [
 
 [[package]]
 name = "codex-goal-extension"
-version = "0.0.0"
+version = "0.142.0"
 dependencies = [
  "anyhow",
  "chrono",
@@ -3113,7 +3113,7 @@ dependencies = [
 
 [[package]]
 name = "codex-guardian"
-version = "0.0.0"
+version = "0.142.0"
 dependencies = [
  "codex-core",
  "codex-extension-api",
@@ -3122,7 +3122,7 @@ dependencies = [
 
 [[package]]
 name = "codex-home"
-version = "0.0.0"
+version = "0.142.0"
 dependencies = [
  "codex-extension-api",
  "codex-utils-absolute-path",
@@ -3133,7 +3133,7 @@ dependencies = [
 
 [[package]]
 name = "codex-hooks"
-version = "0.0.0"
+version = "0.142.0"
 dependencies = [
  "anyhow",
  "chrono",
@@ -3156,7 +3156,7 @@ dependencies = [
 
 [[package]]
 name = "codex-image-generation-extension"
-version = "0.0.0"
+version = "0.142.0"
 dependencies = [
  "codex-api",
  "codex-core",
@@ -3179,7 +3179,7 @@ dependencies = [
 
 [[package]]
 name = "codex-install-context"
-version = "0.0.0"
+version = "0.142.0"
 dependencies = [
  "codex-utils-absolute-path",
  "codex-utils-home-dir",
@@ -3189,7 +3189,7 @@ dependencies = [
 
 [[package]]
 name = "codex-keyring-store"
-version = "0.0.0"
+version = "0.142.0"
 dependencies = [
  "keyring",
  "tracing",
@@ -3197,7 +3197,7 @@ dependencies = [
 
 [[package]]
 name = "codex-linux-sandbox"
-version = "0.0.0"
+version = "0.142.0"
 dependencies = [
  "clap",
  "codex-core",
@@ -3221,7 +3221,7 @@ dependencies = [
 
 [[package]]
 name = "codex-lmstudio"
-version = "0.0.0"
+version = "0.142.0"
 dependencies = [
  "codex-core",
  "codex-model-provider-info",
@@ -3235,7 +3235,7 @@ dependencies = [
 
 [[package]]
 name = "codex-login"
-version = "0.0.0"
+version = "0.142.0"
 dependencies = [
  "anyhow",
  "base64 0.22.1",
@@ -3277,7 +3277,7 @@ dependencies = [
 
 [[package]]
 name = "codex-mcp"
-version = "0.0.0"
+version = "0.142.0"
 dependencies = [
  "anyhow",
  "arc-swap",
@@ -3311,7 +3311,7 @@ dependencies = [
 
 [[package]]
 name = "codex-mcp-extension"
-version = "0.0.0"
+version = "0.142.0"
 dependencies = [
  "codex-config",
  "codex-core",
@@ -3335,7 +3335,7 @@ dependencies = [
 
 [[package]]
 name = "codex-mcp-server"
-version = "0.0.0"
+version = "0.142.0"
 dependencies = [
  "anyhow",
  "codex-arg0",
@@ -3368,7 +3368,7 @@ dependencies = [
 
 [[package]]
 name = "codex-memories-extension"
-version = "0.0.0"
+version = "0.142.0"
 dependencies = [
  "codex-core",
  "codex-extension-api",
@@ -3389,7 +3389,7 @@ dependencies = [
 
 [[package]]
 name = "codex-memories-read"
-version = "0.0.0"
+version = "0.142.0"
 dependencies = [
  "codex-protocol",
  "codex-shell-command",
@@ -3399,7 +3399,7 @@ dependencies = [
 
 [[package]]
 name = "codex-memories-write"
-version = "0.0.0"
+version = "0.142.0"
 dependencies = [
  "anyhow",
  "chrono",
@@ -3436,7 +3436,7 @@ dependencies = [
 
 [[package]]
 name = "codex-message-history"
-version = "0.0.0"
+version = "0.142.0"
 dependencies = [
  "codex-config",
  "memchr",
@@ -3450,7 +3450,7 @@ dependencies = [
 
 [[package]]
 name = "codex-model-provider"
-version = "0.0.0"
+version = "0.142.0"
 dependencies = [
  "codex-agent-identity",
  "codex-api",
@@ -3473,7 +3473,7 @@ dependencies = [
 
 [[package]]
 name = "codex-model-provider-info"
-version = "0.0.0"
+version = "0.142.0"
 dependencies = [
  "codex-api",
  "codex-app-server-protocol",
@@ -3490,7 +3490,7 @@ dependencies = [
 
 [[package]]
 name = "codex-models-manager"
-version = "0.0.0"
+version = "0.142.0"
 dependencies = [
  "chrono",
  "codex-app-server-protocol",
@@ -3510,7 +3510,7 @@ dependencies = [
 
 [[package]]
 name = "codex-network-proxy"
-version = "0.0.0"
+version = "0.142.0"
 dependencies = [
  "anyhow",
  "base64 0.22.1",
@@ -3545,7 +3545,7 @@ dependencies = [
 
 [[package]]
 name = "codex-ollama"
-version = "0.0.0"
+version = "0.142.0"
 dependencies = [
  "assert_matches",
  "async-stream",
@@ -3565,7 +3565,7 @@ dependencies = [
 
 [[package]]
 name = "codex-otel"
-version = "0.0.0"
+version = "0.142.0"
 dependencies = [
  "chrono",
  "codex-api",
@@ -3597,7 +3597,7 @@ dependencies = [
 
 [[package]]
 name = "codex-plugin"
-version = "0.0.0"
+version = "0.142.0"
 dependencies = [
  "codex-config",
  "codex-protocol",
@@ -3609,7 +3609,7 @@ dependencies = [
 
 [[package]]
 name = "codex-process-hardening"
-version = "0.0.0"
+version = "0.142.0"
 dependencies = [
  "libc",
  "pretty_assertions",
@@ -3617,7 +3617,7 @@ dependencies = [
 
 [[package]]
 name = "codex-prompts"
-version = "0.0.0"
+version = "0.142.0"
 dependencies = [
  "anyhow",
  "codex-context-fragments",
@@ -3631,7 +3631,7 @@ dependencies = [
 
 [[package]]
 name = "codex-protocol"
-version = "0.0.0"
+version = "0.142.0"
 dependencies = [
  "anyhow",
  "chardetng",
@@ -3672,7 +3672,7 @@ dependencies = [
 
 [[package]]
 name = "codex-realtime-webrtc"
-version = "0.0.0"
+version = "0.142.0"
 dependencies = [
  "libwebrtc",
  "thiserror 2.0.18",
@@ -3681,7 +3681,7 @@ dependencies = [
 
 [[package]]
 name = "codex-response-debug-context"
-version = "0.0.0"
+version = "0.142.0"
 dependencies = [
  "base64 0.22.1",
  "codex-api",
@@ -3692,7 +3692,7 @@ dependencies = [
 
 [[package]]
 name = "codex-responses-api-proxy"
-version = "0.0.0"
+version = "0.142.0"
 dependencies = [
  "anyhow",
  "clap",
@@ -3709,7 +3709,7 @@ dependencies = [
 
 [[package]]
 name = "codex-rmcp-client"
-version = "0.0.0"
+version = "0.142.0"
 dependencies = [
  "anyhow",
  "axum",
@@ -3751,7 +3751,7 @@ dependencies = [
 
 [[package]]
 name = "codex-rollout"
-version = "0.0.0"
+version = "0.142.0"
 dependencies = [
  "anyhow",
  "chrono",
@@ -3776,7 +3776,7 @@ dependencies = [
 
 [[package]]
 name = "codex-rollout-trace"
-version = "0.0.0"
+version = "0.142.0"
 dependencies = [
  "anyhow",
  "codex-code-mode",
@@ -3792,7 +3792,7 @@ dependencies = [
 
 [[package]]
 name = "codex-sandboxing"
-version = "0.0.0"
+version = "0.142.0"
 dependencies = [
  "anyhow",
  "codex-network-proxy",
@@ -3815,7 +3815,7 @@ dependencies = [
 
 [[package]]
 name = "codex-secrets"
-version = "0.0.0"
+version = "0.142.0"
 dependencies = [
  "age",
  "anyhow",
@@ -3836,7 +3836,7 @@ dependencies = [
 
 [[package]]
 name = "codex-shell-command"
-version = "0.0.0"
+version = "0.142.0"
 dependencies = [
  "anyhow",
  "base64 0.22.1",
@@ -3857,7 +3857,7 @@ dependencies = [
 
 [[package]]
 name = "codex-shell-escalation"
-version = "0.0.0"
+version = "0.142.0"
 dependencies = [
  "anyhow",
  "clap",
@@ -3877,7 +3877,7 @@ dependencies = [
 
 [[package]]
 name = "codex-skills"
-version = "0.0.0"
+version = "0.142.0"
 dependencies = [
  "codex-utils-absolute-path",
  "include_dir",
@@ -3886,7 +3886,7 @@ dependencies = [
 
 [[package]]
 name = "codex-skills-extension"
-version = "0.0.0"
+version = "0.142.0"
 dependencies = [
  "codex-core-skills",
  "codex-exec-server",
@@ -3908,7 +3908,7 @@ dependencies = [
 
 [[package]]
 name = "codex-state"
-version = "0.0.0"
+version = "0.142.0"
 dependencies = [
  "anyhow",
  "chrono",
@@ -3932,7 +3932,7 @@ dependencies = [
 
 [[package]]
 name = "codex-stdio-to-uds"
-version = "0.0.0"
+version = "0.142.0"
 dependencies = [
  "anyhow",
  "codex-uds",
@@ -3944,7 +3944,7 @@ dependencies = [
 
 [[package]]
 name = "codex-terminal-detection"
-version = "0.0.0"
+version = "0.142.0"
 dependencies = [
  "pretty_assertions",
  "tracing",
@@ -3952,7 +3952,7 @@ dependencies = [
 
 [[package]]
 name = "codex-test-binary-support"
-version = "0.0.0"
+version = "0.142.0"
 dependencies = [
  "codex-arg0",
  "tempfile",
@@ -3960,7 +3960,7 @@ dependencies = [
 
 [[package]]
 name = "codex-thread-manager-sample"
-version = "0.0.0"
+version = "0.142.0"
 dependencies = [
  "anyhow",
  "clap",
@@ -3971,7 +3971,7 @@ dependencies = [
 
 [[package]]
 name = "codex-thread-store"
-version = "0.0.0"
+version = "0.142.0"
 dependencies = [
  "chrono",
  "codex-git-utils",
@@ -3992,7 +3992,7 @@ dependencies = [
 
 [[package]]
 name = "codex-tools"
-version = "0.0.0"
+version = "0.142.0"
 dependencies = [
  "codex-app-server-protocol",
  "codex-code-mode",
@@ -4016,7 +4016,7 @@ dependencies = [
 
 [[package]]
 name = "codex-tui"
-version = "0.0.0"
+version = "0.142.0"
 dependencies = [
  "anyhow",
  "app_test_support",
@@ -4126,7 +4126,7 @@ dependencies = [
 
 [[package]]
 name = "codex-uds"
-version = "0.0.0"
+version = "0.142.0"
 dependencies = [
  "async-io",
  "pretty_assertions",
@@ -4138,7 +4138,7 @@ dependencies = [
 
 [[package]]
 name = "codex-utils-absolute-path"
-version = "0.0.0"
+version = "0.142.0"
 dependencies = [
  "dirs",
  "dunce",
@@ -4152,14 +4152,14 @@ dependencies = [
 
 [[package]]
 name = "codex-utils-approval-presets"
-version = "0.0.0"
+version = "0.142.0"
 dependencies = [
  "codex-protocol",
 ]
 
 [[package]]
 name = "codex-utils-cache"
-version = "0.0.0"
+version = "0.142.0"
 dependencies = [
  "lru 0.16.3",
  "sha1 0.10.6",
@@ -4168,7 +4168,7 @@ dependencies = [
 
 [[package]]
 name = "codex-utils-cargo-bin"
-version = "0.0.0"
+version = "0.142.0"
 dependencies = [
  "assert_cmd",
  "runfiles",
@@ -4177,7 +4177,7 @@ dependencies = [
 
 [[package]]
 name = "codex-utils-cli"
-version = "0.0.0"
+version = "0.142.0"
 dependencies = [
  "clap",
  "codex-protocol",
@@ -4189,15 +4189,15 @@ dependencies = [
 
 [[package]]
 name = "codex-utils-elapsed"
-version = "0.0.0"
+version = "0.142.0"
 
 [[package]]
 name = "codex-utils-fuzzy-match"
-version = "0.0.0"
+version = "0.142.0"
 
 [[package]]
 name = "codex-utils-home-dir"
-version = "0.0.0"
+version = "0.142.0"
 dependencies = [
  "codex-utils-absolute-path",
  "dirs",
@@ -4207,7 +4207,7 @@ dependencies = [
 
 [[package]]
 name = "codex-utils-image"
-version = "0.0.0"
+version = "0.142.0"
 dependencies = [
  "base64 0.22.1",
  "codex-utils-cache",
@@ -4220,7 +4220,7 @@ dependencies = [
 
 [[package]]
 name = "codex-utils-json-to-toml"
-version = "0.0.0"
+version = "0.142.0"
 dependencies = [
  "pretty_assertions",
  "serde_json",
@@ -4229,7 +4229,7 @@ dependencies = [
 
 [[package]]
 name = "codex-utils-oss"
-version = "0.0.0"
+version = "0.142.0"
 dependencies = [
  "codex-core",
  "codex-lmstudio",
@@ -4239,7 +4239,7 @@ dependencies = [
 
 [[package]]
 name = "codex-utils-output-truncation"
-version = "0.0.0"
+version = "0.142.0"
 dependencies = [
  "codex-protocol",
  "codex-utils-string",
@@ -4248,7 +4248,7 @@ dependencies = [
 
 [[package]]
 name = "codex-utils-path"
-version = "0.0.0"
+version = "0.142.0"
 dependencies = [
  "codex-utils-absolute-path",
  "dunce",
@@ -4258,7 +4258,7 @@ dependencies = [
 
 [[package]]
 name = "codex-utils-path-uri"
-version = "0.0.0"
+version = "0.142.0"
 dependencies = [
  "base64 0.22.1",
  "codex-utils-absolute-path",
@@ -4274,7 +4274,7 @@ dependencies = [
 
 [[package]]
 name = "codex-utils-plugins"
-version = "0.0.0"
+version = "0.142.0"
 dependencies = [
  "codex-exec-server",
  "codex-utils-absolute-path",
@@ -4287,7 +4287,7 @@ dependencies = [
 
 [[package]]
 name = "codex-utils-pty"
-version = "0.0.0"
+version = "0.142.0"
 dependencies = [
  "anyhow",
  "filedescriptor",
@@ -4303,7 +4303,7 @@ dependencies = [
 
 [[package]]
 name = "codex-utils-readiness"
-version = "0.0.0"
+version = "0.142.0"
 dependencies = [
  "assert_matches",
  "thiserror 2.0.18",
@@ -4313,14 +4313,14 @@ dependencies = [
 
 [[package]]
 name = "codex-utils-rustls-provider"
-version = "0.0.0"
+version = "0.142.0"
 dependencies = [
  "rustls",
 ]
 
 [[package]]
 name = "codex-utils-sandbox-summary"
-version = "0.0.0"
+version = "0.142.0"
 dependencies = [
  "codex-core",
  "codex-model-provider-info",
@@ -4331,7 +4331,7 @@ dependencies = [
 
 [[package]]
 name = "codex-utils-sleep-inhibitor"
-version = "0.0.0"
+version = "0.142.0"
 dependencies = [
  "core-foundation 0.9.4",
  "libc",
@@ -4341,14 +4341,14 @@ dependencies = [
 
 [[package]]
 name = "codex-utils-stream-parser"
-version = "0.0.0"
+version = "0.142.0"
 dependencies = [
  "pretty_assertions",
 ]
 
 [[package]]
 name = "codex-utils-string"
-version = "0.0.0"
+version = "0.142.0"
 dependencies = [
  "pretty_assertions",
  "regex-lite",
@@ -4358,14 +4358,14 @@ dependencies = [
 
 [[package]]
 name = "codex-utils-template"
-version = "0.0.0"
+version = "0.142.0"
 dependencies = [
  "pretty_assertions",
 ]
 
 [[package]]
 name = "codex-v8-poc"
-version = "0.0.0"
+version = "0.142.0"
 dependencies = [
  "pretty_assertions",
  "v8",
@@ -4373,7 +4373,7 @@ dependencies = [
 
 [[package]]
 name = "codex-web-search-extension"
-version = "0.0.0"
+version = "0.142.0"
 dependencies = [
  "codex-api",
  "codex-core",
@@ -4392,7 +4392,7 @@ dependencies = [
 
 [[package]]
 name = "codex-windows-sandbox"
-version = "0.0.0"
+version = "0.142.0"
 dependencies = [
  "anyhow",
  "base64 0.22.1",
@@ -4649,7 +4649,7 @@ dependencies = [
 
 [[package]]
 name = "core_test_support"
-version = "0.0.0"
+version = "0.142.0"
 dependencies = [
  "anyhow",
  "assert_cmd",
@@ -9035,7 +9035,7 @@ dependencies = [
 
 [[package]]
 name = "mcp_test_support"
-version = "0.0.0"
+version = "0.142.0"
 dependencies = [
  "anyhow",
  "codex-login",
diff --git a/codex-rs/Cargo.toml b/codex-rs/Cargo.toml
index d469506..0451da4 100644
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
