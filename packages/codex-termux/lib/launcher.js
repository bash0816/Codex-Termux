import { spawn, spawnSync } from 'child_process';
import { createRequire } from 'module';
import { existsSync } from 'fs';
import { dirname, join, resolve } from 'path';
import { fileURLToPath } from 'url';

const require = createRequire(import.meta.url);
const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);
const packageDir = resolve(__dirname, '..');
const termuxPrefix = process.env.PREFIX || '/data/data/com.termux/files/usr';
const blockedLdEntries = new Set([
  `${termuxPrefix}/lib`,
  `${termuxPrefix}/libexec`,
  '/data/data/com.termux/files/usr/lib',
  '/data/data/com.termux/files/usr/libexec'
]);

function sanitizeLdLibraryPath(binDir) {
  const extras = (process.env.LD_LIBRARY_PATH || '')
    .split(':')
    .filter((entry) => entry && !blockedLdEntries.has(entry));

  return [binDir, ...extras].join(':');
}

function readPackageRoot(request) {
  try {
    return dirname(require.resolve(request));
  } catch {
    return null;
  }
}

function candidatePaths(entryName) {
  const names = entryName === 'codex-exec'
    ? ['codex-exec.bin', 'codex.bin']
    : ['codex.bin', 'codex-exec.bin'];

  const localBinDir = join(packageDir, 'bin');
  const localCandidates = names.flatMap((name) => [
    join(localBinDir, name),
    join(localBinDir, name.replace(/\.bin$/, ''))
  ]);

  const resolved = [];
  for (const candidate of localCandidates) {
    if (existsSync(candidate)) {
      resolved.push(candidate);
    }
  }

  const directPlatformRoot = readPackageRoot('@openai/codex-linux-arm64/package.json');
  if (directPlatformRoot) {
    for (const name of names) {
      const directCandidates = [
        join(directPlatformRoot, 'bin', name),
        join(directPlatformRoot, 'bin', name.replace(/\.bin$/, ''))
      ];
      for (const candidate of directCandidates) {
        if (existsSync(candidate)) {
          resolved.push(candidate);
        }
      }
    }
  }

  const upstreamRoot = readPackageRoot('@openai/codex/package.json');
  if (upstreamRoot) {
    const nestedPlatformRoot = join(upstreamRoot, 'node_modules', '@openai', 'codex-linux-arm64');
    if (existsSync(nestedPlatformRoot)) {
      for (const name of names) {
        const nestedCandidates = [
          join(nestedPlatformRoot, 'bin', name),
          join(nestedPlatformRoot, 'bin', name.replace(/\.bin$/, ''))
        ];
        for (const candidate of nestedCandidates) {
          if (existsSync(candidate)) {
            resolved.push(candidate);
          }
        }
      }
    }
  }

  return [...new Set(resolved)];
}

function resolveBinaryForExec(entryName) {
  const candidates = candidatePaths(entryName);
  if (entryName === 'codex-exec') {
    return {
      binaryPath: candidates[0] || null,
      execFallback: candidates.find((candidate) => candidate.endsWith('codex.bin')) || null
    };
  }

  return {
    binaryPath: candidates[0] || null,
    execFallback: candidates.find((candidate) => candidate.endsWith('codex-exec.bin')) || null
  };
}

let cachedSubcommands;

function detectSubcommands(binaryPath, env) {
  if (cachedSubcommands !== undefined) {
    return cachedSubcommands;
  }

  const helpResult = spawnSync(binaryPath, ['--help'], {
    encoding: 'utf8',
    env
  });

  if (helpResult.error || helpResult.status !== 0) {
    cachedSubcommands = null;
    return cachedSubcommands;
  }

  const output = `${helpResult.stdout || ''}\n${helpResult.stderr || ''}`;
  const commands = new Set();
  let inCommandsSection = false;

  for (const line of output.split(/\r?\n/)) {
    if (!inCommandsSection) {
      if (/^\s*Commands:\s*$/.test(line)) {
        inCommandsSection = true;
      }
      continue;
    }

    if (/^\s*(Arguments|Options):\s*$/.test(line)) {
      break;
    }

    const commandMatch = line.match(/^\s{2,}([a-z0-9][a-z0-9-]*)\s{2,}/i);
    if (!commandMatch) {
      continue;
    }

    commands.add(commandMatch[1]);

    const aliasesMatch = line.match(/\[aliases?: ([^\]]+)\]/i);
    if (aliasesMatch?.[1]) {
      for (const alias of aliasesMatch[1].split(',')) {
        const cleanAlias = alias.trim();
        if (cleanAlias) {
          commands.add(cleanAlias);
        }
      }
    }
  }

  cachedSubcommands = commands.size > 0 ? commands : null;
  return cachedSubcommands;
}

function buildArgs(entryName, binaryPath, env, argv) {
  if (entryName === 'codex-exec') {
    const hasDedicatedExec = binaryPath && binaryPath.endsWith('codex-exec.bin');
    return hasDedicatedExec ? argv : ['exec', ...argv];
  }

  if (argv.length === 0) {
    return argv;
  }

  const first = argv[0];
  const isOption = first?.startsWith('-');
  const knownSubcommands = detectSubcommands(binaryPath, env);
  const isKnownSubcommand = Boolean(first && knownSubcommands?.has(first));

  return isOption || isKnownSubcommand || knownSubcommands === null
    ? argv
    : ['exec', ...argv];
}

export function runLauncher({ entryName, argv }) {
  const binDir = join(packageDir, 'bin');
  const { binaryPath, execFallback } = resolveBinaryForExec(entryName);
  const targetBinary = binaryPath || execFallback;

  if (!targetBinary) {
    console.error(
      `Unable to resolve a Codex binary for ${entryName}. ` +
      'Stage local Android artifacts or install @openai/codex together with the platform package.'
    );
    process.exit(1);
  }

  const env = {
    ...process.env,
    CODEX_MANAGED_BY_NPM: '1',
    CODEX_SELF_EXE: targetBinary,
    LD_LIBRARY_PATH: sanitizeLdLibraryPath(binDir)
  };

  const child = spawn(targetBinary, buildArgs(entryName, targetBinary, env, argv), {
    env,
    stdio: 'inherit'
  });

  child.on('error', (error) => {
    console.error(error && error.stack ? error.stack : String(error));
    process.exit(1);
  });

  child.on('exit', (code, signal) => {
    if (signal) {
      process.exit(128 + 1);
      return;
    }

    process.exit(code ?? 1);
  });
}
