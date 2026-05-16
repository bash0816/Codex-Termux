const fs = require('fs');
const path = require('path');

const repoRoot = path.resolve(__dirname, '..');
const packageRoot = path.join(repoRoot, 'packages', 'codex-termux');
const manifestPath = path.join(repoRoot, 'config', 'codex-termux-release-manifest.json');
const packageJsonPath = path.join(packageRoot, 'package.json');
const packageReadmePath = path.join(packageRoot, 'README.md');
const rootReadmePath = path.join(repoRoot, 'README.md');
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
const rootReadme = fs.readFileSync(rootReadmePath, 'utf8');
const guidance = fs.readFileSync(guidancePath, 'utf8');

must(pkg.name === '@bash0816/codex-termux', 'package name drift');
must(pkg.version === '0.130.0', 'package version drift');
must(manifest.canonical_package_name === pkg.name, 'manifest/package name drift');
must(manifest.canonical_package_status === 'published', 'manifest package status drift');
must(manifest.support_status === 'public_supported', 'manifest support status drift');
must(manifest.latest_audited_version === '0.130.0', 'manifest tracked version drift');
must(Array.isArray(manifest.tracked_versions) && manifest.tracked_versions.includes('0.130.0'), 'manifest tracked versions drift');
must(Array.isArray(manifest.historical_baselines) && manifest.historical_baselines.includes('0.128.0'), 'manifest historical baseline drift');
must(manifest.planned_wrapper_package?.name === pkg.name, 'planned wrapper package drift');
must(packageReadme.includes('@bash0816/codex-termux'), 'package README missing package name');
must(packageReadme.includes('published package'), 'package README missing published wording');
must(!packageReadme.includes('@mmmbuto'), 'package README leaked private handle');
must(!packageReadme.includes('private-repo'), 'package README leaked private repo name');
must(rootReadme.includes('Public package release is live.'), 'root README missing live wording');
must(rootReadme.includes('package is published'), 'root README missing package published wording');
must(rootReadme.includes('Public support is available for the published package.'), 'root README missing support wording');
must(rootReadme.includes('0.130.0'), 'root README missing tracked version');
must(rootReadme.includes('packages/codex-termux'), 'root README missing package path');
must(rootReadme.includes('npm install -g @bash0816/codex-termux@latest'), 'root README missing install guidance');
must(rootReadme.includes('npm install -g @bash0816/codex-termux@0.130.0'), 'root README missing rollback guidance');
must(guidance.includes('this repository is public'), 'guidance missing repo public wording');
must(guidance.includes('the package is published'), 'guidance missing package published wording');
must(guidance.includes('public support is available'), 'guidance missing support wording');
must(guidance.includes('@bash0816/codex-termux'), 'guidance missing package name');
must(guidance.includes('0.130.0'), 'guidance missing tracked version');
must(guidance.includes('npm install -g @bash0816/codex-termux@latest'), 'guidance missing install guidance');
must(guidance.includes('npm install -g @bash0816/codex-termux@0.130.0'), 'guidance missing rollback guidance');
must(fs.readFileSync(path.join(repoRoot, 'scripts', 'stage-public-android-runtime.sh'), 'utf8').includes('--source-sha'), 'stage helper missing source provenance flags');
must(fs.readFileSync(path.join(repoRoot, 'scripts', 'stage-public-android-runtime.sh'), 'utf8').includes('sha256sums.txt'), 'stage helper missing checksum verification');
must(fs.readFileSync(path.join(repoRoot, 'scripts', 'stage-public-android-runtime.sh'), 'utf8').includes('pre-existing staged file'), 'stage helper missing pre-state guard');

const expectedBins = ['codex-termux', 'codex', 'codex-exec'];
for (const binName of expectedBins) {
  must(Object.prototype.hasOwnProperty.call(pkg.bin || {}, binName), `missing bin entry: ${binName}`);
}

const expectedFiles = ['README.md', 'bin/', 'lib/'];
for (const fileName of expectedFiles) {
  must((pkg.files || []).includes(fileName), `missing files entry: ${fileName}`);
}

console.log('public release skeleton checks passed');
