## 0.147.0 — 2026-08-13

upstream openai/codex 0.147.0 追従。

**Upstream highlights / 主な変更（upstream）**

## New Features
- Install portable Agent Plugins and search across local, personal, workspace, and remote plugin catalogs. (#36544, #36409, #36919, #36796)
- Organize conversations into persistent, manually ordered sections and browse long transcripts incrementally. (#35722, #36007, #36380, #36948, #36950)
- Enable automatically reviewed approvals with the new `--approve-for-me` CLI flag. (#36373)
- Import Cursor-managed skills and synchronize changes to imported Claude and Cursor conversations without creating duplicates. (#36361, #36356, #35623)
- Support the opt-in MCP 2026-07-28 protocol, including paginated discovery, multi-round requests, and non-blocking server startup. (#35724, #35725, #35590, #35742)
- Enable cached web search and remote conversation compaction for Amazon Bedrock. (#36938, #36981)

## Bug Fixes
- Redact secrets and complete bearer tokens from displayed commands and replayed conversation history. (#36893, #36908)
- Prevent lost or stalled terminal input when focus returns, MCP servers initialize, or Ghostty handles keyboard shortcuts. (#35649, #35957, #36834)
- Correct rendering and cursor positioning for Japanese characters, emoji, hyperlinks, and text near viewport boundaries. (#35960, #35962, #37166)
- Properly interrupt Windows background processes and handle Windows filesystem paths consistently. (#35655, #35851, #37129)
- Require explicit trust for unfamiliar local projects and enforce managed authentication restrictions before credentials are used. (#36960, #37132)
- Harden plugin isolation and deny network access when policy updates fail. (#37027, #36967, #36037)

## Documentation
- Improve the bundled OpenAI documentation skill with targeted official-source lookup and clearer guidance for Codex, model selection, and API workflows. (#36014)

## Chores
- Upgrade the MCP SDK to 3.0.0, Ratatui to 0.30.2, and V8 to 150.4.0. (#36001, #35959, #35831)
- Secure macOS release notarization using Azure Key Vault instead of exporting private signing keys. (#37154)
- Remove the deprecated `codex exec --full-auto` flag; use `--sandbox workspace-write` instead. (#36054)
- Stop publishing redundant Linux bundle archives; use the standard `codex-package-<target>` release archives. (#36342)

## Changelog

Full Changelog: https://github.com/openai/codex/compare/rust-v0.146.0...rust-v0.147.0

- #35590 Expose cached MCP tools before server startup @copyberry
- #35594 Recommend longer waits in the v2 wait_agent schema @copyberry
- #35595 Allow alpha hotfix versions in R2 releases @copyberry
- #35597 Add metrics for extension-rendered skill catalogs @copyberry
- #35607 Record metrics for empty skill catalogs @copyberry
- #35608 Support model-owned token budget defaults @copyberry
- #35621 Skip restored token usage replay for exec resumes @copyberry
- #35623 Parse Claude and Cursor session records separately @copyberry
- #35642 Make OpenTelemetry provider shutdown idempotent @copyberry
- #35644 Preserve thread metadata when rollout files are missing @copyberry
- #35649 Preserve TUI input when terminal focus returns @copyberry
- #35652 Enable network policy callbacks for remote exec @copyberry
- #35653 Test developer instruction inheritance for multi-agent workers @copyberry
- #35655 Terminate Windows non-TTY processes on interrupt @copyberry
- #35656 Preserve multi-agent settings across config representations @copyberry
- #35661 Place host skills before permission instructions @copyberry
- #35663 Evaluate character matching over skill routing metadata @copyberry
- #35665 Fix the async watcher test harness on Windows @copyberry
- #35668 Expose the network proxy spec constructor @copyberry
- #35670 Raise the Windows exec yield floor to 10 seconds @copyberry
- #35671 Route curated plugins by authentication mode @copyberry
- #35675 Prepare MCP and plugin recommendations concurrently @copyberry
- #35678 Preserve paginated thread metadata across resumes @copyberry
- #35685 Load cloud-managed profiles for `codex sandbox` @copyberry
- #35688 Point crossterm patch to the OpenAI OSS fork @copyberry
- #35689 Preserve item timestamps in thread history projections @copyberry
- #35691 Include empty-preview threads in relationship listings @copyberry
- #35693 Refresh the subagent picker in the background @copyberry
- #35695 Honor the configured SQLite home in the logs client @copyberry
- #35708 Add configurable developer instructions for v2 subagents @copyberry
- #35715 Support streaming bodies in route-aware HTTP requests @copyberry
- #35717 Reuse route-aware clients for OpenAI file uploads @copyberry
- #35720 Upgrade rmcp to 3.0.0-beta.3 @copyberry
- #35721 Honor disabled code mode fallback without a process host @copyberry
- #35722 Add persisted sections for organizing threads @copyberry
- #35724 Add MCP 2026-07-28 discovery support @copyberry
- #35725 Complete MCP 2026 client support @copyberry
- #35738 Add bounded metadata for executed tool calls @copyberry
- #35742 Avoid blocking turns on optional MCP startup @copyberry
- #35744 Keep agent registry identities consistent @copyberry
- #35766 Emit host skill budget warnings from world state @copyberry
- #35769 Share the skills budget across host and executor catalogs @copyberry
- #35772 Throttle models cache TTL renewals @copyberry
- #35773 Scale skill metadata budgets with context windows @copyberry
- #35777 Resolve MCP tool catalogs concurrently @copyberry
- #35779 Load thread titles concurrently during session startup @copyberry
- #35785 Support self-serve Business ProLite accounts @copyberry
- #35787 Gate paginated thread history on the state database @copyberry
- #35794 Wait for MCP readiness in the curated sync test @copyberry
- #35802 Tag reports with the selected turn's model and effort @copyberry
- #35806 Route MCP OAuth through configured HTTP clients @copyberry
- #35814 Use configured HTTP clients for all MCP OAuth requests @copyberry
- #35818 Advance latest-alpha-cli after release publishing completes @copyberry
- #35821 Use the shared HTTP client for TUI network checks @copyberry
- #35825 Use the shared HTTP client for announcement tips @copyberry
- #35828 Enforce centralized SQLite connection creation @copyberry
- #35830 Route WebRTC sideband joins to the Realtime API @copyberry
- #35831 Update rusty_v8 to 150.4.0 @copyberry
- #35835 Track parent turns for nested Codex requests @copyberry
- #35836 Clean up cancelled MCP elicitation requests @copyberry
- #35837 Expose plugin eligibility metadata in app-server summaries @copyberry
- #35839 Decouple recommended plugins from tool suggestions @copyberry
- #35840 Handle legacy MCP discovery prevalidation errors @copyberry
- #35843 Tie remote exec servers to their parent stdin @copyberry
- #35845 Support plaintext collaboration tool messages @copyberry
- #35850 Preserve foreign paths in background terminal listings @copyberry
- #35851 Normalize Windows namespace paths in path URIs @copyberry
- #35854 Box app-server event payloads @copyberry
- #35856 Resolve imported connectors by MCP server name @copyberry
- #35857 Add Bazel unit test targets for Rust binaries @copyberry
- #35859 Expose plugin installation timestamps in app-server summaries @copyberry
- #35870 Include session titles in external agent import history @copyberry
- #35874 Mark the primary environment in model context @copyberry
- #35875 Allow environment readiness updates in place @copyberry
- #35878 Use step environments for MCP file uploads @copyberry
- #35886 Show blocked goals as stalled in the TUI @copyberry
- #35887 Clean up side conversations in the background @copyberry
- #35895 Inherit ready step environments when spawning agents @copyberry
- #35937 Let unrelated tools run while MCP servers start @copyberry
- #35941 Bound MCP namespace descriptions @copyberry
- #35942 Update tests for current tool call and app-server event types @copyberry
- #35944 Report direct input capability for listed subagents @copyberry
- #35957 Fix TUI input queue handling during MCP startup @copyberry
- #35959 Upgrade Ratatui to 0.30.2 @copyberry
- #35960 Preserve hyperlink cell widths during terminal diffing @copyberry
- #35962 Fix TUI layout for halfwidth Japanese sound marks @copyberry
- #35982 Avoid cloning rollout history when truncating forks @copyberry
- #35989 Display title-only reasoning summaries in the TUI @copyberry
- #35990 Test exec-server compatibility across Codex versions @copyberry
- #35992 Group external agent config migration into a module @copyberry
- #35997 Remove obsolete rusty_v8 146.4.0 Bazel targets @copyberry
- #36001 Upgrade rmcp to 3.0.0 @copyberry
- #36002 Resolve MCP file uploads with environment-native paths @copyberry
- #36006 Reduce response serialization and rollout scan overhead @copyberry
- #36007 Add persisted manual ordering for thread sections @copyberry
- #36008 Route pet asset downloads through the shared HTTP client @copyberry
- #36011 Share optional MCP startup grace across connection sets @copyberry
- #36014 Refine OpenAI docs skill source routing @copyberry
- #36020 Avoid cloning ignored analytics notifications @copyberry
- #36030 Increase the app-server tracing test stack size @copyberry
- #36031 Load cloud-managed servers in MCP CLI commands @copyberry
- #36033 Use the shared HTTP client in codex-protocol @copyberry
- #36035 Exit the stdio app-server when its connection closes @copyberry
- #36036 Allow naming forked chats from the TUI @copyberry
- #36037 Deny network access when an allow amendment fails @copyberry
- #36039 Limit MCP catalog pagination @copyberry
- #36043 Document the Responses API proxy reqwest exception @copyberry
- #36045 Distinguish unknown MCP authentication status @copyberry
- #36047 Extract MCP environment headers into a local variable @copyberry
- #36049 Keep tool-call metrics out of Statsig exports @copyberry
- #36051 Avoid overwriting symlinked migration targets @copyberry
- #36054 Remove legacy `--full-auto` handling from `codex exec` @copyberry
- #36055 Expose MCP read-only hints in tool call items @copyberry
- #36076 Remove codex-core's direct reqwest dependency @copyberry
- #36078 Route Ollama through the shared HTTP client @copyberry
- #36083 Handle fractional rate limits in thread history projection @copyberry
- #36092 Correlate image requests and explicit interrupts with turns @copyberry
- #36119 Unify tool runtime assembly before router construction @copyberry
- #36120 Delegate readiness waits to tool runtimes @copyberry
- #36121 Sandbox executor skill resource reads @copyberry
- #36124 Respect filesystem permissions during capability discovery @copyberry
- #36127 Centralize tool registration and protect host tools @copyberry
- #36128 Preserve delegated tasks across remote compaction @copyberry
- #36129 Resolve normalized tool name collisions in code mode @copyberry
- #36133 Preserve executor workspace permissions for apply_patch @copyberry
- #36138 Isolate apply-patch permission test variants @copyberry
- #36139 Bound the code mode output termination test @copyberry
- #36140 Wait for memory consolidation shutdown before finishing jobs @copyberry
- #36146 Stabilize approval scenario tests @copyberry
- #36148 Harden the file change approval integration test @copyberry
- #36149 Strengthen session file change approval coverage @copyberry
- #36165 Stabilize file approval replay test @copyberry
- #36166 Make pending realtime sideband test deterministic @copyberry
- #36167 Harden the auto-review model override test @copyberry
- #36168 Make tool telemetry tag collection synchronous @copyberry
- #36171 Test workspace-root patch protection for metadata @copyberry
- #36177 Test remote Guardian network approval scoping @copyberry
- #36181 Record attempted tool calls in response metadata @copyberry
- #36183 Use permission profiles throughout sandbox execution @copyberry
- #36184 Coalesce concurrent remote metadata requests @copyberry
- #36187 Refresh environment dates from the configured clock @copyberry
- #36188 Make thread history projection resilient to malformed rollouts @copyberry
- #36191 Label explicit skill injection metrics @copyberry
- #36194 Avoid shifting bytes in streaming output buffers @copyberry
- #36207 Record normalized sandbox violation events @copyberry
- #36212 Precompute app-server protocol exports @copyberry
- #36217 Run code mode exclusively through the standalone host @copyberry
- #36218 Expose connector candidates in external agent detection @copyberry
- #36221 Ignore passthrough metadata when reconciling rollout items @copyberry
- #36223 Preserve executor paths in read command actions @copyberry
- #36228 Support Enterprise automation account plans @copyberry
- #36237 Ignore symbolic slash-tmp permissions on Windows @copyberry
- #36239 Refresh precomputed app-server protocol exports @copyberry
- #36264 Prefer the bundled resource for the code mode host @copyberry
- #36271 Derive report prompt hashes from persisted rollouts @copyberry
- #36306 Restrict hosted MCP credentials to local environments @copyberry
- #36309 Use the host skill provider catalog in world state @copyberry
- #36310 Isolate MCP OAuth credentials by environment @copyberry
- #36311 Include skills in debug prompt input output @copyberry
- #36327 Preserve discovery order for host skill path aliases @copyberry
- #36329 Restrict `shell_command` to a single local environment @copyberry
- #36336 Detect connectors used in external agent sessions @copyberry
- #36339 Enable skills in the MCP server @copyberry
- #36342 Stop publishing legacy Linux bundle archives @copyberry
- #36350 Require explicit sandbox permissions with shell justifications @copyberry
- #36351 Use model catalog collaboration mode messages @copyberry
- #36354 Pass sessions directly to session tasks @copyberry
- #36355 Keep MCP tool calls bound to their thread @copyberry
- #36356 Sync updates to imported external agent sessions @copyberry
- #36357 Use the step-scoped router for tool execution @copyberry
- #36359 Consolidate MCP config editing in codex-core @copyberry
- #36360 Use MCP bindings as the step tool catalog @copyberry
- #36361 Migrate Cursor-managed skills into Codex @copyberry
- #36364 Move skill catalog rendering out of core @copyberry
- #36365 Add strict automatic review for MCP elicitations @copyberry
- #36367 Keep effective tool exposure in the registry @copyberry
- #36372 Run native Windows Bazel tests with MSVC @copyberry
- #36373 Add an `--approve-for-me` CLI flag @copyberry
- #36374 Enable sandboxed V8 for code mode @copyberry
- #36378 Load local session pickers from the state DB first @copyberry
- #36380 Add thread section management APIs @copyberry
- #36384 Load turn summaries with paginated queries @copyberry
- #36385 Add acknowledged user message submission to core @copyberry
- #36388 Track image preparation details in turn analytics @copyberry
- #36389 Enforce single-writer ownership for all thread histories @copyberry
- #36393 Avoid redundant filesystem probes @copyberry
- #36402 Declare the experimental plugin search API @copyberry
- #36408 Allow custom Codex instructions for realtime transitions @copyberry
- #36409 Implement remote plugin search @copyberry
- #36410 Make user input blocking behavior explicit @copyberry
- #36411 Use Git repositories as pre-tool hook test markers @copyberry
- #36413 Add a realtime delegation acknowledgement control @copyberry
- #36440 Extract exec-server request dispatching @copyberry
- #36482 Avoid querying terminal size on every TUI redraw @copyberry
- #36485 Increase remote plugin bundle size limits @copyberry
- #36507 Retain attempted tool metadata across prompts @copyberry
- #36511 Support two-stroke TUI key chords @copyberry
- #36534 Raise the MCP catalog item limit to 2,048 @copyberry
- #36544 Support portable Agent Plugins throughout installation @copyberry
- #36632 Preserve SQLite thread metadata during goal mutations @copyberry
- #36635 Expose onboarding hints in login completion notifications @copyberry
- #36641 Capture rollout budget units from response usage @copyberry
- #36715 Use provider-reported rollout budget units @copyberry
- #36716 Deduplicate MCP resource operation handling @copyberry
- #36727 Simplify turn metadata state ownership @copyberry
- #36729 Correlate code mode tool analytics with model responses @copyberry
- #36732 Stabilize the cloud environment HTTP test @copyberry
- #36734 Deduplicate MCP resource list handling @copyberry
- #36740 Store turn skill state in extension data @copyberry
- #36742 Simplify contextual user fragment registration @copyberry
- #36744 Store the extension registry directly in its builder @copyberry
- #36745 Consolidate apply_patch runtime execution @copyberry
- #36757 Wait for patch events before reading shell snapshots @copyberry
- #36759 Harden the TUI focus palette regression test @copyberry
- #36764 Avoid building code-mode definitions during registration @copyberry
- #36769 Stabilize the startup Git enrichment integration test @copyberry
- #36770 Stabilize deferred goal fork testing @copyberry
- #36771 Harden Linux managed proxy helper lifecycles @copyberry
- #36772 Raise the host-owned Codex Apps catalog limit @copyberry
- #36773 Derive the active user config layer from the layer stack @copyberry
- #36774 Clarify config layer iteration APIs @copyberry
- #36779 Stabilize network policy event capture in concurrent tests @copyberry
- #36781 Add per-surface MCP tool exposure controls @copyberry
- #36782 Add Guardian session reuse and interruption tests @copyberry
- #36787 Consolidate model instructions in `ModelMessages` @copyberry
- #36792 Gate plugin usage instructions by model capability @copyberry
- #36793 Terminate timed-out Git process trees @copyberry
- #36796 Add Agent Plugins MCP config parsing @copyberry
- #36797 Normalize rusty_v8 checksum manifest line endings @copyberry
- #36800 Avoid reinjecting permissions after command approvals @copyberry
- #36807 Extract audio preparation into a utility crate @copyberry
- #36808 Prefer SQLite names for local session archive commands @copyberry
- #36809 Prefer the state database for `exec resume --last` @copyberry
- #36810 Add MCP client conformance regression gates @copyberry
- #36811 Honor per-environment login shell policy @copyberry
- #36812 Add a dual-WebSocket transport for code mode @copyberry
- #36815 Identify agents by name in token budget context @copyberry
- #36822 Fix typo in approval resolver name @copyberry
- #36825 Consolidate approval telemetry context @copyberry
- #36830 Time out stalled code-mode host requests @copyberry
- #36834 Avoid requesting key-release events in Ghostty @copyberry
- #36840 Keep API request metrics out of Statsig exports @copyberry
- #36856 Support deferred loading for freeform tools @copyberry
- #36857 Support custom tools in namespaces @copyberry
- #36862 Consolidate thread spawning behind a request object @copyberry
- #36871 Parallelize R2 asset publishing with DotSlash @copyberry
- #36877 Move executor skill bundle loading into the skills extension @copyberry
- #36880 Move direct executor skill discovery into the skills extension @copyberry
- #36882 Preserve complete MCP namespace descriptions @copyberry
- #36884 Add host skill root loading @copyberry
- #36892 Support leaf models in multi-agent v2 @copyberry
- #36893 Redact secrets from app-server command execution items @copyberry
- #36895 Handle late MCP startup results after lag timeout @copyberry
- #36898 Avoid redundant filesystem metadata probes @copyberry
- #36900 Register app tools independently of the connector list @copyberry
- #36901 Propagate updated permissions to review threads @copyberry
- #36903 Load skill interface metadata in the host loader @copyberry
- #36904 Limit RMCP logs persisted to SQLite @copyberry
- #36906 Preserve model providers when reloading v2 agents @copyberry
- #36908 Improve bearer token secret redaction @copyberry
- #36910 Negotiate MCP extensions per app-server session @copyberry
- #36912 Read approval policy from the current turn configuration @copyberry
- #36913 Move skill policy resolution into `codex-skills` @copyberry
- #36916 Centralize app enabled-state evaluation @copyberry
- #36917 Test explicit plugin mentions with disabled apps @copyberry
- #36919 Merge local plugins into plugin search results @copyberry
- #36921 Move the host skills service into the skills extension @copyberry
- #36924 Reject implicitly discovered bare Git repositories @copyberry
- #36930 Read turn permissions from the current configuration @copyberry
- #36935 Trust undecided local projects automatically @copyberry
- #36938 Enable cached web search for Amazon Bedrock @copyberry
- #36939 Include policy approval reasons in Guardian reviews @copyberry
- #36941 Use current session settings for review threads @copyberry
- #36943 Move host skill root resolution into the skills extension @copyberry
- #36945 Grant the blob size policy job read access to contents @copyberry
- #36947 Accept user input when starting idle turns @copyberry
- #36948 Paginate transcript history in the TUI @copyberry
- #36949 Improve paginated TUI history loading @copyberry
- #36950 Paginate TUI transcript history @copyberry
- #36951 Harden paginated history handling in the TUI @copyberry
- #36952 Add durable per-thread user submission queues @copyberry
- #36954 Add tool registry collision policy configuration @copyberry
- #36956 Keep image resize notices attached during remote compaction @copyberry
- #36959 Track connectors detected in external agent sessions @copyberry
- #36960 Prompt before trusting local project directories @copyberry
- #36963 Link Codex attribution in pull request bodies @copyberry
- #36964 Preserve working directories when importing external sessions @copyberry
- #36966 Allow disabling the built-in image viewer @copyberry
- #36967 Skip symlinks when installing plugins @copyberry
- #36970 Make token budget context identity configurable @copyberry
- #36976 Honor explicit-only orchestrator skills @copyberry
- #36977 Improve connector detection for migrated sessions @copyberry
- #36979 Add Fence auditing to the blob size workflow @copyberry
- #36981 Enable remote compaction for Amazon Bedrock @copyberry
- #36983 Preserve ChatGPT auth for trusted staging MCP servers @copyberry
- #36984 Support configured ChatGPT cookies in HTTP clients @copyberry
- #36986 Add process-scoped PSP routing for ChatGPT requests @copyberry
- #36987 Add opt-in concurrent exec-server request dispatch @copyberry
- #36989 Preserve shared bundled skill caches @copyberry
- #36990 Remove legacy collaboration mode variants @copyberry
- #36992 Allow injecting model catalog caches @copyberry
- #36993 Support `includeTurns` reads for paginated threads @copyberry
- #36998 Support deferred custom tools in tool search @copyberry
- #37000 Keep shared skill caches fresh across plugin loads @copyberry
- #37020 Enforce strict tool name collision errors @copyberry
- #37022 Canonicalize default tools under the `functions` namespace @copyberry
- #37027 Enforce Agent Plugin runtime boundaries @copyberry
- #37031 Apply permission profile updates to future turn environments @copyberry
- #37035 Align registry tests with canonical tool names @copyberry
- #37038 Use turn environment permissions for tool execution @copyberry
- #37040 Use turn environment permissions for context and discovery @copyberry
- #37053 Reject conflicting namespace descriptions in strict tool mode @copyberry
- #37055 Add safer TUI defaults for cyber models @copyberry
- #37066 Preserve longer MCP source descriptions in tool search @copyberry
- #37068 Fall back to per-process MCP cleanup on macOS @copyberry
- #37083 Consolidate unified exec output state @copyberry
- #37101 Reuse stable MCP bindings across sampling steps @copyberry
- #37103 Use Luna for API-key Guardian reviews @copyberry
- #37109 Bound interactive telemetry shutdown @copyberry
- #37114 Add per-session code-mode execution limits @copyberry
- #37128 Centralize tool approval handling in `Session` @copyberry
- #37129 Make Windows path URI comparisons ASCII-case-insensitive @copyberry
- #37132 Enforce managed authentication requirements locally @copyberry
- #37134 Report prompt image resizing to the model @copyberry
- #37144 Preserve discovery paths for symlinked skills @copyberry
- #37145 Gate Apps usage instructions by model capability @copyberry
- #37147 Track provisioned environment state across registration @copyberry
- #37149 Project orchestrator skills through world state @copyberry
- #37151 Coalesce concurrent Git status scans @copyberry
- #37154 Use Azure Key Vault for macOS notarization @copyberry
- #37156 Test remote environments reported ready before selection @copyberry
- #37157 Harden named session lookup in the TUI @copyberry
- #37162 Load host skill roots through the skills extension @copyberry
- #37166 Keep textarea cursors and rendering inside the viewport @copyberry
- #37167 Expose session sources to MCP contributors @copyberry
- #37168 Bound remote MCP handshake HTTP requests @copyberry
- #37169 Move plugin skill snapshot integration tests into core @copyberry
- #37174 Centralize skill invocation helpers in `codex-skills` @copyberry
- #37175 Add legacy rollout migration to paginated history @copyberry
- #37177 Move explicit skill selection into the skills crate @copyberry
- #37178 Preserve image transparency metadata in app-server items @copyberry
- #37188 Reserve the `tool_search` namespace for the search tool @copyberry
- #37189 Track multi-agent usage hints in world state @copyberry

### Install

```sh
npm install -g @bash0816/codex-termux@0.147.0
codex --version
```
## 0.146.1 — 2026-08-07

upstream openai/codex 0.146.1 追従。

**Upstream highlights / 主な変更（upstream）**

## Bug Fixes

- Apply safer automatic-review defaults for cyber-capable models and explain permission changes in the terminal interface. (#37057)

## Changelog

Full Changelog: https://github.com/openai/codex/compare/rust-v0.146.0...rust-v0.146.1

- #37057 [0.146] Backport safer cyber-model auto-review defaults @anp-oai

### Install

```sh
npm install -g @bash0816/codex-termux@0.146.1
codex --version
```
## 0.146.0 — 2026-07-29

upstream openai/codex 0.146.0 追従。

**Upstream highlights / 主な変更（upstream）**

## New Features

- Name new sessions with `/new` or `/clear`, pin important threads, and switch between side conversations without closing them. (#34605, #34840, #35011)
- Support Agent Plugins manifests, workspace plugin publishing, and additional plugin marketplaces for Amazon Bedrock and Claude Code. (#35105, #35254, #34931, #34979)
- Fork threads with paginated history, including temporary forks that do not appear in thread listings. (#35220, #35251)
- Connect app-server to remote Code Mode hosts over WebSocket. (#35078, #35098)
- Enable standalone web search for compatible custom model providers. (#34846)
- Discover executor-provided skills and securely read their associated resources, including explicitly selected skills. (#35184, #35198)

## Bug Fixes

- Honor configured proxies across authentication, plugin downloads, MCP authorization, remote execution, WebSockets, redirects, and LM Studio connections. (#34479, #34509, #34655, #34678, #35023, #35056, #35239)
- Keep MCP connections and Apps tools current when authentication or configuration changes, reconnecting closed servers without restarting healthy connections. (#34952, #34957, #35028, #35144, #35146, #35151)
- Preserve submitted messages, final responses, failed-turn errors, imported timestamps, and approval settings across interruptions, replay, imports, and forks. (#34839, #34777, #35524, #34989, #34664)
- Improve terminal responsiveness and rendering, including nonblocking interrupts, keyboard handling, narrow layouts, hyperlinks, and refreshed mention results. (#35000, #35021, #34775, #34778, #35365, #35375)
- Fix Windows navigation keys, reliably terminate sandboxed process trees, and preserve proxy settings during security reviews. (#34625, #34624, #35036)
- Retain more available skills under tight context budgets and warn when skill catalogs must be truncated. (#34732, #34738, #34997)

## Documentation

- Document shared HTTP-client usage, proxy-aware connection pooling, and safe outbound request handling. (#34669)
- Clarify Windows drive-letter canonicalization for `PathUri` values. (#34667)

## Chores

- Publish release artifacts, channel metadata, and installer aliases through OpenAI-hosted release infrastructure, with GitHub fallback. (#34505, #34508, #34729, #34910)
- Sign and notarize bundled macOS helper executables before packaging. (#35264)
- Reduce app-server serialization overhead and unnecessary request-building allocations. (#34761, #34766, #34825)
- Add enterprise-plan recognition and administrator controls for in-app updates. (#35238, #35537)

## Changelog

Full Changelog: https://github.com/openai/codex/compare/rust-v0.145.0...rust-v0.146.0

- #34447 Add a route-aware HTTP client pool @copyberry
- #34449 Make external session detection limits configurable @copyberry
- #34451 Attribute external agent imports by provider @copyberry
- #34463 Support alpha hotfix release versions @copyberry
- #34469 Preserve thread settings for goal-first and forked threads @copyberry
- #34476 Separate HTTP execution from request logging @copyberry
- #34478 Honor `CARGO_HTTP_CAINFO` in managed proxy environments @copyberry
- #34479 Re-resolve system proxy routes across redirects @copyberry
- #34481 Add route-aware redirect test coverage @copyberry
- #34483 Expand route-aware proxy redirect coverage @copyberry
- #34490 Route backend requests through the HTTP client factory @copyberry
- #34491 Route cloud environment discovery through the HTTP client pool @copyberry
- #34495 Honor system proxy settings in the daemon updater @copyberry
- #34497 Preserve custom arg0 for sandboxed exec-server processes @copyberry
- #34505 Mirror Rust release artifacts to Cloudflare R2 @copyberry
- #34506 Respect system proxies during plugin startup sync @copyberry
- #34508 Publish release metadata to R2 channels @copyberry
- #34509 Honor system proxy settings for remote plugins @copyberry
- #34514 Add an optional releases.openai.com installer source @copyberry
- #34516 Allow `numer` in codespell checks @copyberry
- #34517 Pass empty inherited FDs in the Wine PTY test @copyberry
- #34522 Split MCP connection manager into focused modules @copyberry
- #34525 Add step-scoped data to extension contributors @copyberry
- #34533 Centralize compacted rollout item construction @copyberry
- #34540 Detach Git metadata commands from stdin @copyberry
- #34544 Size Noise handshake buffers to their messages @copyberry
- #34547 Add reciprocal rank fusion skill selection @copyberry
- #34550 Test thread-scoped MCP refresh behavior @copyberry
- #34551 Simplify TUI restoration for the external editor @copyberry
- #34552 Remove unused RtOptions setters @copyberry
- #34553 Remove the unused TUI shutdown app command @copyberry
- #34558 Remove obsolete ignored tests @copyberry
- #34559 Add backend client support for Codex user settings @copyberry
- #34561 Extract MCP binding clients from the connection manager @copyberry
- #34562 Record rollout boundaries for materialized turns @copyberry
- #34563 Page through inherited thread history @copyberry
- #34566 Protect fork history references during rollout cleanup @copyberry
- #34570 Highlight CUDA files as C++ in the TUI @copyberry
- #34573 Accept `forceRefetch` in plugin list requests @copyberry
- #34578 Gate the TUI suspend restore helper on Unix @copyberry
- #34581 Add routing-card lexical skill selection @copyberry
- #34588 Bind MCP calls to captured catalog revisions @copyberry
- #34590 Add keyed shell environment policy filters @copyberry
- #34597 Enforce exact values from managed config requirements @copyberry
- #34598 Skip missing paths in filesystem sandbox entries @copyberry
- #34601 Sanitize skill names in injection metrics @copyberry
- #34603 Allow explicitly permitted loopback proxy targets @copyberry
- #34605 Allow naming sessions with `/new` and `/clear` @copyberry
- #34611 Add compatibility policies for skill catalog rendering @copyberry
- #34612 Detach non-interactive subprocesses from stdin @copyberry
- #34613 Route Windows sandbox proxy traffic by restricting SID @copyberry
- #34615 Initialize missing-path behavior in exec-server sandbox test @copyberry
- #34620 Add exec-server network policy callback types @copyberry
- #34621 Load paginated model context across rollout lineages @copyberry
- #34622 Increase the auto-review model override test timeout @copyberry
- #34624 Terminate Windows process trees with job objects @copyberry
- #34625 Fix Windows TUI navigation key handling @copyberry
- #34626 Scale skill metadata budgets with model context windows @copyberry
- #34629 Harden Windows elevated sandbox startup @copyberry
- #34630 Add a policy-aware HTTP client builder @copyberry
- #34631 Migrate agent identity to the shared HTTP client @copyberry
- #34636 Keep the TUI open when starting a turn fails @copyberry
- #34637 Attribute review findings to repository rules @copyberry
- #34640 Update Windows process-tree tests for inherited FDs @copyberry
- #34641 Harden managed proxy setup for sandboxed executions @copyberry
- #34643 Migrate login HTTP construction to `HttpClient` @copyberry
- #34644 Verify Git plugin SHA checkouts @copyberry
- #34645 Always assign response item IDs @copyberry
- #34649 Propagate resolved proxy policy through auth routing @copyberry
- #34650 Require auth managers to receive routing configuration @copyberry
- #34651 Migrate core test support to the shared HTTP client @copyberry
- #34654 Render turn diffs for foreign environment paths @copyberry
- #34655 Honor configured proxy routes for auth refreshes @copyberry
- #34664 Preserve approvals reviewer when forking threads @copyberry
- #34667 Document `PathUri` drive letter canonicalization @copyberry
- #34669 Expand codex-http-client usage guidance @copyberry
- #34678 Route LM Studio requests through the shared HTTP client @copyberry
- #34681 Add session headers to realtime conversation starts @copyberry
- #34687 Configure Codex Auto Review model metadata @copyberry
- #34708 Rename the MCP connection manager to `McpConnectionSet` @copyberry
- #34713 Order unified exec lifecycle events reliably @copyberry
- #34728 Skip Git enrichment for prewarm and Guardian turns @copyberry
- #34729 Publish stable installer aliases to R2 @copyberry
- #34732 Preserve skill catalog entries under metadata pressure @copyberry
- #34733 Make MCP resource clients follow the latest runtime @copyberry
- #34734 Remove step-scoped data from extension contributors @copyberry
- #34738 Drop skill descriptions before omitting catalog entries @copyberry
- #34744 Update skills budget tests for extension API changes @copyberry
- #34746 Match core skill ordering in extension catalogs @copyberry
- #34747 Register the MCP 2026-07-28 feature flag @copyberry
- #34761 Reduce app-server JSON serialization overhead @copyberry
- #34763 Retry websocket requests when the previous response is missing @copyberry
- #34766 Reduce typed app-server request serialization overhead @copyberry
- #34769 Add the git attribution extension @copyberry
- #34770 Enable exec-server network policy callbacks @copyberry
- #34771 Size unified mention popups to visible results @copyberry
- #34772 Normalize whitespace-only lines in agent messages @copyberry
- #34775 Clamp session headers to narrow terminal widths @copyberry
- #34777 Include the final agent message in turn completion summaries @copyberry
- #34778 Coalesce wrapped OSC 8 hyperlinks in the TUI terminal @copyberry
- #34779 Use the live parent history mode when forking agents @copyberry
- #34781 Upgrade Bazel Rust and LLVM dependencies @copyberry
- #34784 Reject dynamic environments named `local` @copyberry
- #34785 Report skill catalog truncation during rendering @copyberry
- #34786 Simplify app-server integration test setup @copyberry
- #34789 Avoid unnecessary post-sampling token estimates @copyberry
- #34795 Remove obsolete step store from git attribution tests @copyberry
- #34796 Skip syntax highlighting for lines over 4 KiB @copyberry
- #34797 Suppress omission notices in core-compatible skill catalogs @copyberry
- #34806 Use path URIs in shell approval keys @copyberry
- #34808 Centralize SQLite connection configuration @copyberry
- #34811 Fix network access rendering in sandbox prompts @copyberry
- #34814 Consolidate thread startup around `StartThreadOptions` @copyberry
- #34816 Support configurable realtime BEM channel prefixes @copyberry
- #34819 Enable git attribution across Codex entry points @copyberry
- #34823 Run code-mode tests in non-Windows Bazel CI @copyberry
- #34824 Normalize Guardian review cwd reuse keys @copyberry
- #34825 Reduce cloning when building Responses requests @copyberry
- #34827 Remove Windows Bazel lint toolchain overrides @copyberry
- #34831 Flush analytics before in-process app server shutdown @copyberry
- #34835 Track compaction time in turn profiles @copyberry
- #34839 Preserve user input when MCP startup is interrupted @copyberry
- #34840 Add persisted thread pinning to the app server @copyberry
- #34844 Remove first-party type from app metadata @copyberry
- #34845 Track multi-agent mode in world state @copyberry
- #34846 Allow custom providers to opt into standalone web search @copyberry
- #34847 Use Guardian model limits for review sessions @copyberry
- #34849 Cache remote plugin catalogs by scope @copyberry
- #34850 Disable image generation for Free-plan accounts @copyberry
- #34851 Use batch metadata for plugin app summaries @copyberry
- #34852 Wake sleeping threads for queued agent mail @copyberry
- #34877 Wait for local plugin cache refreshes in `plugin/list` @copyberry
- #34883 Set a default user agent for MCP HTTP requests @copyberry
- #34887 Allow disabling the multi-agent wait tool @copyberry
- #34910 Prefer releases.openai.com in standalone installers @copyberry
- #34930 Centralize thread MCP state in `McpRuntime` @copyberry
- #34931 Use the API plugin marketplace for Amazon Bedrock @copyberry
- #34940 Keep session defaults static during config batch writes @copyberry
- #34952 Reuse MCP connections across runtime refreshes @copyberry
- #34957 Replace closed MCP connections during reconciliation @copyberry
- #34959 Handle @ in local marketplace paths @copyberry
- #34962 Move MCP connection helpers into the test module @copyberry
- #34969 Keep the sleep tool outside code mode @copyberry
- #34978 Honor disabled redirects in route-aware HTTP clients @copyberry
- #34979 Infer the bundled Claude Code plugin marketplace @copyberry
- #34981 Record externally completed agent config imports @copyberry
- #34986 Enforce single-writer ownership for paginated threads @copyberry
- #34989 Preserve timestamps when importing external agent sessions @copyberry
- #34991 Allow omitting MCP tool prefixes per server @copyberry
- #34994 Honor the configured SQLite home across state consumers @copyberry
- #34995 Initialize execution environments with the final HTTP policy @copyberry
- #34996 Separate Codex error details from retry metadata @copyberry
- #34997 Warn when skill catalogs exceed their context budget @copyberry
- #35000 Make TUI turn interrupts nonblocking @copyberry
- #35011 Keep side conversations open when switching threads @copyberry
- #35012 Expose remote skill icon URLs through app server @copyberry
- #35013 Support incremental replay of updated thread items @copyberry
- #35015 Align installed app duration metrics with the legacy baseline @copyberry
- #35016 Add trusted plugin script attribution @copyberry
- #35020 Attribute command executions to trusted plugin scripts @copyberry
- #35021 Adapt keyboard event reporting to the terminal @copyberry
- #35023 Route exec-server HTTP through configured proxy policy @copyberry
- #35028 Preserve refreshed Apps tools across MCP runtime updates @copyberry
- #35029 Preserve plugin attribution across command approvals @copyberry
- #35031 Enforce writer ownership for thread archive and deletion @copyberry
- #35033 Expose Browser Use requirements through the app server @copyberry
- #35034 Route environment registry requests through the shared HTTP client @copyberry
- #35036 Preserve Windows sandbox proxy settings in guardian sessions @copyberry
- #35048 Track app/read request duration @copyberry
- #35049 Register the Guardian V2 feature flag @copyberry
- #35054 Allow disabling the update_plan tool @copyberry
- #35056 Route exec-server WebSockets through configured proxies @copyberry
- #35059 Decouple exec-server HTTP from reqwest types @copyberry
- #35063 Track deferred tool namespaces in world state @copyberry
- #35065 Avoid duplicating deferred sources in tool search @copyberry
- #35067 Fix Bazel test configuration for platform-specific data @copyberry
- #35078 Add WebSocket transport to the code-mode host @copyberry
- #35098 Support remote code-mode hosts in app-server @copyberry
- #35105 Support Agent Plugins manifests @copyberry
- #35106 Allow hosts to customize `wait_for_environment` descriptions @copyberry
- #35144 Prewarm MCP runtime updates in the background @copyberry
- #35146 Refresh MCP runtimes when session auth changes @copyberry
- #35151 Reconnect MCP servers on explicit refresh @copyberry
- #35164 Encapsulate MCP refresh coordination @copyberry
- #35168 Route extension warnings to app-server threads @copyberry
- #35172 Compact host skill paths under metadata pressure @copyberry
- #35175 Wait for reloaded worker completion in the resume test @copyberry
- #35184 Expose executor skills through skill tools @copyberry
- #35194 Preserve output from hooks that exit before reading stdin @copyberry
- #35196 Make the Apps recovery exposure test deterministic @copyberry
- #35198 Enable resource reads for explicit executor skills @copyberry
- #35204 Refresh MCP runtimes across thread startup @copyberry
- #35205 Use current MCP authority for elicitation reviews @copyberry
- #35213 Refresh managed MCP requirements for active threads @copyberry
- #35216 Refresh MCP config independently across threads @copyberry
- #35220 Support paginated thread forks @copyberry
- #35221 Avoid persisting non-local threads for hook transcripts @copyberry
- #35238 Support the ent26 enterprise plan @copyberry
- #35239 Route MCP auth discovery through runtime HTTP clients @copyberry
- #35251 Support ephemeral forks of paginated threads @copyberry
- #35254 Expose workspace plugin publish capability @copyberry
- #35261 Propagate remote plugin IDs to skill metadata @copyberry
- #35262 Track remote plugin IDs in skill invocation analytics @copyberry
- #35264 Sign bundled macOS helper binaries @copyberry
- #35266 Allow disabling the in-process code-mode host fallback @copyberry
- #35267 Harden network approval cancellation and concurrency @copyberry
- #35271 Include code-mode tool names in Responses Lite metadata @copyberry
- #35275 Trace remote exec-server connection setup @copyberry
- #35280 Skip plugin MCP filtering when no allowlists are configured @copyberry
- #35359 Handle exec-server network policy requests in the client @copyberry
- #35363 Include item start times in completion events @copyberry
- #35364 Bound Code Mode metadata compatibility headers @copyberry
- #35365 Keep unified mention results fresh @copyberry
- #35375 Make the keymap action menu responsive @copyberry
- #35408 Ignore generated system skills in the skills watcher @copyberry
- #35414 Raise the MCP server recursion limit @copyberry
- #35523 Shut down the in-process outbound router explicitly @copyberry
- #35524 Preserve terminal turn errors in replayed history @copyberry
- #35525 Skip inactive TUI threads without pending user interaction @copyberry
- #35530 Track model and personality in world state @copyberry
- #35537 Add managed policy for in-app updates @copyberry

### Install

```sh
npm install -g @bash0816/codex-termux@0.146.0
codex --version
```
## 0.145.0 — 2026-07-22

upstream openai/codex 0.145.0 追従。

**Upstream highlights / 主な変更（upstream）**

## New Features

- Added experimental paginated thread history with efficient resume, search, persisted names, sub-agent support, and memories. (#33364, #33907, #34085, #34229, #34386)
- Expanded `/import` to migrate Cursor and Claude Code settings, MCP servers, plugins, sessions, commands, and project-scoped memories. (#31672, #33411, #33426, #33444)
- Added experimental Amazon Bedrock login, custom endpoint and authentication support, and GPT-5.6 Sol as the default Bedrock model. (#31327, #33170, #33175, #32288, #33695)
- Added audio inputs and tool outputs, including common local audio formats, and introduced streaming realtime V3 conversations. (#33261, #33856, #33932, #34080, #34385)
- Stabilized the opt-in multi-agent V2 experience with configurable sub-agent models, reasoning levels, concurrency, restored roles, and improved agent navigation. (#33550, #33631, #33657, #33841, #34383)
- Added secure, clickable inline visualization links in the terminal UI. (#33925, #34217, #34346)

## Bug Fixes

- Editing an earlier prompt or retrying a safety-buffered turn now creates a contextual branch, preserving the original conversation, attachments, and mention bindings. (#33201, #33207, #33211)
- Improved terminal responsiveness for long conversations and streamed output through incremental Markdown rendering, fewer redraws, caching, and bounded command output. (#34045, #34049, #34216, #34223, #34359)
- Prevented slow or conflicting MCP startup and authentication flows by enforcing startup timeouts, avoiding blocking OAuth discovery, serializing refreshes, and reusing tool catalogs safely. (#32229, #32781, #32825, #33184, #33297)
- Improved Windows execution and sandbox reliability, including native exec-server sandboxing, network-proxy enforcement, hidden helper consoles, and correctly quoted hook commands. (#32849, #32857, #33926, #34423)
- Fixed compact release-metadata parsing and macOS code-mode installation, with an in-process fallback when the external code-mode host is unavailable. (#31667, #31876, #31899)
- Strengthened safety and approval handling with better forced-`rm` detection, consistent full-access confirmation, and preserved rejection reasons across tools. (#32989, #33464, #34400)

## Documentation

- Updated the bundled OpenAI Docs skill with current GPT-5.6 model resolution, prompting, and migration guidance across macOS, Linux, and Windows. (#31842, #33121)

## Chores

- Migrated bundled GPT-5.4 selections and internal uses to the corresponding GPT-5.6 Terra and Luna variants. (#33173)
- Reduced startup and large-context overhead with concurrent skill/plugin discovery and more efficient remote compaction. (#31566, #33369, #33423, #34431)
- Updated the packaged ripgrep binary to 15.2.0. (#34384)

## Changelog

Full Changelog: https://github.com/openai/codex/compare/rust-v0.144.0...rust-v0.145.0

- #31667 fix: parse compact release metadata in installer @efrazer-oai
- #31362 core: route realtime and memories through HTTP client factory @bolinfest
- #31566 perf(skills): reuse walk inventory for host loading @jif-oai
- #31576 Bound exec-server process event reordering @jif-oai
- #31756 test(skills): assert symlinked metadata loading @jif-oai
- #31581 Resolve selected capability roots without starting executors @jif-oai
- #31789 Stop persisting RMCP service traces @jif-oai
- #31792 Summarize streamed response item logs @jif-oai
- #31791 Filter routine Hyper logs from SQLite @jif-oai
- #31790 Reduce MCP tool-list trace volume @jif-oai
- #31804 Stabilize the memories feature flag @jif-oai
- #31803 fix(mcp): default Apps product SKU to codex @alecbarber-oai
- #31745 code-mode: retain shared MCP types for deferred tools @sayan-oai
- #31672 Import enabled plugins from known marketplaces @charlesgong-openai
- #31652 fix(tui): hide empty reasoning summaries @fcoury-oai
- #31767 Remove the network proxy config wrapper @jif-oai
- #31481 fix: forward originator to Codex Apps MCP @raquel-openai
- #31363 codex-api: route file uploads through HTTP client factory @bolinfest
- #31813 tui: update safety buffering copy @etraut-openai
- #31830 fix(sandboxing): initialize network proxy config inline @fcoury-oai
- #31431 build: ratchet direct reqwest dependencies @bolinfest
- #31876 code-mode: fix installation on darwin @cconger
- #31842 Update bundled OpenAI Docs skill for GPT-5.6 @kkahadze-oai
- #31637 login: route raw auth flows through HTTP client @bolinfest
- #31686 [codex-apps] Filter optional file fields by tool schema @tsarlandie-oai
- #31899 code-mode: fall back to using in process v8 if we fail to resolve external process @cconger
- #31805 Bound remote MCP stdio lines @jif-oai
- #30293 Resolve and pin MCP OAuth credential stores @stevenlee-oai
- #31892 exec-server: materialize filesystem workspace roots @pakrym-oai
- #31327 feat: add managed Bedrock login API @celia-oai
- #31295 bench: add codex help e2e macrobenchmark @anp-oai
- #31428 bench: add e2e benchmark entrypoints @anp-oai
- #31937 exec-server: expose process helper to outer sandbox @pakrym-oai
- #32093 Remove the legacy exec policy engine @copyberry
- #32106 Reduce startup latency for ancestor discovery @copyberry
- #32112 Bound streamed exec-server HTTP response bodies @copyberry
- #32122 Test the shared exec-server HTTP response byte budget @copyberry
- #32123 Bound exec-server stdio JSON-RPC messages @copyberry
- #32126 Test bounded concurrency in ancestor discovery @copyberry
- #32134 Test stdio JSON-RPC size limits with LF and CRLF @copyberry
- #32135 Propagate tracing subscribers to exec start tasks @copyberry
- #32150 Keep unified exec output collection bounded @copyberry
- #32193 Validate memory consolidation artifacts before succeeding @copyberry
- #32197 Rebind memory consolidation workspace roots @copyberry
- #32200 Add a skill invocation extension contributor @copyberry
- #32206 Always send reasoning parameters in Responses requests @copyberry
- #32213 Generate unique IDs for review rollout messages @copyberry
- #32214 Propagate workspace roots to exec-server sandboxes @copyberry
- #32229 Serialize MCP OAuth credential refreshes @copyberry
- #32231 Support pending remote environment registration @copyberry
- #32232 Let permission hooks resolve strict auto-review requests @copyberry
- #32234 Add dedicated storage for paginated thread history @copyberry
- #32246 Extract reverse JSONL scanning from session indexing @copyberry
- #32256 Improve Responses WebSocket timing telemetry @copyberry
- #32261 Preserve local path conventions in automatic approvals @copyberry
- #32263 Include start times in terminal turn events @copyberry
- #32272 Expose scheduled tasks in plugin details @copyberry
- #32274 Remove the personality migration @copyberry
- #32276 Repair unterminated rollout files before appending @copyberry
- #32277 Honor `personality = "none"` in model instructions @copyberry
- #32280 Include terminal errors in turn completion events @copyberry
- #32286 Clarify waiting behavior in safety buffering prompts @copyberry
- #32288 Make GPT-5.6 Sol the default Bedrock model @copyberry
- #32289 Persist paginated items in the local thread store @copyberry
- #32290 Respect model support for reasoning summaries @copyberry
- #32301 Trust hooks from materialized workspace plugins @copyberry
- #32302 Prefer the Codex home socket for Unix IDE context @copyberry
- #32305 Improve file blob upload diagnostics @copyberry
- #32312 Require prefixes for outbound response item IDs @copyberry
- #32316 Stop falling back to older model availability announcements @copyberry
- #32326 Use canonical links in the moved config notice @copyberry
- #32332 Add ordinals to paginated rollout records @copyberry
- #32441 Preserve parent sandbox enforcement for memory consolidation @copyberry
- #32460 Emit thread-idle lifecycle after guardian interrupts @copyberry
- #32461 Expand tabs when rendering TUI diffs @copyberry
- #32485 Use available width for skill names in the toggle view @copyberry
- #32628 Improve composer completion target resolution @copyberry
- #32698 Extract connector runtime snapshot management @copyberry
- #32744 Log missing personality messages at trace level @copyberry
- #32746 Make advanced reasoning selection explicit in the TUI @copyberry
- #32747 Align Guardian reviews with session configuration @copyberry
- #32749 Expose model overrides for multi-agent v2 spawns @copyberry
- #32751 Restrict spawned-agent models to the active backend @copyberry
- #32761 Add shadow metrics for lexical skill selection @copyberry
- #32768 Align shadow skill selection with observable sources @copyberry
- #32780 Enable skill search shadow selection by default @copyberry
- #32781 Apply MCP startup timeouts during client creation @copyberry
- #32801 Refactor OAuth store lock contention tests @copyberry
- #32822 Make explicit multi-agent mode override proactive delegation @copyberry
- #32825 Avoid blocking thread startup on MCP OAuth discovery @copyberry
- #32835 Forward turn metadata in standalone web search @copyberry
- #32837 Restore V2 agent identities on root thread resume @copyberry
- #32838 Reap exited PID-managed app-server children @copyberry
- #32844 Expand millisecond duration histogram boundaries @copyberry
- #32849 Hide Windows filesystem helper console windows @copyberry
- #32857 Require the elevated Windows sandbox for network proxies @copyberry
- #32858 Persist slash-command popup dismissal @copyberry
- #32864 Coalesce concurrent Windows sandbox setup requests @copyberry
- #32866 Allow responses after image generation @copyberry
- #32867 Include connector IDs in MCP tool call analytics @copyberry
- #32875 Use model catalog policies for Guardian auto review @copyberry
- #32881 Broaden remote compaction model fallback @copyberry
- #32884 Prepare external agent migration for source adapters @copyberry
- #32887 Tag shell tool telemetry by command category @copyberry
- #32891 Attach connector caches to diagnostic uploads @copyberry
- #32894 Serialize plugin install requests @copyberry
- #32896 Load model context from a bounded rollout suffix @copyberry
- #32897 Route blocked network requests to their owning calls @copyberry
- #32898 Expose structured standalone web search results @copyberry
- #32899 Add exec-server environment status checks @copyberry
- #32900 Derive collaboration settings from turn context @copyberry
- #32903 Include session IDs in tool item analytics events @copyberry
- #32905 Timestamp app-server notifications at emission @copyberry
- #32911 Allow injecting the models manager into `ThreadManager` @copyberry
- #32920 Expose environment status through app-server @copyberry
- #32923 Materialize paginated thread history in SQLite @copyberry
- #32928 Resume thread history projection from its SQLite checkpoint @copyberry
- #32945 Restrict Guardian reviewer tools @copyberry
- #32949 Tighten recommended plugin install suggestions @copyberry
- #32952 Scope runtime workspace roots to execution environments @copyberry
- #32985 Expose exact per-response usage in raw app-server events @copyberry
- #32989 Always confirm before enabling full access @copyberry
- #33013 Bound exec-server JSON-RPC decoding complexity @copyberry
- #33026 Include raw response completions in TypeScript envelopes @copyberry
- #33030 Remove task messages from `list_agents` output @copyberry
- #33031 Preserve JSON number precision in exec-server RPC messages @copyberry
- #33035 Use session IDs for prompt cache keys @copyberry
- #33040 Send plugin analytics with API key authentication @copyberry
- #33076 Add an agent extension runner @copyberry
- #33093 Preserve streamed output during capped history replay @copyberry
- #33105 Fix TUI status visibility around streamed output @copyberry
- #33107 Preserve special filesystem subpaths as wire strings @copyberry
- #33109 Reject forks of paginated threads @copyberry
- #33113 Allow injecting the Codex Apps tools cache @copyberry
- #33121 Refine GPT-5.6 prompting and migration guidance @copyberry
- #33147 Support model catalog permission messages @copyberry
- #33149 Build MCP tool runtimes before router planning @copyberry
- #33150 Clarify exec yield timing on Windows @copyberry
- #33152 Support paginated thread history in app-server list APIs @copyberry
- #33155 Trace startup prewarm tasks @copyberry
- #33156 Run detached reviews as review-agent turns @copyberry
- #33159 Move sleep items to the extension-owned lifecycle path @copyberry
- #33166 Defer Noise environment connections until registration @copyberry
- #33167 Document the Windows exec yield time range @copyberry
- #33170 Support Amazon Bedrock login in the app server @copyberry
- #33173 Migrate GPT-5.4 uses to GPT-5.6 variants @copyberry
- #33175 Handle Amazon Bedrock credentials during logout @copyberry
- #33177 Support model catalog templates for Guardian policy prompts @copyberry
- #33180 Serialize concurrent MCP stdin writes @copyberry
- #33182 Preserve plugin install failure subtypes during imports @copyberry
- #33184 Reuse MCP tool catalogs across sessions @copyberry
- #33185 Keep approval test targets in the temporary home @copyberry
- #33187 Honor workspace spend controls in rate-limit handling @copyberry
- #33198 Keep interrupted prompts in conversation history @copyberry
- #33200 Separate exec permission paths from core models @copyberry
- #33201 Branch conversations when editing earlier TUI prompts @copyberry
- #33203 Preserve in-flight state when restoring thread input @copyberry
- #33207 Retry safety-buffered turns on a forked thread @copyberry
- #33209 Separate session state from session I/O @copyberry
- #33211 Preserve thread context when retrying or editing turns @copyberry
- #33213 Prepare Python SDK 0.144.4 stable release @copyberry
- #33223 Instrument environment and plugin resolution paths @copyberry
- #33232 Disambiguate skill mentions from shell parameters @copyberry
- #33237 Fix skill completion around bound mentions with suffixes @copyberry
- #33239 Render TUI composer tabs as single-column spaces @copyberry
- #33243 Add auto-compaction fallback token-budget settings @copyberry
- #33251 Report selected environment connection transitions @copyberry
- #33255 Add a fallback phase before automatic context rollover @copyberry
- #33261 Add Frameless Bidi support for realtime conversations @copyberry
- #33297 Allow MCP servers to opt out of tool catalog caching @copyberry
- #33308 Expand MCP tool catalog cache regression coverage @copyberry
- #33364 Enable paginated thread history in app-server @copyberry
- #33367 Respect final-answer boundaries for queued agent mail @copyberry
- #33369 Scan skill roots concurrently @copyberry
- #33373 Render TUI prompts before submitting user turns @copyberry
- #33411 Migrate plugin commands into skills on install @copyberry
- #33412 Refactor world-state rendering tests into snapshots @copyberry
- #33414 Expose connector candidates from imported sessions @copyberry
- #33421 Fetch workspace connectors concurrently @copyberry
- #33423 Load executor plugin declarations concurrently @copyberry
- #33424 Attribute OpenAI docs MCP requests to Codex @copyberry
- #33425 Refresh host skill catalogs through world state @copyberry
- #33426 Add Cursor support to setup import @copyberry
- #33427 Propagate deferred environment capability roots to MCP @copyberry
- #33430 Avoid creating metadata paths in the Windows sandbox @copyberry
- #33432 Preserve paginated history for spawned subagents @copyberry
- #33435 Warn on conflicting capability root locations @copyberry
- #33441 Shut down Codex threads after approval scenarios @copyberry
- #33444 Add external agent memory migration @copyberry
- #33445 Select the elevated Windows sandbox for network proxies @copyberry
- #33446 Remove the unused network proxy loader @copyberry
- #33454 Track prompt cache write token usage @copyberry
- #33456 Move external agent migration into its crate @copyberry
- #33457 Use final answers in turn history summaries @copyberry
- #33459 Allow more time for image generation in code mode @copyberry
- #33464 Strengthen forced `rm` command detection @copyberry
- #33467 Remove template IDs from MCP tool call metadata @copyberry
- #33500 Add cache-write tokens to the raw response schema @copyberry
- #33509 Preserve encrypted content in MCP tool outputs @copyberry
- #33550 Unify multi-agent settings under `agents` @copyberry
- #33572 Expose spawn agent types only when roles are configured @copyberry
- #33605 Add fielded BM25 to shadow skill selection @copyberry
- #33613 Add character n-gram skill selection @copyberry
- #33614 Add multi-query lexical skill selection @copyberry
- #33631 Honor configured model defaults for spawned agents @copyberry
- #33632 Remove generated-default filesystem path variants @copyberry
- #33633 Clarify when to wait for starting environments @copyberry
- #33636 Clarify when to wait for starting environments @copyberry
- #33639 Remove the unused realtime WebRTC crate @copyberry
- #33640 Avoid duplicate cached app list update notifications @copyberry
- #33645 Run `write_stdin` concurrently across terminal sessions @copyberry
- #33651 Add an app-server API for reading app metadata @copyberry
- #33656 Validate reasoning effort after applying spawn roles @copyberry
- #33657 Restore agent roles when reloading v2 sub-agents @copyberry
- #33658 Keep active-turn environments stable across settings updates @copyberry
- #33659 Require data URLs for code-mode image output @copyberry
- #33665 Refresh step world state for all sessions @copyberry
- #33677 Forward thread originators from standalone extensions @copyberry
- #33680 Reword the apply_patch tool description @copyberry
- #33683 Preserve scope and provenance for imported agent memory @copyberry
- #33684 Extract TUI approval request payloads into structs @copyberry
- #33687 Avoid unnecessary writes during migration repair @copyberry
- #33695 Support custom transports for Amazon Bedrock @copyberry
- #33841 Make parent-owned sub-agent threads read-only in the TUI @copyberry
- #33842 Give the zsh fork decline test more execution time @copyberry
- #33843 Add an API for reading installed app runtime state @copyberry
- #33845 Confirm usage-limit resets before redemption @copyberry
- #33848 Fix the managed Bedrock logout test assertion @copyberry
- #33851 Record web search result payload sizes @copyberry
- #33852 Add batched executor capability discovery @copyberry
- #33855 Tag realtime transcript tail flush delegations @copyberry
- #33856 Stream realtime V3 Codex handoff output @copyberry
- #33858 Isolate core tests from shell and rollout persistence @copyberry
- #33861 Test workspace write isolation across exec servers @copyberry
- #33862 Suppress empty multi-agent mode messages @copyberry
- #33863 Report detailed session import error types @copyberry
- #33864 Keep feature tests focused on behavior @copyberry
- #33866 Remove the redundant tool dispatch wrapper @copyberry
- #33867 Add grace period to code-mode yield timeouts @copyberry
- #33868 Remove stale ignored core tests @copyberry
- #33870 Remove the redundant borrowed line wrapping helper @copyberry
- #33872 Remove unused TUI collaboration mode indicators @copyberry
- #33876 Track collaboration mode instructions in world state @copyberry
- #33883 Report CLI as the external agent config import source @copyberry
- #33889 Centralize thread MCP connections in `McpRuntime` @copyberry
- #33892 Limit rollout metadata reads to headers @copyberry
- #33893 Track realtime conversation state in world state @copyberry
- #33895 Add SessionEnd hooks for thread teardown @copyberry
- #33896 Expose plugin installation interstitial requirements @copyberry
- #33901 Support ChatGPT-branded Desktop app builds @copyberry
- #33902 Add bounded batch lookups for message history @copyberry
- #33903 Route realtime V3 handoffs by response channel @copyberry
- #33905 Batch persistent history reads during reverse search @copyberry
- #33906 Launch managed network proxies on remote executors @copyberry
- #33907 Add occurrence search for paginated threads @copyberry
- #33908 Allow publishing plugins through share updates @copyberry
- #33921 Preserve sub-agent liveness in the agent picker @copyberry
- #33922 Allow selecting path-backed agents in the TUI picker @copyberry
- #33923 Add audio variants to user input protocols @copyberry
- #33925 Render inline visualization links in the TUI @copyberry
- #33926 Fix quoted hook commands on Windows @copyberry
- #33929 Handle audio inputs and Bazel unit test arguments @copyberry
- #33930 Track inherited paginated rollout prefixes @copyberry
- #33932 Forward audio inputs to the Responses API @copyberry
- #33938 Centralize SQLite connection configuration @copyberry
- #33944 Track permission instructions in world state @copyberry
- #33950 Let users remember the working directory for resumed sessions @copyberry
- #33961 Refresh bundled model metadata @copyberry
- #33963 Add context to sampling retry logs @copyberry
- #33982 Gate audio history by model input modalities @copyberry
- #34038 Handle compressed rollouts in doctor thread inventory @copyberry
- #34045 Render streamed Markdown incrementally @copyberry
- #34047 Avoid resending the model for reasoning shortcuts @copyberry
- #34049 Avoid redundant TUI redraws while streaming @copyberry
- #34067 Seed realtime V3 sessions with initial text items @copyberry
- #34080 Add audio output support to dynamic tools and code mode @copyberry
- #34085 Support legacy views for paginated thread history @copyberry
- #34194 Avoid cloning thread data when rendering transcripts @copyberry
- #34197 Use the Markdown collector as the streaming source of truth @copyberry
- #34198 Start side conversations without replaying inherited turns @copyberry
- #34199 Avoid liveness races when starting side conversations @copyberry
- #34204 Avoid cloning buffered TUI history lines @copyberry
- #34206 Avoid retaining decoded MCP images in history cells @copyberry
- #34216 Speed up TUI Markdown layout @copyberry
- #34217 Keep incremental rendering with visualization context @copyberry
- #34218 Track TUI command completion separately from output @copyberry
- #34222 Avoid buffering replay-irrelevant thread notifications @copyberry
- #34223 Cache finalized Markdown history rendering @copyberry
- #34224 Avoid cloning file changes in TUI diff rendering @copyberry
- #34226 Backfill completion items only for the active exec turn @copyberry
- #34229 Persist names for paginated threads @copyberry
- #34232 Remeasure dynamic cells in the transcript overlay @copyberry
- #34234 Avoid redundant TUI subagent metadata requests @copyberry
- #34271 Migrate legacy exec policy allow rules @copyberry
- #34293 Preserve zsh tied PATH exports in shell snapshots @copyberry
- #34344 Reject unsupported history modes when loading rollouts @copyberry
- #34345 Remove unused Rust helpers @copyberry
- #34346 Track inline visualization directives during streaming @copyberry
- #34347 Avoid cloning deferred TUI lifecycle payloads @copyberry
- #34348 Cache TUI flex heights across frame passes @copyberry
- #34355 Parallelize TUI bootstrap requests @copyberry
- #34357 Render streamed command output through preview iterators @copyberry
- #34359 Keep streamed command output bounded in the TUI @copyberry
- #34361 Avoid cloning thread history for token usage replay @copyberry
- #34365 Animate Max and Ultra reasoning effort changes @copyberry
- #34366 Avoid cloning hyperlink text during TUI rendering @copyberry
- #34368 Use app-server skill metadata directly in the TUI @copyberry
- #34371 Clear stale Guardian reviews when turns end @copyberry
- #34375 Extend second-based latency histogram buckets @copyberry
- #34378 Avoid rendering generated images twice @copyberry
- #34380 Stop retrying turns with invalid tool images @copyberry
- #34381 Avoid cloning Responses WebSocket payloads @copyberry
- #34382 Keep paginated thread Git metadata in SQLite @copyberry
- #34383 Mark multi-agent v2 as stable @copyberry
- #34384 Update packaged ripgrep to 15.2.0 @copyberry
- #34385 Preserve audio across history and tool outputs @copyberry
- #34386 Enable memories for paginated threads @copyberry
- #34387 Refresh bundled model metadata @copyberry
- #34389 Route Codex Apps MCP through plugin service @copyberry
- #34390 Use copy-on-write storage for history snapshots @copyberry
- #34392 Ignore inherited ACEs when refreshing Windows write roots @copyberry
- #34393 Add configurable hook context spill limits @copyberry
- #34396 Run compact session-start hooks before turn continuation @copyberry
- #34400 Propagate approval rejection reasons @copyberry
- #34403 Update tests for history and hook API changes @copyberry
- #34407 Resolve paginated rollout lineages @copyberry
- #34408 Support threadless MCP connections without event channels @copyberry
- #34409 Limit the Linux `/proc` preflight filesystem view @copyberry
- #34411 Require absolute paths for test SQLite configuration @copyberry
- #34413 Remove CSV-backed agent jobs @copyberry
- #34416 Show completed hook warnings in TUI headers @copyberry
- #34417 Enrich app/read connector metadata @copyberry
- #34423 Support Windows sandboxing in the exec server @copyberry
- #34429 Move shared skill models into `codex-skills` @copyberry
- #34431 Optimize remote compaction history handling @copyberry
- #34434 Support catalog messages for non-request approval policies @copyberry
- #34435 Resolve outbound proxy routes explicitly @copyberry
- #34436 Honor managed permission profiles in network proxy resolution @copyberry
- #34438 Increase the patch approval test timeout @copyberry
- #34441 Add buffered code-mode exec yields @copyberry

### Install

```sh
npm install -g @bash0816/codex-termux@0.145.0
codex --version
```
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

