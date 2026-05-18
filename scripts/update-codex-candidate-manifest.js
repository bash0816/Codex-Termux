const fs = require('fs');
const path = require('path');

const repoRoot = path.resolve(__dirname, '..');
const manifestPath = path.join(repoRoot, 'config', 'codex-termux-release-manifest.json');

function usage() {
  console.error('usage: node scripts/update-codex-candidate-manifest.js <candidate-version> <candidate-state>');
  process.exit(2);
}

const candidateVersion = process.argv[2];
const candidateState = process.argv[3];

if (!candidateVersion || !candidateState) {
  usage();
}

const manifest = JSON.parse(fs.readFileSync(manifestPath, 'utf8'));
manifest.latest_candidate_version = candidateVersion;
manifest.candidate_state_status = candidateState;
manifest.updated_at = new Date().toISOString();

fs.writeFileSync(manifestPath, `${JSON.stringify(manifest, null, 2)}\n`);

