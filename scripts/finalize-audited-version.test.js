const { test } = require('node:test');
const { strict: assert } = require('assert');
const { computeFinalizedManifest } = require('./finalize-audited-version.js');

function createManifest(overrides = {}) {
  return {
    canonical_package_status: 'ready_to_publish',
    public_distribution_status: 'staged_for_publish',
    latest_audited_version: '0.144.6',
    previous_stable_version: '0.144.6',
    tracked_versions: ['0.144.5', '0.144.6'],
    rollback_version: '0.144.1',
    updated_at: '2026-07-01T00:00:00.000Z',
    ...overrides,
  };
}

test('finalize: rollback_version becomes the previous latest_audited_version', () => {
  const manifest = createManifest();
  const updated = computeFinalizedManifest(manifest, '0.145.0');
  assert.equal(updated.rollback_version, '0.144.6');
  assert.equal(updated.latest_audited_version, '0.145.0');
  assert.equal(updated.canonical_package_status, 'published');
  assert.equal(updated.public_distribution_status, 'published');
});

test('finalize: idempotent rerun for the same version does not touch rollback_version', () => {
  const manifest = createManifest({
    latest_audited_version: '0.145.0',
    previous_stable_version: '0.144.6',
    rollback_version: '0.144.6',
  });
  const updated = computeFinalizedManifest(manifest, '0.145.0');
  assert.equal(updated.rollback_version, '0.144.6');
  assert.equal(updated.latest_audited_version, '0.145.0');
});

test('finalize: throws when previous_stable_version is missing', () => {
  const manifest = createManifest({ previous_stable_version: undefined });
  assert.throws(() => computeFinalizedManifest(manifest, '0.145.0'), /previous_stable_version is missing/);
});

test('finalize: throws when latest_audited_version does not match previous_stable_version', () => {
  const manifest = createManifest({
    latest_audited_version: '0.144.6',
    previous_stable_version: '0.144.5',
  });
  assert.throws(
    () => computeFinalizedManifest(manifest, '0.145.0'),
    /does not match previous_stable_version/
  );
});

test('finalize: does not add a duplicate entry to tracked_versions', () => {
  const manifest = createManifest({ tracked_versions: ['0.144.6', '0.145.0'] });
  const updated = computeFinalizedManifest(manifest, '0.145.0');
  assert.deepEqual(updated.tracked_versions, ['0.144.6', '0.145.0']);
});

test('finalize: appends the new version to tracked_versions when absent', () => {
  const manifest = createManifest({ tracked_versions: ['0.144.6'] });
  const updated = computeFinalizedManifest(manifest, '0.145.0');
  assert.deepEqual(updated.tracked_versions, ['0.144.6', '0.145.0']);
});
