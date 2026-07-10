const { test } = require('node:test');
const { strict: assert } = require('assert');
const fs = require('fs');
const path = require('path');
const {
  getState,
  renderRootReadme,
  renderPackageManifest,
} = require('./sync-public-release-from-manifest.js');

// Test helper to create a manifest with defaults
function createManifest(overrides = {}) {
  return {
    canonical_package_name: '@bash0816/codex-termux',
    canonical_package_status: 'published',
    public_distribution_status: 'published',
    support_status: 'active',
    latest_audited_version: '0.144.1',
    latest_candidate_version: '0.144.1',
    previous_stable_version: '0.143.0',
    candidate_state: 'published',
    candidate_state_status: 'published',
    tracked_versions: ['0.143.0', '0.144.1'],
    historical_baselines: ['0.131.0'],
    gate_summary: '0.144.1 published as @latest. Build run 29071408896.',
    install_command: 'npm install -g @bash0816/codex-termux@latest',
    update_strategy: 'npm_reinstall_audited_package',
    update_command: 'codex update',
    update_guidance: 'Run codex update to install the latest audited package version.',
    manifest_url: 'https://raw.githubusercontent.com/bash0816/Codex-Termux/main/config/codex-termux-release-manifest.json',
    rollback_version: '0.143.0',
    rollback_policy: 'Reinstall an explicit published version with npm to roll back.',
    distribution_strategy: 'public-npm-package',
    audited_at: '2026-07-01T00:00:00+09:00',
    updated_at: '2026-07-10T08:30:00.000Z',
    platform: 'android',
    arch: 'arm64',
    planned_wrapper_package: {
      name: '@bash0816/codex-termux',
      status: 'published',
      scope: 'wrapper_package',
    },
    ...overrides,
  };
}

test('getState: published manifest with support_status=active', () => {
  const manifest = createManifest({
    canonical_package_status: 'published',
    public_distribution_status: 'published',
    support_status: 'active',
  });
  const state = getState(manifest);
  assert.equal(state.isPublished, true);
});

test('getState: published manifest with support_status=public_supported (legacy)', () => {
  const manifest = createManifest({
    canonical_package_status: 'published',
    public_distribution_status: 'published',
    support_status: 'public_supported',
  });
  const state = getState(manifest);
  assert.equal(state.isPublished, true);
});

test('getState: canonical_package_status not published blocks isPublished', () => {
  const manifest = createManifest({
    canonical_package_status: 'ready_to_publish',
    public_distribution_status: 'published',
    support_status: 'active',
  });
  const state = getState(manifest);
  assert.equal(state.isPublished, false);
});

test('getState: public_distribution_status not published blocks isPublished', () => {
  const manifest = createManifest({
    canonical_package_status: 'published',
    public_distribution_status: 'staged_for_publish',
    support_status: 'active',
  });
  const state = getState(manifest);
  assert.equal(state.isPublished, false);
});

test('renderRootReadme: published manifest contains "Public package release is live."', () => {
  const manifest = createManifest();
  const readme = renderRootReadme(manifest);
  assert(readme.includes('Public package release is live.'));
});

test('renderPackageManifest: includes all required copied fields', () => {
  const manifest = createManifest();
  const manifestJson = renderPackageManifest(manifest);
  const parsed = JSON.parse(manifestJson);

  // Check copied fields
  assert.equal(parsed.canonical_package_name, '@bash0816/codex-termux');
  assert.equal(parsed.canonical_package_status, 'published');
  assert.equal(parsed.public_distribution_status, 'published');
  assert.equal(parsed.support_status, 'active');
  assert.equal(parsed.latest_audited_version, '0.144.1');
  assert.equal(parsed.rollback_version, '0.143.0');
});

test('renderPackageManifest: excludes root-only fields (source_ref, source_sha, build_run_id, audit_evidence_ref, source_repo)', () => {
  const manifest = createManifest({
    source_ref: 'rust-v0.144.1',
    source_sha: '44918ea10c0f99151c6710411b4322c2f5c96bea',
    build_run_id: '29071408896',
    audit_evidence_ref: 'some-ref',
    source_repo: 'openai/codex',
  });
  const manifestJson = renderPackageManifest(manifest);
  const parsed = JSON.parse(manifestJson);

  assert(!parsed.hasOwnProperty('source_ref'));
  assert(!parsed.hasOwnProperty('source_sha'));
  assert(!parsed.hasOwnProperty('build_run_id'));
  assert(!parsed.hasOwnProperty('audit_evidence_ref'));
  assert(!parsed.hasOwnProperty('source_repo'));
});

test('renderPackageManifest: preserves package-specific update_command and update_guidance from existing bundled manifest', async () => {
  const repoRoot = path.resolve(__dirname, '..');
  const packageManifestPath = path.join(
    repoRoot,
    'packages',
    'codex-termux',
    'config',
    'codex-termux-release-manifest.json'
  );

  // Read actual bundled manifest to verify field preservation
  const actualBundledJson = fs.readFileSync(packageManifestPath, 'utf8');
  const actualBundled = JSON.parse(actualBundledJson);
  const expectedUpdateCommand = actualBundled.update_command;
  const expectedUpdateGuidance = actualBundled.update_guidance;

  // Create a root manifest with different values for these fields
  const manifest = createManifest({
    update_command: 'codex update',
    update_guidance: 'Run codex update to install the latest audited package version.',
  });

  // Render should preserve the existing bundled values, not the root values
  const manifestJson = renderPackageManifest(manifest);
  const parsed = JSON.parse(manifestJson);

  assert.equal(parsed.update_command, expectedUpdateCommand);
  assert.equal(parsed.update_guidance, expectedUpdateGuidance);
});
