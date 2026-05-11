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
must(manifest.canonical_package_status === 'prepared_not_published', 'manifest package status drift');
must(manifest.support_status === 'prepared_release_candidate_not_public_supported', 'manifest support status drift');
must(manifest.latest_audited_version === '0.130.0', 'manifest tracked version drift');
must(Array.isArray(manifest.tracked_versions) && manifest.tracked_versions.includes('0.130.0'), 'manifest tracked versions drift');
must(Array.isArray(manifest.historical_baselines) && manifest.historical_baselines.includes('0.128.0'), 'manifest historical baseline drift');
must(manifest.planned_wrapper_package?.name === pkg.name, 'planned wrapper package drift');
must(packageReadme.includes('@bash0816/codex-termux'), 'package README missing package name');
must(packageReadme.includes('withheld package-prep'), 'package README missing withheld wording');
must(!packageReadme.includes('@mmmbuto'), 'package README leaked private handle');
must(!packageReadme.includes('Codex-Termux-Private'), 'package README leaked private repo name');
must(rootReadme.includes('Public release preparation is in progress.'), 'root README missing release prep wording');
must(rootReadme.includes('package is not published yet'), 'root README missing package unpublished wording');
must(rootReadme.includes('Public support remains withheld.'), 'root README missing withheld wording');
must(rootReadme.includes('0.130.0'), 'root README missing tracked version');
must(rootReadme.includes('packages/codex-termux'), 'root README missing package path');
must(guidance.includes('this repository is public'), 'guidance missing repo public wording');
must(guidance.includes('package is not published yet'), 'guidance missing package unpublished wording');
must(guidance.includes('public support remains withheld'), 'guidance missing withheld wording');
must(guidance.includes('@bash0816/codex-termux'), 'guidance missing package name');
must(guidance.includes('0.130.0'), 'guidance missing tracked version');
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
