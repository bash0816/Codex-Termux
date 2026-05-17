#!/usr/bin/env node

import { dirname, resolve } from 'path';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);

if (process.argv[2] === 'update') {
  const helper = resolve(__dirname, '../lib/check-updates.js');
  const args = ['update', ...process.argv.slice(3)];
  const { default: processModule } = await import('process');
  const { spawnSync } = await import('child_process');
  const result = spawnSync(processModule.execPath, [helper, ...args], {
    stdio: 'inherit',
    env: processModule.env,
  });
  process.exit(result.status === null ? 1 : result.status);
}

import { runLauncher } from '../lib/launcher.js';

runLauncher({
  entryName: 'codex',
  argv: process.argv.slice(2)
});
