#!/usr/bin/env node

import { runLauncher } from '../lib/launcher.js';

runLauncher({
  entryName: 'codex',
  argv: process.argv.slice(2)
});
