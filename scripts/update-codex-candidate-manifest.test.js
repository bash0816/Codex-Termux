const { test } = require('node:test');
const { strict: assert } = require('assert');
const fs = require('fs');
const path = require('path');
const { updateManifests } = require('./update-codex-candidate-manifest.js');

// Test helper to create a manifest with defaults
function createManifest(overrides = {}) {
  return {
    canonical_package_name: '@bash0816/codex-termux',
    canonical_package_status: 'published',
    public_distribution_status: 'published',
    support_status: 'active',
    latest_audited_version: '0.144.4',
    latest_candidate_version: '0.144.4',
    previous_stable_version: '0.144.3',
    candidate_state: 'published',
    candidate_state_status: 'ready_to_publish',
    tracked_versions: ['0.141.0', '0.144.4'],
    historical_baselines: ['0.131.0'],
    gate_summary: '0.144.4 published as @latest.',
    install_command: 'npm install -g @bash0816/codex-termux@latest',
    update_strategy: 'npm_reinstall_audited_package',
    update_command: 'codex update',
    update_guidance: 'Run codex update to install the latest audited package version.',
    manifest_url: 'https://raw.githubusercontent.com/bash0816/Codex-Termux/main/config/codex-termux-release-manifest.json',
    rollback_version: '0.144.1',
    rollback_policy: 'Reinstall an explicit published version with npm to roll back.',
    distribution_strategy: 'public-npm-package',
    audited_at: '2026-07-01T00:00:00+09:00',
    updated_at: '2026-07-15T12:00:47.575Z',
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

// Test helper to create a package-specific manifest
function createPackageManifest(overrides = {}) {
  return {
    canonical_package_name: '@bash0816/codex-termux',
    canonical_package_status: 'published',
    public_distribution_status: 'published',
    support_status: 'active',
    latest_audited_version: '0.144.4',
    latest_candidate_version: '0.144.4',
    previous_stable_version: '0.144.3',
    candidate_state: 'published',
    candidate_state_status: 'ready_to_publish',
    tracked_versions: ['0.141.0', '0.144.4'],
    historical_baselines: ['0.131.0'],
    gate_summary: '0.144.4 published as @latest.',
    rollback_version: '0.144.1',
    install_command: 'npm install -g @bash0816/codex-termux@latest',
    update_strategy: 'npm_reinstall_audited_package',
    manifest_url: 'https://raw.githubusercontent.com/bash0816/Codex-Termux/main/config/codex-termux-release-manifest.json',
    rollback_policy: 'Reinstall an explicit published version with npm to roll back.',
    distribution_strategy: 'public-npm-package',
    audited_at: '2026-07-01T00:00:00+09:00',
    updated_at: '2026-07-15T12:00:47.575Z',
    platform: 'android',
    arch: 'arm64',
    planned_wrapper_package: {
      name: '@bash0816/codex-termux',
      status: 'published',
      scope: 'wrapper_package',
    },
    // Package-specific fields
    update_command: 'npm install -g @bash0816/codex-termux@latest',
    update_guidance: 'Use npm to reinstall the latest published package. Do not install the upstream @openai/codex package directly on Termux.',
    ...overrides,
  };
}

test('updateManifests: updates latest_candidate_version in root manifest', () => {
  const tmpDir = fs.mkdtempSync(path.join(require('os').tmpdir(), 'test-'));
  try {
    const rootPath = path.join(tmpDir, 'root-manifest.json');
    const packagePath = path.join(tmpDir, 'package-manifest.json');

    fs.writeFileSync(rootPath, JSON.stringify(createManifest(), null, 2) + '\n');
    fs.writeFileSync(packagePath, JSON.stringify(createPackageManifest(), null, 2) + '\n');

    updateManifests({
      rootPath,
      packagePath,
      candidateVersion: '0.144.5',
      candidateState: 'ready_to_publish',
    });

    const rootManifest = JSON.parse(fs.readFileSync(rootPath, 'utf8'));
    assert.equal(rootManifest.latest_candidate_version, '0.144.5');
  } finally {
    fs.rmSync(tmpDir, { recursive: true });
  }
});

test('updateManifests: updates candidate_state_status in root manifest', () => {
  const tmpDir = fs.mkdtempSync(path.join(require('os').tmpdir(), 'test-'));
  try {
    const rootPath = path.join(tmpDir, 'root-manifest.json');
    const packagePath = path.join(tmpDir, 'package-manifest.json');

    fs.writeFileSync(rootPath, JSON.stringify(createManifest(), null, 2) + '\n');
    fs.writeFileSync(packagePath, JSON.stringify(createPackageManifest(), null, 2) + '\n');

    updateManifests({
      rootPath,
      packagePath,
      candidateVersion: '0.144.5',
      candidateState: 'codex_build_dispatched',
    });

    const rootManifest = JSON.parse(fs.readFileSync(rootPath, 'utf8'));
    assert.equal(rootManifest.candidate_state_status, 'codex_build_dispatched');
  } finally {
    fs.rmSync(tmpDir, { recursive: true });
  }
});

test('updateManifests: updates latest_candidate_version in package manifest', () => {
  const tmpDir = fs.mkdtempSync(path.join(require('os').tmpdir(), 'test-'));
  try {
    const rootPath = path.join(tmpDir, 'root-manifest.json');
    const packagePath = path.join(tmpDir, 'package-manifest.json');

    fs.writeFileSync(rootPath, JSON.stringify(createManifest(), null, 2) + '\n');
    fs.writeFileSync(packagePath, JSON.stringify(createPackageManifest(), null, 2) + '\n');

    updateManifests({
      rootPath,
      packagePath,
      candidateVersion: '0.144.5',
      candidateState: 'ready_to_publish',
    });

    const packageManifest = JSON.parse(fs.readFileSync(packagePath, 'utf8'));
    assert.equal(packageManifest.latest_candidate_version, '0.144.5');
  } finally {
    fs.rmSync(tmpDir, { recursive: true });
  }
});

test('updateManifests: updates candidate_state_status in package manifest', () => {
  const tmpDir = fs.mkdtempSync(path.join(require('os').tmpdir(), 'test-'));
  try {
    const rootPath = path.join(tmpDir, 'root-manifest.json');
    const packagePath = path.join(tmpDir, 'package-manifest.json');

    fs.writeFileSync(rootPath, JSON.stringify(createManifest(), null, 2) + '\n');
    fs.writeFileSync(packagePath, JSON.stringify(createPackageManifest(), null, 2) + '\n');

    updateManifests({
      rootPath,
      packagePath,
      candidateVersion: '0.144.5',
      candidateState: 'codex_build_dispatched',
    });

    const packageManifest = JSON.parse(fs.readFileSync(packagePath, 'utf8'));
    assert.equal(packageManifest.candidate_state_status, 'codex_build_dispatched');
  } finally {
    fs.rmSync(tmpDir, { recursive: true });
  }
});

test('updateManifests: ensures updated_at is identical in both root and package manifests', () => {
  const tmpDir = fs.mkdtempSync(path.join(require('os').tmpdir(), 'test-'));
  try {
    const rootPath = path.join(tmpDir, 'root-manifest.json');
    const packagePath = path.join(tmpDir, 'package-manifest.json');

    fs.writeFileSync(rootPath, JSON.stringify(createManifest(), null, 2) + '\n');
    fs.writeFileSync(packagePath, JSON.stringify(createPackageManifest(), null, 2) + '\n');

    updateManifests({
      rootPath,
      packagePath,
      candidateVersion: '0.144.5',
      candidateState: 'ready_to_publish',
    });

    const rootManifest = JSON.parse(fs.readFileSync(rootPath, 'utf8'));
    const packageManifest = JSON.parse(fs.readFileSync(packagePath, 'utf8'));

    assert.equal(rootManifest.updated_at, packageManifest.updated_at);
  } finally {
    fs.rmSync(tmpDir, { recursive: true });
  }
});

test('updateManifests: preserves package-specific update_command field', () => {
  const tmpDir = fs.mkdtempSync(path.join(require('os').tmpdir(), 'test-'));
  try {
    const rootPath = path.join(tmpDir, 'root-manifest.json');
    const packagePath = path.join(tmpDir, 'package-manifest.json');

    const rootManifest = createManifest({
      update_command: 'codex update',
    });
    const packageManifest = createPackageManifest({
      update_command: 'npm install -g @bash0816/codex-termux@latest',
    });

    fs.writeFileSync(rootPath, JSON.stringify(rootManifest, null, 2) + '\n');
    fs.writeFileSync(packagePath, JSON.stringify(packageManifest, null, 2) + '\n');

    updateManifests({
      rootPath,
      packagePath,
      candidateVersion: '0.144.5',
      candidateState: 'ready_to_publish',
    });

    const updatedPackageManifest = JSON.parse(fs.readFileSync(packagePath, 'utf8'));
    assert.equal(updatedPackageManifest.update_command, 'npm install -g @bash0816/codex-termux@latest');
  } finally {
    fs.rmSync(tmpDir, { recursive: true });
  }
});

test('updateManifests: preserves package-specific update_guidance field', () => {
  const tmpDir = fs.mkdtempSync(path.join(require('os').tmpdir(), 'test-'));
  try {
    const rootPath = path.join(tmpDir, 'root-manifest.json');
    const packagePath = path.join(tmpDir, 'package-manifest.json');

    const rootManifest = createManifest({
      update_guidance: 'Run codex update to install the latest audited package version.',
    });
    const packageManifest = createPackageManifest({
      update_guidance: 'Use npm to reinstall the latest published package. Do not install the upstream @openai/codex package directly on Termux.',
    });

    fs.writeFileSync(rootPath, JSON.stringify(rootManifest, null, 2) + '\n');
    fs.writeFileSync(packagePath, JSON.stringify(packageManifest, null, 2) + '\n');

    updateManifests({
      rootPath,
      packagePath,
      candidateVersion: '0.144.5',
      candidateState: 'ready_to_publish',
    });

    const updatedPackageManifest = JSON.parse(fs.readFileSync(packagePath, 'utf8'));
    assert.equal(
      updatedPackageManifest.update_guidance,
      'Use npm to reinstall the latest published package. Do not install the upstream @openai/codex package directly on Termux.'
    );
  } finally {
    fs.rmSync(tmpDir, { recursive: true });
  }
});
