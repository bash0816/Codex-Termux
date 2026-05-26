#!/usr/bin/env node
import { resolve, dirname } from 'path';
import { fileURLToPath } from 'url';
import { spawnSync } from 'child_process';
import { runLauncher } from '../lib/launcher.js';

const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);
const packageDir = resolve(__dirname, '..');

if (process.argv[2] === 'update') {
  const helper = resolve(packageDir, 'lib/check-updates.js');
  const result = spawnSync(process.execPath, [helper, 'update', ...process.argv.slice(3)], {
    stdio: 'inherit',
    env: process.env,
  });
  process.exit(result.status ?? 1);
} else {
  runLauncher({
    entryName: 'codex',
    argv: process.argv.slice(2),
  });
}
