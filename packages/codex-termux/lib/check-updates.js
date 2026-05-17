#!/usr/bin/env node

import { spawnSync } from 'child_process';
import { readFileSync } from 'fs';
import { dirname, join, resolve } from 'path';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);
const packageDir = resolve(__dirname, '..');
const pkg = JSON.parse(readFileSync(join(packageDir, 'package.json'), 'utf8'));
const mode = process.argv[2] || 'update';
const dryRun = process.argv.includes('--dry-run');

function installLatestPublished() {
  const spec = `${pkg.name}@latest`;
  const command = `npm install -g ${spec}`;

  if (dryRun) {
    console.log(command);
    return 0;
  }

  console.error(`Updating ${pkg.name} via npm-managed flow`);
  const result = spawnSync('npm', ['install', '-g', spec], {
    stdio: 'inherit',
    env: process.env,
  });
  return result.status === null ? 1 : result.status;
}

function run() {
  if (mode !== 'update') {
    throw new Error(`Unknown mode: ${mode}`);
  }

  process.exitCode = installLatestPublished();
}

try {
  run();
} catch (error) {
  console.error(error && error.stack ? error.stack : String(error));
  process.exit(1);
}
