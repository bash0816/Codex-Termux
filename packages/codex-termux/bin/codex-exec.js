#!/usr/bin/env node

import { runLauncher } from '../lib/launcher.js';

runLauncher({
  entryName: 'codex-exec',
  argv: process.argv.slice(2)
});
