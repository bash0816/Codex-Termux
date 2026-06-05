import { spawn, spawnSync } from 'child_process';
import { createRequire } from 'module';
import { existsSync, readdirSync, statSync, rmSync } from 'fs';
import { constants as osConstants, homedir } from 'os';
import { dirname, join, resolve } from 'path';
import { fileURLToPath } from 'url';

const require = createRequire(import.meta.url);
const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);
const packageDir = resolve(__dirname, '..');
const termuxPrefix = process.env.PREFIX || '/data/data/com.termux/files/usr';
const STALE_ARG0_WARNING =
  'WARNING: failed to clean up stale arg0 temp dirs: try_lock() not supported';
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

function shouldSuppressStderrLine(line) {
  return line.trimEnd() === STALE_ARG0_WARNING;
}

// Lines in `codex doctor` stdout that reference @openai/codex update paths
// are misleading on Termux — users must update via @bash0816/codex-termux.
const DOCTOR_SUPPRESS_PATTERNS = [
  /0\.\d+\.\d+ available \(current/,
  /@openai\/codex/,
  /CODEX_MANAGED_PACKAGE_ROOT/,
  /npm-managed launch is missing package-root provenance/,
  /npm update target could not be proven/,
  /update would target a different npm install/,
  /npm install -g @openai\/codex would update a different install/,
];

function shouldSuppressDoctorLine(line) {
  const stripped = line.replace(/\x1b\[[0-9;]*m/g, '');
  return DOCTOR_SUPPRESS_PATTERNS.some(p => p.test(stripped));
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

function cleanupStaleArg0Dirs() {
  const codexHome = process.env.CODEX_HOME || join(homedir(), '.codex');
  const arg0Root = join(codexHome, 'tmp', 'arg0');
  const TTL_MS = 7 * 24 * 60 * 60 * 1000; // 7 days (conservative: avoids killing long-running sessions)

  try {
    const entries = readdirSync(arg0Root, { withFileTypes: true });
    const now = Date.now();
    for (const entry of entries) {
      if (!entry.isDirectory() || !entry.name.startsWith("codex-arg0-")) continue;
      const dirPath = join(arg0Root, entry.name);
      try {
        const st = statSync(dirPath);
        if (now - st.mtimeMs > TTL_MS) {
          rmSync(dirPath, { recursive: true, force: true });
        }
      } catch {
        // TOCTOU: directory may have disappeared; ignore
      }
    }
  } catch {
    // arg0Root does not exist yet; ignore
  }
}

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
  cleanupStaleArg0Dirs();
  const { binaryPath, execFallback } = resolveBinaryForExec(entryName);
  const targetBinary = binaryPath || execFallback;

  if (!targetBinary) {
    console.error(
      `Unable to resolve a Codex binary for ${entryName}. ` +
      'Install @openai/codex together with the Android platform package, or stage local codex.bin artifacts.'
    );
    process.exit(1);
  }

  const env = {
    ...process.env,
    CODEX_MANAGED_BY_NPM: '1',
    CODEX_SELF_EXE: targetBinary,
    LD_LIBRARY_PATH: sanitizeLdLibraryPath(binDir)
  };

  const termuxOverrideArgs = ['-c', 'check_for_update_on_startup=false'];
  const isDoctor = entryName !== 'codex-exec' && argv[0] === 'doctor';
  const child = spawn(targetBinary, [...termuxOverrideArgs, ...buildArgs(entryName, targetBinary, env, argv)], {
    env,
    stdio: ['inherit', isDoctor ? 'pipe' : 'inherit', 'pipe']
  });

  let stdoutBuffer = '';
  let stderrBuffer = '';

  if (isDoctor && child.stdout) {
    child.stdout.on('data', (chunk) => {
      stdoutBuffer += chunk.toString();
      const lines = stdoutBuffer.split('\n');
      stdoutBuffer = lines.pop() ?? '';
      for (const line of lines) {
        if (!shouldSuppressDoctorLine(line)) {
          process.stdout.write(`${line}\n`);
        }
      }
    });
  }

  child.stderr.on('data', (chunk) => {
    stderrBuffer += chunk.toString();
    const lines = stderrBuffer.split('\n');
    stderrBuffer = lines.pop() ?? '';

    for (const line of lines) {
      if (!shouldSuppressStderrLine(line)) {
        process.stderr.write(`${line}\n`);
      }
    }
  });

  child.on('error', (error) => {
    console.error(error && error.stack ? error.stack : String(error));
    process.exit(1);
  });

  child.on('close', (code, signal) => {
    if (isDoctor) {
      if (stdoutBuffer && !shouldSuppressDoctorLine(stdoutBuffer)) {
        process.stdout.write(stdoutBuffer);
      }
      process.stdout.write(
        '\nNote: On Termux, update via: npm install -g @bash0816/codex-termux@latest\n'
      );
    }
    if (stderrBuffer && !shouldSuppressStderrLine(stderrBuffer)) {
      process.stderr.write(stderrBuffer);
    }
    if (signal) {
      process.exit(128 + (osConstants.signals[signal] ?? 1));
      return;
    }

    process.exit(code ?? 1);
  });
}
