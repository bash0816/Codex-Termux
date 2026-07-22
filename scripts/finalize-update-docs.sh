#!/usr/bin/env bash
set -eu

: "${VER:?VER environment variable must be set}"

CANDIDATE_VER=$(node -p "JSON.parse(require('fs').readFileSync('config/codex-termux-release-manifest.json','utf8')).latest_candidate_version")
if [ "$CANDIDATE_VER" != "$VER" ]; then
  echo "ERROR: finalize target ($VER) does not match manifest latest_candidate_version ($CANDIDATE_VER)" >&2
  exit 1
fi

node scripts/finalize-audited-version.js config/codex-termux-release-manifest.json "$VER"

node scripts/sync-public-release-from-manifest.js
node scripts/sync-public-release-from-manifest.js --check

echo "finalize-update-docs.sh: manifest updated and public release files regenerated for ${VER}"
