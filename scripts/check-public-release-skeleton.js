const fs = require('fs');
const path = require('path');

const repoRoot = path.resolve(__dirname, '..');
const packageRoot = path.join(repoRoot, 'packages', 'codex-termux');
const manifestPath = path.join(repoRoot, 'config', 'codex-termux-release-manifest.json');
const packageJsonPath = path.join(packageRoot, 'package.json');
const packageReadmePath = path.join(packageRoot, 'README.md');
const guidancePath = path.join(repoRoot, 'docs', '20260503_codex-termux-release-guidance.md');

function readJson(filePath) {
  return JSON.parse(fs.readFileSync(filePath, 'utf8'));
}

function must(cond, message) {
  if (!cond) {
    throw new Error(message);
  }
}

const manifest = readJson(manifestPath);
const pkg = readJson(packageJsonPath);
const packageReadme = fs.readFileSync(packageReadmePath, 'utf8');

// Package identity checks
must(pkg.name === '@bash0816/codex-termux', 'package name drift');
must(typeof pkg.version === 'string' && /^\d+\.\d+\.\d+/.test(pkg.version), 'package version invalid format');

// Manifest / package consistency
must(manifest.canonical_package_name === pkg.name, 'manifest/package name drift');
must(typeof manifest.canonical_package_status === 'string', 'manifest package status missing');
must(typeof manifest.support_status === 'string', 'manifest support status missing');
must(typeof manifest.latest_audited_version === 'string', 'manifest audited version missing');
must(typeof manifest.latest_candidate_version === 'string', 'manifest candidate version missing');
must(typeof manifest.candidate_state_status === 'string', 'manifest candidate state missing');
must(manifest.latest_candidate_version === pkg.version, 'manifest candidate version does not match package.json');
must(Array.isArray(manifest.tracked_versions), 'manifest tracked versions missing');
must(Array.isArray(manifest.historical_baselines), 'manifest historical baselines missing');
must(manifest.planned_wrapper_package?.name === pkg.name, 'planned wrapper package drift');

// Package README: no leaked private info
must(packageReadme.includes('@bash0816/codex-termux'), 'package README missing package name');
must(!packageReadme.includes('@mmmbuto'), 'package README leaked private handle');
must(!packageReadme.includes('private-repo'), 'package README leaked private repo name');

// Guidance doc: existence and basic content (optional — checked only if file exists)
if (fs.existsSync(guidancePath)) {
  const guidance = fs.readFileSync(guidancePath, 'utf8');
  must(guidance.includes('@bash0816/codex-termux'), 'guidance missing package name');
  must(!guidance.includes('@mmmbuto'), 'guidance leaked private handle');
  must(!guidance.includes('private-repo'), 'guidance leaked private repo name');
}

// Stage helper integrity
must(fs.readFileSync(path.join(repoRoot, 'scripts', 'stage-public-android-runtime.sh'), 'utf8').includes('--source-sha'), 'stage helper missing source provenance flags');
must(fs.readFileSync(path.join(repoRoot, 'scripts', 'stage-public-android-runtime.sh'), 'utf8').includes('sha256sums.txt'), 'stage helper missing checksum verification');
must(fs.readFileSync(path.join(repoRoot, 'scripts', 'stage-public-android-runtime.sh'), 'utf8').includes('pre-existing staged file'), 'stage helper missing pre-state guard');

// Package structure
const expectedBins = ['codex-termux', 'codex', 'codex-exec'];
for (const binName of expectedBins) {
  must(Object.prototype.hasOwnProperty.call(pkg.bin || {}, binName), `missing bin entry: ${binName}`);
}

const expectedFiles = ['README.md', 'bin/', 'lib/'];
for (const fileName of expectedFiles) {
  must((pkg.files || []).includes(fileName), `missing files entry: ${fileName}`);
}

console.log('public release skeleton checks passed');
