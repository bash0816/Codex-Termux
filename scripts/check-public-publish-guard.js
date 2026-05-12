const fs = require('fs');
const path = require('path');

const repoRoot = path.resolve(__dirname, '..');
const manifestPath = path.join(repoRoot, 'config', 'codex-termux-release-manifest.json');
const packageJsonPath = path.join(repoRoot, 'packages', 'codex-termux', 'package.json');
const packageBinDir = path.join(repoRoot, 'packages', 'codex-termux', 'bin');
const skipRuntimeFiles = process.argv.includes('--skip-runtime-files');

function readJson(filePath) {
  return JSON.parse(fs.readFileSync(filePath, 'utf8'));
}

function must(condition, message) {
  if (!condition) {
    throw new Error(message);
  }
}

const manifest = readJson(manifestPath);
const pkg = readJson(packageJsonPath);
const requiredRuntimeFiles = ['codex.bin', 'codex-exec.bin', 'libc++_shared.so'];

must(pkg.name === '@bash0816/codex-termux', 'unexpected package name');
must(manifest.canonical_package_name === pkg.name, 'manifest/package name drift');
must(
  manifest.public_distribution_status !== 'withheld',
  'public_distribution_status is withheld'
);
must(
  manifest.canonical_package_status === 'ready_to_publish',
  'canonical_package_status is not ready_to_publish'
);

if (!skipRuntimeFiles) {
  for (const fileName of requiredRuntimeFiles) {
    must(
      fs.existsSync(path.join(packageBinDir, fileName)),
      `missing staged runtime file: ${fileName}`
    );
  }
}

console.log('public publish guard checks passed');
