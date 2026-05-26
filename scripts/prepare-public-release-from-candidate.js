const fs = require('fs');
const path = require('path');

const repoRoot = path.resolve(__dirname, '..');
const manifestPath = path.join(repoRoot, 'config', 'codex-termux-release-manifest.json');

function usage() {
  console.error(
    'usage: node scripts/prepare-public-release-from-candidate.js <candidate-version> <rollback-version>'
  );
  process.exit(2);
}

function readJson(filePath) {
  return JSON.parse(fs.readFileSync(filePath, 'utf8'));
}

function writeJson(filePath, value) {
  fs.writeFileSync(filePath, `${JSON.stringify(value, null, 2)}\n`);
}

function must(condition, message) {
  if (!condition) {
    throw new Error(message);
  }
}

const candidateVersion = process.argv[2];
const rollbackVersion = process.argv[3];

if (!candidateVersion || !rollbackVersion) {
  usage();
}

const manifest = readJson(manifestPath);
must(
  manifest.latest_candidate_version === candidateVersion,
  'candidate-version does not match manifest.latest_candidate_version'
);
must(
  candidateVersion !== rollbackVersion,
  'rollback-version must differ from the candidate version'
);

manifest.latest_audited_version = candidateVersion;
manifest.canonical_package_status = 'ready_to_publish';
manifest.public_distribution_status = 'staged_for_publish';
manifest.support_status = 'public_support_pending_publish';
manifest.rollback_version = rollbackVersion;
manifest.candidate_state_status = 'ready_to_publish';
manifest.updated_at = new Date().toISOString();
manifest.gate_summary =
  `package staged for public publish review; audited version ${candidateVersion} pending publish verification.`;

if (!Array.isArray(manifest.tracked_versions)) {
  manifest.tracked_versions = [];
}
if (!manifest.tracked_versions.includes(candidateVersion)) {
  manifest.tracked_versions.push(candidateVersion);
}

writeJson(manifestPath, manifest);
console.log(
  `prepared public release manifest for ${candidateVersion} with rollback ${rollbackVersion}`
);
