import { test } from 'node:test';
import { strict as assert } from 'assert';
import fs from 'fs';
import path from 'path';
import { execSync } from 'child_process';
import { fileURLToPath } from 'url';

const __dirname = path.dirname(fileURLToPath(import.meta.url));

const CODEX_LAUNCHER = path.join(__dirname, 'codex');
const CODEX_EXEC_LAUNCHER = path.join(__dirname, 'codex-exec');

test('bin/codex: syntax check', () => {
  const result = execSync(`sh -n "${CODEX_LAUNCHER}"`, {
    encoding: 'utf8',
    stdio: ['pipe', 'pipe', 'pipe'],
  });
  // sh -n produces no output on success
});

test('bin/codex-exec: syntax check', () => {
  const result = execSync(`sh -n "${CODEX_EXEC_LAUNCHER}"`, {
    encoding: 'utf8',
    stdio: ['pipe', 'pipe', 'pipe'],
  });
  // sh -n produces no output on success
});

test('bin/codex: contains MAGI_NODE validation logic', () => {
  const content = fs.readFileSync(CODEX_LAUNCHER, 'utf8');
  assert.match(content, /MAGI_NODE/, 'codex should reference MAGI_NODE');
  assert.match(content, /exit 126/, 'codex should exit 126 on invalid MAGI_NODE');
  assert.match(content, /MAGI_NODE is not an executable file/, 'codex should have descriptive error message');
});

test('bin/codex-exec: contains MAGI_NODE validation logic', () => {
  const content = fs.readFileSync(CODEX_EXEC_LAUNCHER, 'utf8');
  assert.match(content, /MAGI_NODE/, 'codex-exec should reference MAGI_NODE');
  assert.match(content, /exit 126/, 'codex-exec should exit 126 on invalid MAGI_NODE');
  assert.match(content, /MAGI_NODE is not an executable file/, 'codex-exec should have descriptive error message');
});

test('bin/codex: resolves symlinks', () => {
  const content = fs.readFileSync(CODEX_LAUNCHER, 'utf8');
  assert.match(content, /while \[ -L/, 'codex should contain symlink resolution logic');
  assert.match(content, /readlink/, 'codex should use readlink to resolve symlinks');
});

test('bin/codex-exec: resolves symlinks', () => {
  const content = fs.readFileSync(CODEX_EXEC_LAUNCHER, 'utf8');
  assert.match(content, /while \[ -L/, 'codex-exec should contain symlink resolution logic');
  assert.match(content, /readlink/, 'codex-exec should use readlink to resolve symlinks');
});

test('bin/codex: defaults to "node" when MAGI_NODE is unset', () => {
  const content = fs.readFileSync(CODEX_LAUNCHER, 'utf8');
  assert.match(content, /NODE=node/, 'codex should default NODE to "node" when MAGI_NODE is unset');
});

test('bin/codex-exec: defaults to "node" when MAGI_NODE is unset', () => {
  const content = fs.readFileSync(CODEX_EXEC_LAUNCHER, 'utf8');
  assert.match(content, /NODE=node/, 'codex-exec should default NODE to "node" when MAGI_NODE is unset');
});

test('bin/codex: launches codex.js', () => {
  const content = fs.readFileSync(CODEX_LAUNCHER, 'utf8');
  assert.match(content, /bin\/codex\.js/, 'codex should invoke bin/codex.js');
});

test('bin/codex-exec: launches codex-exec.js', () => {
  const content = fs.readFileSync(CODEX_EXEC_LAUNCHER, 'utf8');
  assert.match(content, /bin\/codex-exec\.js/, 'codex-exec should invoke bin/codex-exec.js');
});
