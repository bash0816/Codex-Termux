const fs = require('fs');

function computeFinalizedManifest(manifest, version) {
  const previousAudited = manifest.latest_audited_version;
  const isVersionBump = previousAudited && previousAudited !== version;

  if (isVersionBump) {
    if (!manifest.previous_stable_version) {
      throw new Error(
        `previous_stable_version is missing in manifest; cannot safely finalize ${version} ` +
        `(expected it to equal the current latest_audited_version ${previousAudited})`
      );
    }
    if (previousAudited !== manifest.previous_stable_version) {
      throw new Error(
        `latest_audited_version (${previousAudited}) does not match previous_stable_version ` +
        `(${manifest.previous_stable_version}); fix config/codex-termux-release-manifest.json ` +
        `before finalizing ${version}`
      );
    }
  }

  const updated = { ...manifest };
  updated.canonical_package_status = 'published';
  updated.public_distribution_status = 'published';
  if (isVersionBump) {
    updated.rollback_version = previousAudited;
  }
  updated.latest_audited_version = version;
  const tracked = Array.isArray(manifest.tracked_versions) ? manifest.tracked_versions : [];
  updated.tracked_versions = tracked.includes(version) ? tracked : [...tracked, version];
  updated.updated_at = new Date().toISOString();
  return updated;
}

function finalizeAuditedVersion(manifestPath, version) {
  const manifest = JSON.parse(fs.readFileSync(manifestPath, 'utf8'));
  const updated = computeFinalizedManifest(manifest, version);
  fs.writeFileSync(manifestPath, `${JSON.stringify(updated, null, 2)}\n`);
  return updated;
}

module.exports = { computeFinalizedManifest, finalizeAuditedVersion };

if (require.main === module) {
  const manifestPath = process.argv[2];
  const version = process.argv[3];
  if (!manifestPath || !version) {
    console.error('usage: node scripts/finalize-audited-version.js <manifest-path> <version>');
    process.exit(1);
  }
  finalizeAuditedVersion(manifestPath, version);
}
