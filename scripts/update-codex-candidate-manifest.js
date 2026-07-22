const fs = require('fs');
const path = require('path');

/**
 * Update both root and package manifests with candidate version and state.
 * Ensures updated_at timestamp is identical in both files.
 *
 * @param {Object} opts
 * @param {string} opts.rootPath - path to root manifest
 * @param {string} opts.packagePath - path to package manifest
 * @param {string} opts.candidateVersion - new latest_candidate_version
 * @param {string} opts.candidateState - new candidate_state_status
 */
function updateManifests({
  rootPath,
  packagePath,
  candidateVersion,
  candidateState,
}) {
  if (!rootPath || !packagePath || !candidateVersion || !candidateState) {
    throw new Error('All parameters (rootPath, packagePath, candidateVersion, candidateState) are required');
  }

  // Generate timestamp once, use for both files
  const updatedAt = new Date().toISOString();

  // Update root manifest
  const rootManifest = JSON.parse(fs.readFileSync(rootPath, 'utf8'));
  rootManifest.latest_candidate_version = candidateVersion;
  rootManifest.candidate_state_status = candidateState;
  rootManifest.updated_at = updatedAt;
  fs.writeFileSync(rootPath, `${JSON.stringify(rootManifest, null, 2)}\n`);

  // Update package manifest
  // Read existing package manifest to preserve distribution-specific fields
  const packageManifest = JSON.parse(fs.readFileSync(packagePath, 'utf8'));
  packageManifest.latest_candidate_version = candidateVersion;
  packageManifest.candidate_state_status = candidateState;
  packageManifest.updated_at = updatedAt;
  fs.writeFileSync(packagePath, `${JSON.stringify(packageManifest, null, 2)}\n`);
}

/**
 * Stage both root and package manifests to ready_to_publish after a
 * successful build. Root manifest additionally records build provenance
 * (build_run_id/source_ref/source_sha); package manifest schema does not
 * carry those fields, so it is intentionally excluded from that part.
 *
 * @param {Object} opts
 * @param {string} opts.rootPath - path to root manifest
 * @param {string} opts.packagePath - path to package manifest
 * @param {string} opts.buildRunId - build_run_id to record on root manifest
 * @param {string} opts.sourceRef - source_ref to record on root manifest
 * @param {string} opts.sourceSha - source_sha to record on root manifest
 */
function stageManifestsReadyToPublish({
  rootPath,
  packagePath,
  buildRunId,
  sourceRef,
  sourceSha,
}) {
  if (!rootPath || !packagePath || !buildRunId || !sourceRef || !sourceSha) {
    throw new Error('All parameters (rootPath, packagePath, buildRunId, sourceRef, sourceSha) are required');
  }

  const updatedAt = new Date().toISOString();

  const rootManifest = JSON.parse(fs.readFileSync(rootPath, 'utf8'));
  rootManifest.build_run_id = String(buildRunId);
  rootManifest.source_ref = sourceRef;
  rootManifest.source_sha = sourceSha;
  rootManifest.candidate_state_status = 'ready_to_publish';
  rootManifest.canonical_package_status = 'ready_to_publish';
  rootManifest.public_distribution_status = 'staged_for_publish';
  rootManifest.updated_at = updatedAt;
  fs.writeFileSync(rootPath, `${JSON.stringify(rootManifest, null, 2)}\n`);

  const packageManifest = JSON.parse(fs.readFileSync(packagePath, 'utf8'));
  packageManifest.candidate_state_status = 'ready_to_publish';
  packageManifest.canonical_package_status = 'ready_to_publish';
  packageManifest.public_distribution_status = 'staged_for_publish';
  packageManifest.updated_at = updatedAt;
  fs.writeFileSync(packagePath, `${JSON.stringify(packageManifest, null, 2)}\n`);
}

// CLI interface
if (require.main === module) {
  const repoRoot = path.resolve(__dirname, '..');
  const rootManifestPath = path.join(repoRoot, 'config', 'codex-termux-release-manifest.json');
  const packageManifestPath = path.join(
    repoRoot,
    'packages',
    'codex-termux',
    'config',
    'codex-termux-release-manifest.json'
  );

  function usage() {
    console.error('usage: node scripts/update-codex-candidate-manifest.js <candidate-version> <candidate-state>');
    console.error('       node scripts/update-codex-candidate-manifest.js stage <build-run-id> <source-ref> <source-sha>');
    process.exit(2);
  }

  const firstArg = process.argv[2];

  if (firstArg === 'stage') {
    if (process.argv.length !== 6) {
      usage();
    }
    const buildRunId = process.argv[3];
    const sourceRef = process.argv[4];
    const sourceSha = process.argv[5];
    try {
      stageManifestsReadyToPublish({
        rootPath: rootManifestPath,
        packagePath: packageManifestPath,
        buildRunId,
        sourceRef,
        sourceSha,
      });
    } catch (err) {
      console.error('Error staging manifests:', err.message);
      process.exit(1);
    }
  } else {
    if (process.argv.length !== 4) {
      usage();
    }
    const candidateVersion = process.argv[2];
    const candidateState = process.argv[3];
    try {
      updateManifests({
        rootPath: rootManifestPath,
        packagePath: packageManifestPath,
        candidateVersion,
        candidateState,
      });
    } catch (err) {
      console.error('Error updating manifests:', err.message);
      process.exit(1);
    }
  }
}

module.exports = { updateManifests, stageManifestsReadyToPublish };
