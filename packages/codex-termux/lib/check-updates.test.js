import { test } from 'node:test';
import assert from 'node:assert';
import { mkdtempSync, mkdirSync, rmSync, cpSync, writeFileSync, readFileSync, chmodSync } from 'fs';
import { spawnSync } from 'child_process';
import path, { resolve, join } from 'path';
import os from 'os';
import { fileURLToPath } from 'url';
import { dirname } from 'path';

const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);
const packageDir = resolve(__dirname, '..');
const repoRoot = resolve(packageDir, '..', '..', '..');

const manifestPath = join(packageDir, 'config', 'codex-termux-release-manifest.json');
const manifest = JSON.parse(readFileSync(manifestPath, 'utf8'));
const latestAuditedVersion = manifest.latest_audited_version;
const testVersion = '0.144.4'; // Older version for testing

test('installTarget with prefixA uses correct --prefix', async (t) => {
  const tmpdir = mkdtempSync(join(os.tmpdir(), 'codex-prefix-test-'));
  try {
    const prefixA = join(tmpdir, 'prefixA');
    const prefixANodeModules = join(prefixA, 'lib', 'node_modules', '@bash0816', 'codex-termux');
    const fakeNpmDir = join(tmpdir, 'fake-bin');
    const recordFileA = join(tmpdir, 'npm-args-a.json');

    // Create directory structure for prefixA
    cpSync(packageDir, prefixANodeModules, { recursive: true });

    // Update package.json version to old version
    const pkgJsonPath = join(prefixANodeModules, 'package.json');
    const pkg = JSON.parse(readFileSync(pkgJsonPath, 'utf8'));
    pkg.version = testVersion;
    writeFileSync(pkgJsonPath, JSON.stringify(pkg, null, 2) + '\n');

    // Create fake npm binary
    mkdirSync(fakeNpmDir, { recursive: true });
    const fakeNpmPath = join(fakeNpmDir, 'npm');
    writeFileSync(
      fakeNpmPath,
      `#!/usr/bin/env node
const fs = require('fs');
fs.writeFileSync(process.env.FAKE_NPM_RECORD_FILE, JSON.stringify(process.argv.slice(2)));
process.exit(0);
`
    );
    chmodSync(fakeNpmPath, 0o755);

    // Run check-updates.js from prefixA
    const result = spawnSync('node', [join(prefixANodeModules, 'lib', 'check-updates.js'), 'update'], {
      env: {
        ...process.env,
        PATH: `${fakeNpmDir}:${process.env.PATH}`,
        CODEX_TERMUX_SKIP_UPDATE_CHECK: '1',
        FAKE_NPM_RECORD_FILE: recordFileA,
      },
      stdio: 'pipe',
    });

    // Check recorded npm arguments
    const recordedArgs = JSON.parse(readFileSync(recordFileA, 'utf8'));
    const expectedArgs = ['install', '-g', '--prefix', prefixA, `@bash0816/codex-termux@${latestAuditedVersion}`];
    assert.deepStrictEqual(recordedArgs, expectedArgs, `Expected ${JSON.stringify(expectedArgs)} but got ${JSON.stringify(recordedArgs)}`);
  } finally {
    rmSync(tmpdir, { recursive: true, force: true });
  }
});

test('installTarget with prefixB uses correct --prefix', async (t) => {
  const tmpdir = mkdtempSync(join(os.tmpdir(), 'codex-prefix-test-'));
  try {
    const prefixB = join(tmpdir, 'prefixB');
    const prefixBNodeModules = join(prefixB, 'lib', 'node_modules', '@bash0816', 'codex-termux');
    const fakeNpmDir = join(tmpdir, 'fake-bin');
    const recordFileB = join(tmpdir, 'npm-args-b.json');

    // Create directory structure for prefixB
    cpSync(packageDir, prefixBNodeModules, { recursive: true });

    // Update package.json version to old version
    const pkgJsonPath = join(prefixBNodeModules, 'package.json');
    const pkg = JSON.parse(readFileSync(pkgJsonPath, 'utf8'));
    pkg.version = testVersion;
    writeFileSync(pkgJsonPath, JSON.stringify(pkg, null, 2) + '\n');

    // Create fake npm binary
    mkdirSync(fakeNpmDir, { recursive: true });
    const fakeNpmPath = join(fakeNpmDir, 'npm');
    writeFileSync(
      fakeNpmPath,
      `#!/usr/bin/env node
const fs = require('fs');
fs.writeFileSync(process.env.FAKE_NPM_RECORD_FILE, JSON.stringify(process.argv.slice(2)));
process.exit(0);
`
    );
    chmodSync(fakeNpmPath, 0o755);

    // Run check-updates.js from prefixB
    const result = spawnSync('node', [join(prefixBNodeModules, 'lib', 'check-updates.js'), 'update'], {
      env: {
        ...process.env,
        PATH: `${fakeNpmDir}:${process.env.PATH}`,
        CODEX_TERMUX_SKIP_UPDATE_CHECK: '1',
        FAKE_NPM_RECORD_FILE: recordFileB,
      },
      stdio: 'pipe',
    });

    // Check recorded npm arguments
    const recordedArgs = JSON.parse(readFileSync(recordFileB, 'utf8'));
    const expectedArgs = ['install', '-g', '--prefix', prefixB, `@bash0816/codex-termux@${latestAuditedVersion}`];
    assert.deepStrictEqual(recordedArgs, expectedArgs, `Expected ${JSON.stringify(expectedArgs)} but got ${JSON.stringify(recordedArgs)}`);
  } finally {
    rmSync(tmpdir, { recursive: true, force: true });
  }
});
