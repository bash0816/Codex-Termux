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
    process.exit(2);
  }

  const candidateVersion = process.argv[2];
  const candidateState = process.argv[3];

  if (!candidateVersion || !candidateState) {
    usage();
  }

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

module.exports = { updateManifests };
