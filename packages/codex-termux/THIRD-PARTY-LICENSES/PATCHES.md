# Applied Android Patches

Source repository: openai/codex
Source ref: rust-v0.153.4
Source SHA: 3d2ee51ca2d5db578f328aa75e20aa22c0197c9a
Built by: bash0816/Codex-Termux @ main (46f55f4a6f942a1859d62ffc05ef005c16d600e6)
Build timestamp: 2026-09-05T12:34:46Z

## Modified Files (stat)
 codex-rs/Cargo.lock                                | 315 ++++++++++-----------
 codex-rs/Cargo.toml                                |   2 +-
 .../src/transport/unix_socket.rs                   |   1 +
 codex-rs/arg0/src/lib.rs                           |   3 +
 codex-rs/core/Cargo.toml                           |   3 +
 codex-rs/core/src/installation_id.rs               |   1 +
 codex-rs/http-client/Cargo.toml                    |   3 +
 codex-rs/thread-store/Cargo.toml                   |   1 +
 codex-rs/thread-store/src/local/writer_lock.rs     |  92 ++++++
 9 files changed, 256 insertions(+), 165 deletions(-)

## Full Diff
diff --git a/codex-rs/Cargo.lock b/codex-rs/Cargo.lock
index e217b70..78337ca 100644
--- a/codex-rs/Cargo.lock
+++ b/codex-rs/Cargo.lock
@@ -394,7 +394,7 @@ checksum = "2a4385e2e34eb35d6b3efe798b9eb88096925d87726c0798709bf56d9ed84af3"
 
 [[package]]
 name = "app_test_support"
-version = "0.0.0"
+version = "0.153.4"
 dependencies = [
  "anyhow",
  "base64 0.22.1",
@@ -1897,7 +1897,7 @@ dependencies = [
 
 [[package]]
 name = "codex-agent-extension"
-version = "0.0.0"
+version = "0.153.4"
 dependencies = [
  "anyhow",
  "codex-core",
@@ -1909,7 +1909,7 @@ dependencies = [
 
 [[package]]
 name = "codex-agent-graph-store"
-version = "0.0.0"
+version = "0.153.4"
 dependencies = [
  "codex-protocol",
  "codex-state",
@@ -1924,7 +1924,7 @@ dependencies = [
 
 [[package]]
 name = "codex-agent-identity"
-version = "0.0.0"
+version = "0.153.4"
 dependencies = [
  "anyhow",
  "base64 0.22.1",
@@ -1944,7 +1944,7 @@ dependencies = [
 
 [[package]]
 name = "codex-agent-roles"
-version = "0.0.0"
+version = "0.153.4"
 dependencies = [
  "codex-config",
  "codex-file-system",
@@ -1957,7 +1957,7 @@ dependencies = [
 
 [[package]]
 name = "codex-analytics"
-version = "0.0.0"
+version = "0.153.4"
 dependencies = [
  "codex-app-server-protocol",
  "codex-git-utils",
@@ -1978,7 +1978,7 @@ dependencies = [
 
 [[package]]
 name = "codex-ansi-escape"
-version = "0.0.0"
+version = "0.153.4"
 dependencies = [
  "ansi-to-tui",
  "ratatui",
@@ -1987,7 +1987,7 @@ dependencies = [
 
 [[package]]
 name = "codex-api"
-version = "0.0.0"
+version = "0.153.4"
 dependencies = [
  "anyhow",
  "assert_matches",
@@ -2022,7 +2022,7 @@ dependencies = [
 
 [[package]]
 name = "codex-app-server"
-version = "0.0.0"
+version = "0.153.4"
 dependencies = [
  "anyhow",
  "app_test_support",
@@ -2124,7 +2124,7 @@ dependencies = [
 
 [[package]]
 name = "codex-app-server-client"
-version = "0.0.0"
+version = "0.153.4"
 dependencies = [
  "codex-app-server",
  "codex-app-server-protocol",
@@ -2151,7 +2151,7 @@ dependencies = [
 
 [[package]]
 name = "codex-app-server-daemon"
-version = "0.0.0"
+version = "0.153.4"
 dependencies = [
  "anyhow",
  "codex-app-server-protocol",
@@ -2172,7 +2172,7 @@ dependencies = [
 
 [[package]]
 name = "codex-app-server-protocol"
-version = "0.0.0"
+version = "0.153.4"
 dependencies = [
  "anyhow",
  "codex-app-server-protocol-noop-macros",
@@ -2206,11 +2206,11 @@ dependencies = [
 
 [[package]]
 name = "codex-app-server-protocol-noop-macros"
-version = "0.0.0"
+version = "0.153.4"
 
 [[package]]
 name = "codex-app-server-test-client"
-version = "0.0.0"
+version = "0.153.4"
 dependencies = [
  "anyhow",
  "clap",
@@ -2232,7 +2232,7 @@ dependencies = [
 
 [[package]]
 name = "codex-app-server-transport"
-version = "0.0.0"
+version = "0.153.4"
 dependencies = [
  "anyhow",
  "axum",
@@ -2274,7 +2274,7 @@ dependencies = [
 
 [[package]]
 name = "codex-apply-patch"
-version = "0.0.0"
+version = "0.153.4"
 dependencies = [
  "anyhow",
  "assert_cmd",
@@ -2294,7 +2294,7 @@ dependencies = [
 
 [[package]]
 name = "codex-arg0"
-version = "0.0.0"
+version = "0.153.4"
 dependencies = [
  "anyhow",
  "codex-apply-patch",
@@ -2316,7 +2316,7 @@ dependencies = [
 
 [[package]]
 name = "codex-async-utils"
-version = "0.0.0"
+version = "0.153.4"
 dependencies = [
  "pretty_assertions",
  "tokio",
@@ -2325,7 +2325,7 @@ dependencies = [
 
 [[package]]
 name = "codex-aws-auth"
-version = "0.0.0"
+version = "0.153.4"
 dependencies = [
  "aws-config",
  "aws-credential-types",
@@ -2340,7 +2340,7 @@ dependencies = [
 
 [[package]]
 name = "codex-backend-client"
-version = "0.0.0"
+version = "0.153.4"
 dependencies = [
  "anyhow",
  "codex-api",
@@ -2360,7 +2360,7 @@ dependencies = [
 
 [[package]]
 name = "codex-backend-openapi-models"
-version = "0.0.0"
+version = "0.153.4"
 dependencies = [
  "serde",
  "serde_json",
@@ -2369,7 +2369,7 @@ dependencies = [
 
 [[package]]
 name = "codex-build-info"
-version = "0.0.0"
+version = "0.153.4"
 dependencies = [
  "codex-install-context",
  "pretty_assertions",
@@ -2381,7 +2381,7 @@ dependencies = [
 
 [[package]]
 name = "codex-bwrap"
-version = "0.0.0"
+version = "0.153.4"
 dependencies = [
  "cc",
  "libc",
@@ -2390,7 +2390,7 @@ dependencies = [
 
 [[package]]
 name = "codex-chatgpt"
-version = "0.0.0"
+version = "0.153.4"
 dependencies = [
  "anyhow",
  "clap",
@@ -2412,7 +2412,7 @@ dependencies = [
 
 [[package]]
 name = "codex-cli"
-version = "0.0.0"
+version = "0.153.4"
 dependencies = [
  "anyhow",
  "app_test_support",
@@ -2502,7 +2502,7 @@ dependencies = [
 
 [[package]]
 name = "codex-client"
-version = "0.0.0"
+version = "0.153.4"
 dependencies = [
  "codex-http-client",
  "eventsource-stream",
@@ -2515,7 +2515,7 @@ dependencies = [
 
 [[package]]
 name = "codex-cloud-config"
-version = "0.0.0"
+version = "0.153.4"
 dependencies = [
  "base64 0.22.1",
  "chrono",
@@ -2540,7 +2540,7 @@ dependencies = [
 
 [[package]]
 name = "codex-cloud-tasks"
-version = "0.0.0"
+version = "0.153.4"
 dependencies = [
  "anyhow",
  "chrono",
@@ -2573,7 +2573,7 @@ dependencies = [
 
 [[package]]
 name = "codex-cloud-tasks-client"
-version = "0.0.0"
+version = "0.153.4"
 dependencies = [
  "anyhow",
  "chrono",
@@ -2588,7 +2588,7 @@ dependencies = [
 
 [[package]]
 name = "codex-cloud-tasks-mock-client"
-version = "0.0.0"
+version = "0.153.4"
 dependencies = [
  "chrono",
  "codex-cloud-tasks-client",
@@ -2597,7 +2597,7 @@ dependencies = [
 
 [[package]]
 name = "codex-code-mode"
-version = "0.0.0"
+version = "0.153.4"
 dependencies = [
  "codex-code-mode-protocol",
  "codex-http-client",
@@ -2620,7 +2620,7 @@ dependencies = [
 
 [[package]]
 name = "codex-code-mode-host"
-version = "0.0.0"
+version = "0.153.4"
 dependencies = [
  "anyhow",
  "axum",
@@ -2648,7 +2648,7 @@ dependencies = [
 
 [[package]]
 name = "codex-code-mode-protocol"
-version = "0.0.0"
+version = "0.153.4"
 dependencies = [
  "codex-protocol",
  "glob",
@@ -2666,7 +2666,7 @@ dependencies = [
 
 [[package]]
 name = "codex-code-mode-runtime"
-version = "0.0.0"
+version = "0.153.4"
 dependencies = [
  "base64 0.22.1",
  "codex-code-mode-protocol",
@@ -2684,11 +2684,11 @@ dependencies = [
 
 [[package]]
 name = "codex-collaboration-mode-templates"
-version = "0.0.0"
+version = "0.153.4"
 
 [[package]]
 name = "codex-config"
-version = "0.0.0"
+version = "0.153.4"
 dependencies = [
  "anyhow",
  "base64 0.22.1",
@@ -2737,7 +2737,7 @@ dependencies = [
 
 [[package]]
 name = "codex-config-schema"
-version = "0.0.0"
+version = "0.153.4"
 dependencies = [
  "anyhow",
  "clap",
@@ -2746,7 +2746,7 @@ dependencies = [
 
 [[package]]
 name = "codex-connectors"
-version = "0.0.0"
+version = "0.153.4"
 dependencies = [
  "anyhow",
  "arc-swap",
@@ -2768,7 +2768,7 @@ dependencies = [
 
 [[package]]
 name = "codex-connectors-extension"
-version = "0.0.0"
+version = "0.153.4"
 dependencies = [
  "codex-connectors",
  "codex-core-plugins",
@@ -2782,7 +2782,7 @@ dependencies = [
 
 [[package]]
 name = "codex-context-fragments"
-version = "0.0.0"
+version = "0.153.4"
 dependencies = [
  "codex-protocol",
  "codex-utils-string",
@@ -2790,7 +2790,7 @@ dependencies = [
 
 [[package]]
 name = "codex-core"
-version = "0.0.0"
+version = "0.153.4"
 dependencies = [
  "anyhow",
  "arc-swap",
@@ -2924,7 +2924,7 @@ dependencies = [
 
 [[package]]
 name = "codex-core-api"
-version = "0.0.0"
+version = "0.153.4"
 dependencies = [
  "codex-analytics",
  "codex-app-server-protocol",
@@ -2947,7 +2947,7 @@ dependencies = [
 
 [[package]]
 name = "codex-core-plugins"
-version = "0.0.0"
+version = "0.153.4"
 dependencies = [
  "anyhow",
  "chrono",
@@ -3003,7 +3003,7 @@ dependencies = [
 
 [[package]]
 name = "codex-diagnostics"
-version = "0.0.0"
+version = "0.153.4"
 dependencies = [
  "libc",
  "pretty_assertions",
@@ -3011,7 +3011,7 @@ dependencies = [
 
 [[package]]
 name = "codex-exec"
-version = "0.0.0"
+version = "0.153.4"
 dependencies = [
  "anyhow",
  "assert_cmd",
@@ -3060,7 +3060,7 @@ dependencies = [
 
 [[package]]
 name = "codex-exec-server"
-version = "0.0.0"
+version = "0.153.4"
 dependencies = [
  "anyhow",
  "arc-swap",
@@ -3119,7 +3119,7 @@ dependencies = [
 
 [[package]]
 name = "codex-exec-server-protocol"
-version = "0.0.0"
+version = "0.153.4"
 dependencies = [
  "base64 0.22.1",
  "codex-file-system",
@@ -3134,7 +3134,7 @@ dependencies = [
 
 [[package]]
 name = "codex-exec-server-test-support"
-version = "0.0.0"
+version = "0.153.4"
 dependencies = [
  "anyhow",
  "codex-exec-server",
@@ -3149,7 +3149,7 @@ dependencies = [
 
 [[package]]
 name = "codex-execpolicy"
-version = "0.0.0"
+version = "0.153.4"
 dependencies = [
  "anyhow",
  "clap",
@@ -3167,7 +3167,7 @@ dependencies = [
 
 [[package]]
 name = "codex-experimental-api-macros"
-version = "0.0.0"
+version = "0.153.4"
 dependencies = [
  "proc-macro2",
  "quote",
@@ -3176,7 +3176,7 @@ dependencies = [
 
 [[package]]
 name = "codex-extension-api"
-version = "0.0.0"
+version = "0.153.4"
 dependencies = [
  "codex-config",
  "codex-context-fragments",
@@ -3193,7 +3193,7 @@ dependencies = [
 
 [[package]]
 name = "codex-extension-items"
-version = "0.0.0"
+version = "0.153.4"
 dependencies = [
  "codex-utils-absolute-path",
  "pretty_assertions",
@@ -3205,7 +3205,7 @@ dependencies = [
 
 [[package]]
 name = "codex-external-agent-migration"
-version = "0.0.0"
+version = "0.153.4"
 dependencies = [
  "chrono",
  "codex-analytics",
@@ -3235,7 +3235,7 @@ dependencies = [
 
 [[package]]
 name = "codex-features"
-version = "0.0.0"
+version = "0.153.4"
 dependencies = [
  "codex-otel",
  "codex-protocol",
@@ -3248,7 +3248,7 @@ dependencies = [
 
 [[package]]
 name = "codex-feedback"
-version = "0.0.0"
+version = "0.153.4"
 dependencies = [
  "anyhow",
  "bytes",
@@ -3270,7 +3270,7 @@ dependencies = [
 
 [[package]]
 name = "codex-file-search"
-version = "0.0.0"
+version = "0.153.4"
 dependencies = [
  "anyhow",
  "clap",
@@ -3286,7 +3286,7 @@ dependencies = [
 
 [[package]]
 name = "codex-file-system"
-version = "0.0.0"
+version = "0.153.4"
 dependencies = [
  "bytes",
  "codex-protocol",
@@ -3298,7 +3298,7 @@ dependencies = [
 
 [[package]]
 name = "codex-file-watcher"
-version = "0.0.0"
+version = "0.153.4"
 dependencies = [
  "notify",
  "pretty_assertions",
@@ -3309,7 +3309,7 @@ dependencies = [
 
 [[package]]
 name = "codex-git-attribution"
-version = "0.0.0"
+version = "0.153.4"
 dependencies = [
  "codex-backend-client",
  "codex-extension-api",
@@ -3322,7 +3322,7 @@ dependencies = [
 
 [[package]]
 name = "codex-git-utils"
-version = "0.0.0"
+version = "0.153.4"
 dependencies = [
  "anyhow",
  "chrono",
@@ -3348,7 +3348,7 @@ dependencies = [
 
 [[package]]
 name = "codex-goal-extension"
-version = "0.0.0"
+version = "0.153.4"
 dependencies = [
  "anyhow",
  "chrono",
@@ -3372,7 +3372,7 @@ dependencies = [
 
 [[package]]
 name = "codex-guardian-context"
-version = "0.0.0"
+version = "0.153.4"
 dependencies = [
  "codex-protocol",
  "pretty_assertions",
@@ -3381,7 +3381,7 @@ dependencies = [
 
 [[package]]
 name = "codex-guardian-v2"
-version = "0.0.0"
+version = "0.153.4"
 dependencies = [
  "anyhow",
  "codex-analytics",
@@ -3411,7 +3411,7 @@ dependencies = [
 
 [[package]]
 name = "codex-history"
-version = "0.0.0"
+version = "0.153.4"
 dependencies = [
  "anyhow",
  "codex-protocol",
@@ -3423,7 +3423,7 @@ dependencies = [
 
 [[package]]
 name = "codex-history-notes-extension"
-version = "0.0.0"
+version = "0.153.4"
 dependencies = [
  "codex-api",
  "codex-client",
@@ -3447,7 +3447,7 @@ dependencies = [
 
 [[package]]
 name = "codex-home"
-version = "0.0.0"
+version = "0.153.4"
 dependencies = [
  "codex-extension-api",
  "codex-utils-absolute-path",
@@ -3458,7 +3458,7 @@ dependencies = [
 
 [[package]]
 name = "codex-hooks"
-version = "0.0.0"
+version = "0.153.4"
 dependencies = [
  "anyhow",
  "async-channel",
@@ -3484,7 +3484,7 @@ dependencies = [
 
 [[package]]
 name = "codex-http-client"
-version = "0.0.0"
+version = "0.153.4"
 dependencies = [
  "bytes",
  "codex-utils-cargo-bin",
@@ -3492,6 +3492,7 @@ dependencies = [
  "futures",
  "http 1.4.0",
  "native-tls",
+ "openssl-sys",
  "opentelemetry",
  "opentelemetry_sdk",
  "pretty_assertions",
@@ -3516,7 +3517,7 @@ dependencies = [
 
 [[package]]
 name = "codex-image-generation-extension"
-version = "0.0.0"
+version = "0.153.4"
 dependencies = [
  "base64 0.22.1",
  "codex-api",
@@ -3543,7 +3544,7 @@ dependencies = [
 
 [[package]]
 name = "codex-install-context"
-version = "0.0.0"
+version = "0.153.4"
 dependencies = [
  "codex-utils-absolute-path",
  "codex-utils-home-dir",
@@ -3556,7 +3557,7 @@ dependencies = [
 
 [[package]]
 name = "codex-keyring-store"
-version = "0.0.0"
+version = "0.153.4"
 dependencies = [
  "keyring",
  "tracing",
@@ -3564,7 +3565,7 @@ dependencies = [
 
 [[package]]
 name = "codex-linux-sandbox"
-version = "0.0.0"
+version = "0.153.4"
 dependencies = [
  "clap",
  "codex-core",
@@ -3591,7 +3592,7 @@ dependencies = [
 
 [[package]]
 name = "codex-lmstudio"
-version = "0.0.0"
+version = "0.153.4"
 dependencies = [
  "codex-core",
  "codex-http-client",
@@ -3605,7 +3606,7 @@ dependencies = [
 
 [[package]]
 name = "codex-login"
-version = "0.0.0"
+version = "0.153.4"
 dependencies = [
  "anyhow",
  "base64 0.22.1",
@@ -3648,7 +3649,7 @@ dependencies = [
 
 [[package]]
 name = "codex-mcp"
-version = "0.0.0"
+version = "0.153.4"
 dependencies = [
  "anyhow",
  "arc-swap",
@@ -3688,7 +3689,7 @@ dependencies = [
 
 [[package]]
 name = "codex-mcp-extension"
-version = "0.0.0"
+version = "0.153.4"
 dependencies = [
  "anyhow",
  "axum",
@@ -3719,7 +3720,7 @@ dependencies = [
 
 [[package]]
 name = "codex-mcp-server"
-version = "0.0.0"
+version = "0.153.4"
 dependencies = [
  "anyhow",
  "app_test_support",
@@ -3758,7 +3759,7 @@ dependencies = [
 
 [[package]]
 name = "codex-memories-extension"
-version = "0.0.0"
+version = "0.153.4"
 dependencies = [
  "codex-core",
  "codex-extension-api",
@@ -3779,7 +3780,7 @@ dependencies = [
 
 [[package]]
 name = "codex-memories-read"
-version = "0.0.0"
+version = "0.153.4"
 dependencies = [
  "codex-protocol",
  "codex-shell-command",
@@ -3789,7 +3790,7 @@ dependencies = [
 
 [[package]]
 name = "codex-memories-write"
-version = "0.0.0"
+version = "0.153.4"
 dependencies = [
  "anyhow",
  "chrono",
@@ -3826,7 +3827,7 @@ dependencies = [
 
 [[package]]
 name = "codex-message-history"
-version = "0.0.0"
+version = "0.153.4"
 dependencies = [
  "codex-config",
  "memchr",
@@ -3840,7 +3841,7 @@ dependencies = [
 
 [[package]]
 name = "codex-model-provider"
-version = "0.0.0"
+version = "0.153.4"
 dependencies = [
  "codex-agent-identity",
  "codex-api",
@@ -3864,7 +3865,7 @@ dependencies = [
 
 [[package]]
 name = "codex-model-provider-info"
-version = "0.0.0"
+version = "0.153.4"
 dependencies = [
  "codex-api",
  "codex-protocol",
@@ -3881,7 +3882,7 @@ dependencies = [
 
 [[package]]
 name = "codex-models-manager"
-version = "0.0.0"
+version = "0.153.4"
 dependencies = [
  "chrono",
  "codex-collaboration-mode-templates",
@@ -3901,7 +3902,7 @@ dependencies = [
 
 [[package]]
 name = "codex-network-proxy"
-version = "0.0.0"
+version = "0.153.4"
 dependencies = [
  "anyhow",
  "base64 0.22.1",
@@ -3939,7 +3940,7 @@ dependencies = [
 
 [[package]]
 name = "codex-ollama"
-version = "0.0.0"
+version = "0.153.4"
 dependencies = [
  "assert_matches",
  "async-stream",
@@ -3959,7 +3960,7 @@ dependencies = [
 
 [[package]]
 name = "codex-otel"
-version = "0.0.0"
+version = "0.153.4"
 dependencies = [
  "chrono",
  "codex-api",
@@ -3992,7 +3993,7 @@ dependencies = [
 
 [[package]]
 name = "codex-otel-trace-websocket"
-version = "0.0.0"
+version = "0.153.4"
 dependencies = [
  "anyhow",
  "axum",
@@ -4003,7 +4004,7 @@ dependencies = [
 
 [[package]]
 name = "codex-plugin"
-version = "0.0.0"
+version = "0.153.4"
 dependencies = [
  "codex-config",
  "codex-protocol",
@@ -4017,7 +4018,7 @@ dependencies = [
 
 [[package]]
 name = "codex-process-hardening"
-version = "0.0.0"
+version = "0.153.4"
 dependencies = [
  "libc",
  "pretty_assertions",
@@ -4025,7 +4026,7 @@ dependencies = [
 
 [[package]]
 name = "codex-prompts"
-version = "0.0.0"
+version = "0.153.4"
 dependencies = [
  "anyhow",
  "codex-context-fragments",
@@ -4039,7 +4040,7 @@ dependencies = [
 
 [[package]]
 name = "codex-protocol"
-version = "0.0.0"
+version = "0.153.4"
 dependencies = [
  "anyhow",
  "chardetng",
@@ -4083,7 +4084,7 @@ dependencies = [
 
 [[package]]
 name = "codex-queue-extension"
-version = "0.0.0"
+version = "0.153.4"
 dependencies = [
  "anyhow",
  "codex-core",
@@ -4104,7 +4105,7 @@ dependencies = [
 
 [[package]]
 name = "codex-realtime-webrtc"
-version = "0.0.0"
+version = "0.153.4"
 dependencies = [
  "anyhow",
  "codex-install-context",
@@ -4117,7 +4118,7 @@ dependencies = [
 
 [[package]]
 name = "codex-response-debug-context"
-version = "0.0.0"
+version = "0.153.4"
 dependencies = [
  "base64 0.22.1",
  "codex-api",
@@ -4128,7 +4129,7 @@ dependencies = [
 
 [[package]]
 name = "codex-responses-api-proxy"
-version = "0.0.0"
+version = "0.153.4"
 dependencies = [
  "anyhow",
  "clap",
@@ -4145,7 +4146,7 @@ dependencies = [
 
 [[package]]
 name = "codex-rmcp-client"
-version = "0.0.0"
+version = "0.153.4"
 dependencies = [
  "anyhow",
  "axum",
@@ -4191,7 +4192,7 @@ dependencies = [
 
 [[package]]
 name = "codex-rollout"
-version = "0.0.0"
+version = "0.153.4"
 dependencies = [
  "anyhow",
  "chrono",
@@ -4218,7 +4219,7 @@ dependencies = [
 
 [[package]]
 name = "codex-rollout-trace"
-version = "0.0.0"
+version = "0.153.4"
 dependencies = [
  "anyhow",
  "codex-code-mode",
@@ -4234,7 +4235,7 @@ dependencies = [
 
 [[package]]
 name = "codex-sandboxing"
-version = "0.0.0"
+version = "0.153.4"
 dependencies = [
  "anyhow",
  "appcontainer_common",
@@ -4261,7 +4262,7 @@ dependencies = [
 
 [[package]]
 name = "codex-secrets"
-version = "0.0.0"
+version = "0.153.4"
 dependencies = [
  "age",
  "anyhow",
@@ -4282,7 +4283,7 @@ dependencies = [
 
 [[package]]
 name = "codex-shell-command"
-version = "0.0.0"
+version = "0.153.4"
 dependencies = [
  "anyhow",
  "base64 0.22.1",
@@ -4305,7 +4306,7 @@ dependencies = [
 
 [[package]]
 name = "codex-shell-escalation"
-version = "0.0.0"
+version = "0.153.4"
 dependencies = [
  "anyhow",
  "clap",
@@ -4325,7 +4326,7 @@ dependencies = [
 
 [[package]]
 name = "codex-skills"
-version = "0.0.0"
+version = "0.153.4"
 dependencies = [
  "codex-protocol",
  "codex-shell-command",
@@ -4342,7 +4343,7 @@ dependencies = [
 
 [[package]]
 name = "codex-skills-extension"
-version = "0.0.0"
+version = "0.153.4"
 dependencies = [
  "assert_matches",
  "codex-analytics",
@@ -4379,7 +4380,7 @@ dependencies = [
 
 [[package]]
 name = "codex-state"
-version = "0.0.0"
+version = "0.153.4"
 dependencies = [
  "anyhow",
  "chrono",
@@ -4403,7 +4404,7 @@ dependencies = [
 
 [[package]]
 name = "codex-stdio-to-uds"
-version = "0.0.0"
+version = "0.153.4"
 dependencies = [
  "anyhow",
  "codex-uds",
@@ -4415,7 +4416,7 @@ dependencies = [
 
 [[package]]
 name = "codex-terminal-detection"
-version = "0.0.0"
+version = "0.153.4"
 dependencies = [
  "pretty_assertions",
  "tracing",
@@ -4423,7 +4424,7 @@ dependencies = [
 
 [[package]]
 name = "codex-test-binary-support"
-version = "0.0.0"
+version = "0.153.4"
 dependencies = [
  "codex-arg0",
  "tempfile",
@@ -4431,7 +4432,7 @@ dependencies = [
 
 [[package]]
 name = "codex-thread-manager-sample"
-version = "0.0.0"
+version = "0.153.4"
 dependencies = [
  "anyhow",
  "clap",
@@ -4442,7 +4443,7 @@ dependencies = [
 
 [[package]]
 name = "codex-thread-store"
-version = "0.0.0"
+version = "0.153.4"
 dependencies = [
  "chrono",
  "codex-app-server-protocol",
@@ -4457,6 +4458,7 @@ dependencies = [
  "codex-utils-path",
  "codex-utils-path-uri",
  "futures",
+ "libc",
  "pretty_assertions",
  "pulldown-cmark",
  "serde",
@@ -4472,7 +4474,7 @@ dependencies = [
 
 [[package]]
 name = "codex-tools"
-version = "0.0.0"
+version = "0.153.4"
 dependencies = [
  "bitflags 2.13.1",
  "codex-code-mode",
@@ -4497,7 +4499,7 @@ dependencies = [
 
 [[package]]
 name = "codex-tui"
-version = "0.0.0"
+version = "0.153.4"
 dependencies = [
  "anyhow",
  "app_test_support",
@@ -4610,7 +4612,7 @@ dependencies = [
 
 [[package]]
 name = "codex-uds"
-version = "0.0.0"
+version = "0.153.4"
 dependencies = [
  "async-io",
  "pretty_assertions",
@@ -4622,7 +4624,7 @@ dependencies = [
 
 [[package]]
 name = "codex-utils-absolute-path"
-version = "0.0.0"
+version = "0.153.4"
 dependencies = [
  "dirs",
  "dunce",
@@ -4636,14 +4638,14 @@ dependencies = [
 
 [[package]]
 name = "codex-utils-approval-presets"
-version = "0.0.0"
+version = "0.153.4"
 dependencies = [
  "codex-protocol",
 ]
 
 [[package]]
 name = "codex-utils-audio"
-version = "0.0.0"
+version = "0.153.4"
 dependencies = [
  "base64 0.22.1",
  "codex-protocol",
@@ -4657,7 +4659,7 @@ dependencies = [
 
 [[package]]
 name = "codex-utils-cache"
-version = "0.0.0"
+version = "0.153.4"
 dependencies = [
  "lru",
  "sha1 0.10.6",
@@ -4666,7 +4668,7 @@ dependencies = [
 
 [[package]]
 name = "codex-utils-cargo-bin"
-version = "0.0.0"
+version = "0.153.4"
 dependencies = [
  "assert_cmd",
  "runfiles",
@@ -4675,7 +4677,7 @@ dependencies = [
 
 [[package]]
 name = "codex-utils-cli"
-version = "0.0.0"
+version = "0.153.4"
 dependencies = [
  "clap",
  "codex-protocol",
@@ -4687,15 +4689,15 @@ dependencies = [
 
 [[package]]
 name = "codex-utils-elapsed"
-version = "0.0.0"
+version = "0.153.4"
 
 [[package]]
 name = "codex-utils-fuzzy-match"
-version = "0.0.0"
+version = "0.153.4"
 
 [[package]]
 name = "codex-utils-git-discovery"
-version = "0.0.0"
+version = "0.153.4"
 dependencies = [
  "codex-git-utils",
  "codex-utils-absolute-path",
@@ -4708,7 +4710,7 @@ dependencies = [
 
 [[package]]
 name = "codex-utils-home-dir"
-version = "0.0.0"
+version = "0.153.4"
 dependencies = [
  "codex-utils-absolute-path",
  "dirs",
@@ -4718,7 +4720,7 @@ dependencies = [
 
 [[package]]
 name = "codex-utils-image"
-version = "0.0.0"
+version = "0.153.4"
 dependencies = [
  "base64 0.22.1",
  "codex-utils-cache",
@@ -4731,7 +4733,7 @@ dependencies = [
 
 [[package]]
 name = "codex-utils-json-to-toml"
-version = "0.0.0"
+version = "0.153.4"
 dependencies = [
  "pretty_assertions",
  "serde_json",
@@ -4740,7 +4742,7 @@ dependencies = [
 
 [[package]]
 name = "codex-utils-oss"
-version = "0.0.0"
+version = "0.153.4"
 dependencies = [
  "codex-core",
  "codex-lmstudio",
@@ -4750,7 +4752,7 @@ dependencies = [
 
 [[package]]
 name = "codex-utils-output-truncation"
-version = "0.0.0"
+version = "0.153.4"
 dependencies = [
  "codex-protocol",
  "codex-utils-string",
@@ -4759,7 +4761,7 @@ dependencies = [
 
 [[package]]
 name = "codex-utils-path"
-version = "0.0.0"
+version = "0.153.4"
 dependencies = [
  "codex-utils-absolute-path",
  "dunce",
@@ -4769,7 +4771,7 @@ dependencies = [
 
 [[package]]
 name = "codex-utils-path-uri"
-version = "0.0.0"
+version = "0.153.4"
 dependencies = [
  "base64 0.22.1",
  "codex-utils-absolute-path",
@@ -4785,7 +4787,7 @@ dependencies = [
 
 [[package]]
 name = "codex-utils-plugins"
-version = "0.0.0"
+version = "0.153.4"
 dependencies = [
  "codex-exec-server",
  "codex-exec-server-protocol",
@@ -4799,7 +4801,7 @@ dependencies = [
 
 [[package]]
 name = "codex-utils-pty"
-version = "0.0.0"
+version = "0.153.4"
 dependencies = [
  "anyhow",
  "filedescriptor",
@@ -4815,7 +4817,7 @@ dependencies = [
 
 [[package]]
 name = "codex-utils-readiness"
-version = "0.0.0"
+version = "0.153.4"
 dependencies = [
  "assert_matches",
  "thiserror 2.0.18",
@@ -4825,7 +4827,7 @@ dependencies = [
 
 [[package]]
 name = "codex-utils-redacted-string"
-version = "0.0.0"
+version = "0.153.4"
 dependencies = [
  "schemars 0.8.22",
  "serde",
@@ -4833,14 +4835,14 @@ dependencies = [
 
 [[package]]
 name = "codex-utils-rustls-provider"
-version = "0.0.0"
+version = "0.153.4"
 dependencies = [
  "rustls",
 ]
 
 [[package]]
 name = "codex-utils-sandbox-summary"
-version = "0.0.0"
+version = "0.153.4"
 dependencies = [
  "codex-protocol",
  "codex-utils-absolute-path",
@@ -4849,7 +4851,7 @@ dependencies = [
 
 [[package]]
 name = "codex-utils-sleep-inhibitor"
-version = "0.0.0"
+version = "0.153.4"
 dependencies = [
  "core-foundation 0.9.4",
  "libc",
@@ -4859,14 +4861,14 @@ dependencies = [
 
 [[package]]
 name = "codex-utils-stream-parser"
-version = "0.0.0"
+version = "0.153.4"
 dependencies = [
  "pretty_assertions",
 ]
 
 [[package]]
 name = "codex-utils-string"
-version = "0.0.0"
+version = "0.153.4"
 dependencies = [
  "pretty_assertions",
  "regex-lite",
@@ -4876,14 +4878,14 @@ dependencies = [
 
 [[package]]
 name = "codex-utils-template"
-version = "0.0.0"
+version = "0.153.4"
 dependencies = [
  "pretty_assertions",
 ]
 
 [[package]]
 name = "codex-v8-poc"
-version = "0.0.0"
+version = "0.153.4"
 dependencies = [
  "pretty_assertions",
  "v8",
@@ -4891,7 +4893,7 @@ dependencies = [
 
 [[package]]
 name = "codex-voice-host"
-version = "0.0.0"
+version = "0.153.4"
 dependencies = [
  "anyhow",
  "codex-install-context",
@@ -4905,7 +4907,7 @@ dependencies = [
 
 [[package]]
 name = "codex-web-search-extension"
-version = "0.0.0"
+version = "0.153.4"
 dependencies = [
  "codex-api",
  "codex-core",
@@ -4926,7 +4928,7 @@ dependencies = [
 
 [[package]]
 name = "codex-websocket-client"
-version = "0.0.0"
+version = "0.153.4"
 dependencies = [
  "codex-http-client",
  "codex-utils-rustls-provider",
@@ -4942,7 +4944,7 @@ dependencies = [
 
 [[package]]
 name = "codex-windows-sandbox"
-version = "0.0.0"
+version = "0.153.4"
 dependencies = [
  "anyhow",
  "base64 0.22.1",
@@ -4968,7 +4970,7 @@ dependencies = [
 
 [[package]]
 name = "codex-workload-identity"
-version = "0.0.0"
+version = "0.153.4"
 dependencies = [
  "codex-http-client",
  "pretty_assertions",
@@ -4983,7 +4985,7 @@ dependencies = [
 
 [[package]]
 name = "codex-worktree"
-version = "0.0.0"
+version = "0.153.4"
 dependencies = [
  "anyhow",
  "codex-git-utils",
@@ -5222,7 +5224,7 @@ dependencies = [
 
 [[package]]
 name = "core_test_support"
-version = "0.0.0"
+version = "0.153.4"
 dependencies = [
  "anyhow",
  "assert_cmd",
@@ -8350,11 +8352,9 @@ dependencies = [
  "percent-encoding",
  "pin-project-lite",
  "socket2 0.6.3",
- "system-configuration",
  "tokio",
  "tower-service",
  "tracing",
- "windows-registry",
 ]
 
 [[package]]
@@ -9520,7 +9520,7 @@ dependencies = [
 
 [[package]]
 name = "mcp_test_support"
-version = "0.0.0"
+version = "0.153.4"
 dependencies = [
  "anyhow",
  "codex-login",
@@ -11996,7 +11996,6 @@ dependencies = [
  "bytes",
  "cookie",
  "cookie_store",
- "encoding_rs",
  "futures-channel",
  "futures-core",
  "futures-util",
@@ -12010,7 +12009,6 @@ dependencies = [
  "hyper-util",
  "js-sys",
  "log",
- "mime",
  "native-tls",
  "percent-encoding",
  "pin-project-lite",
@@ -15843,17 +15841,6 @@ dependencies = [
  "windows-link",
 ]
 
-[[package]]
-name = "windows-registry"
-version = "0.6.1"
-source = "registry+https://github.com/rust-lang/crates.io-index"
-checksum = "02752bf7fbdcce7f2a27a742f798510f3e5ad88dbe84871e5168e2120c3d5720"
-dependencies = [
- "windows-link",
- "windows-result 0.4.1",
- "windows-strings 0.5.1",
-]
-
 [[package]]
 name = "windows-result"
 version = "0.2.0"
diff --git a/codex-rs/Cargo.toml b/codex-rs/Cargo.toml
index 351d1e6..2be17d2 100644
--- a/codex-rs/Cargo.toml
+++ b/codex-rs/Cargo.toml
@@ -412,7 +412,7 @@ rcgen = { version = "0.14.7", default-features = false, features = [
 ] }
 regex = "1.12.3"
 regex-lite = "0.1.8"
-reqwest = { version = "0.12", features = ["cookies"] }
+reqwest = { version = "0.12", default-features = false, features = ["cookies", "rustls-tls", "http2"] }
 rmcp = { version = "=3.1.3", default-features = false }
 runfiles = { git = "https://github.com/dzbarsky/rules_rust", rev = "b56cbaa8465e74127f1ea216f813cd377295ad81" }
 rustix = { version = "1.1.4", features = ["net"] }
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
index 4673f84..d4f3bb4 100644
--- a/codex-rs/arg0/src/lib.rs
+++ b/codex-rs/arg0/src/lib.rs
@@ -382,6 +382,7 @@ fn prepare_path_entry_for_codex_aliases(
         .create(true)
         .truncate(false)
         .open(&lock_path)?;
+    #[cfg(not(target_os = "android"))]
     lock_file.try_lock()?;
 
     for filename in &[
@@ -526,6 +527,8 @@ fn try_lock_dir(dir: &Path) -> std::io::Result<Option<File>> {
     match lock_file.try_lock() {
         Ok(()) => Ok(Some(lock_file)),
         Err(std::fs::TryLockError::WouldBlock) => Ok(None),
+        #[cfg(target_os = "android")]
+        Err(_) => Ok(None),
         Err(err) => Err(err.into()),
     }
 }
diff --git a/codex-rs/core/Cargo.toml b/codex-rs/core/Cargo.toml
index eb0137c..5494876 100644
--- a/codex-rs/core/Cargo.toml
+++ b/codex-rs/core/Cargo.toml
@@ -132,6 +132,9 @@ openssl-sys = { workspace = true, features = ["vendored"] }
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
diff --git a/codex-rs/http-client/Cargo.toml b/codex-rs/http-client/Cargo.toml
index 2d54ca7..8335487 100644
--- a/codex-rs/http-client/Cargo.toml
+++ b/codex-rs/http-client/Cargo.toml
@@ -46,3 +46,6 @@ tracing-subscriber = { workspace = true }
 
 [lib]
 doctest = false
+
+[target.aarch64-linux-android.dependencies]
+openssl-sys = { workspace = true, features = ["vendored"] }
diff --git a/codex-rs/thread-store/Cargo.toml b/codex-rs/thread-store/Cargo.toml
index b0d2b15..e69a031 100644
--- a/codex-rs/thread-store/Cargo.toml
+++ b/codex-rs/thread-store/Cargo.toml
@@ -26,6 +26,7 @@ codex-utils-absolute-path = { workspace = true }
 codex-utils-path = { workspace = true }
 codex-utils-path-uri = { workspace = true }
 futures = { workspace = true }
+libc = { workspace = true }
 pulldown-cmark = { workspace = true }
 serde = { workspace = true, features = ["derive"] }
 serde_json = { workspace = true }
diff --git a/codex-rs/thread-store/src/local/writer_lock.rs b/codex-rs/thread-store/src/local/writer_lock.rs
index f6b2c85..67a0a02 100644
--- a/codex-rs/thread-store/src/local/writer_lock.rs
+++ b/codex-rs/thread-store/src/local/writer_lock.rs
@@ -14,6 +14,50 @@ use tracing::warn;
 use crate::ThreadStoreError;
 use crate::ThreadStoreResult;
 
+#[cfg(target_os = "android")]
+use std::os::fd::AsRawFd;
+
+// Android's libc omits flock() from Rust std's File::lock()/try_lock() allowlist
+// (library/std/src/sys/fs/unix.rs), so std returns ErrorKind::Unsupported without
+// ever issuing the syscall, even though flock(2) itself works fine on this platform.
+// Call it directly via libc so Android keeps the same writer-exclusivity guarantee
+// as every other target instead of silently dropping it.
+// Reported upstream: https://github.com/openai/codex/issues/26277
+// Remove this shim once upstream openai/codex#26277 is fixed.
+#[cfg(target_os = "android")]
+fn android_flock_exclusive_blocking(file: &File) -> io::Result<()> {
+    let fd = file.as_raw_fd();
+    loop {
+        // SAFETY: fd is a valid, open file descriptor owned by `file` for the
+        // duration of this call.
+        let rc = unsafe { libc::flock(fd, libc::LOCK_EX) };
+        if rc == 0 {
+            return Ok(());
+        }
+        let err = io::Error::last_os_error();
+        if err.kind() != io::ErrorKind::Interrupted {
+            return Err(err);
+        }
+    }
+}
+
+#[cfg(target_os = "android")]
+fn android_try_flock_exclusive(file: &File) -> io::Result<bool> {
+    let fd = file.as_raw_fd();
+    // SAFETY: fd is a valid, open file descriptor owned by `file` for the
+    // duration of this call.
+    let rc = unsafe { libc::flock(fd, libc::LOCK_EX | libc::LOCK_NB) };
+    if rc == 0 {
+        return Ok(true);
+    }
+    let err = io::Error::last_os_error();
+    if err.kind() == io::ErrorKind::WouldBlock {
+        Ok(false)
+    } else {
+        Err(err)
+    }
+}
+
 const WRITER_LOCK_DIR: &str = "thread-writer-locks";
 const COORDINATION_LOCK_FILE: &str = ".coordination.lock";
 
@@ -61,6 +105,24 @@ impl WriterLockCoordinator {
                 ),
             })?;
 
+        #[cfg(target_os = "android")]
+        match android_try_flock_exclusive(&file) {
+            Ok(true) => {}
+            Ok(false) => {
+                return Err(ThreadStoreError::Conflict {
+                    message: format!("thread {thread_id} already has an active writer"),
+                });
+            }
+            Err(err) => {
+                return Err(ThreadStoreError::Internal {
+                    message: format!(
+                        "failed to acquire thread writer lock {}: {err}",
+                        path.display()
+                    ),
+                });
+            }
+        }
+        #[cfg(not(target_os = "android"))]
         match file.try_lock() {
             Ok(()) => {}
             Err(std::fs::TryLockError::WouldBlock) => {
@@ -106,6 +168,14 @@ impl WriterLockCoordinator {
                     path.display()
                 ),
             })?;
+        #[cfg(target_os = "android")]
+        android_flock_exclusive_blocking(&file).map_err(|err| ThreadStoreError::Internal {
+            message: format!(
+                "failed to acquire thread writer coordination lock {}: {err}",
+                path.display()
+            ),
+        })?;
+        #[cfg(not(target_os = "android"))]
         file.lock().map_err(|err| ThreadStoreError::Internal {
             message: format!(
                 "failed to acquire thread writer coordination lock {}: {err}",
@@ -140,6 +210,28 @@ impl WriterLockCoordinator {
                     continue;
                 }
             };
+            #[cfg(target_os = "android")]
+            match android_try_flock_exclusive(&file) {
+                Ok(true) => {
+                    drop(file);
+                    if let Err(err) = fs::remove_file(&path)
+                        && err.kind() != io::ErrorKind::NotFound
+                    {
+                        warn!(
+                            "failed to remove stale thread writer lock {}: {err}",
+                            path.display()
+                        );
+                    }
+                }
+                Ok(false) => {}
+                Err(err) => {
+                    warn!(
+                        "failed to inspect thread writer lock {}: {err}",
+                        path.display()
+                    );
+                }
+            }
+            #[cfg(not(target_os = "android"))]
             match file.try_lock() {
                 Ok(()) => {
                     drop(file);
