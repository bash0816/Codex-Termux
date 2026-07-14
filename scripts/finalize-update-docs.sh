#!/usr/bin/env bash
set -eu

: "${VER:?VER environment variable must be set}"

CANDIDATE_VER=$(node -p "JSON.parse(require('fs').readFileSync('config/codex-termux-release-manifest.json','utf8')).latest_candidate_version")
if [ "$CANDIDATE_VER" != "$VER" ]; then
  echo "ERROR: finalize target ($VER) does not match manifest latest_candidate_version ($CANDIDATE_VER)" >&2
  exit 1
fi

node -e "
  const fs = require('fs');
  const p = 'config/codex-termux-release-manifest.json';
  const m = JSON.parse(fs.readFileSync(p, 'utf8'));
  m.canonical_package_status = 'published';
  m.public_distribution_status = 'published';
  m.latest_audited_version = process.env.VER;
  if (!m.tracked_versions.includes(process.env.VER)) {
    m.tracked_versions.push(process.env.VER);
  }
  m.updated_at = new Date().toISOString();
  fs.writeFileSync(p, JSON.stringify(m, null, 2) + '\n');
"

node scripts/sync-public-release-from-manifest.js
node scripts/sync-public-release-from-manifest.js --check

echo "finalize-update-docs.sh: manifest updated and public release files regenerated for ${VER}"
