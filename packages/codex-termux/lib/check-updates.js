#!/usr/bin/env node
import { existsSync, mkdirSync, readFileSync, writeFileSync } from 'fs';
import { homedir } from 'os';
import { join, resolve, dirname } from 'path';
import { fileURLToPath } from 'url';
import { spawnSync } from 'child_process';
import https from 'https';

const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);
const packageDir = resolve(__dirname, '..');

const pkg = JSON.parse(readFileSync(join(packageDir, 'package.json'), 'utf8'));
const localManifest = JSON.parse(
  readFileSync(join(packageDir, 'config', 'codex-termux-release-manifest.json'), 'utf8')
);

const mode = process.argv[2] || 'notify';
const currentVersion = process.argv[3] || pkg.version;
const dryRun = process.argv.includes('--dry-run');
const cacheRoot =
  process.env.CODEX_TERMUX_PACKAGE_CACHE ||
  join(homedir(), '.codex-termux-native-package');
const cacheFile = join(cacheRoot, 'update-check.json');
const timeoutMs = Number(process.env.CODEX_TERMUX_UPDATE_TIMEOUT_MS || '1200');
const ttlMs = Number(
  process.env.CODEX_TERMUX_UPDATE_CACHE_TTL_MS || String(24 * 60 * 60 * 1000)
);
const skipCheck = process.env.CODEX_TERMUX_SKIP_UPDATE_CHECK === '1';
const manifestUrl =
  process.env.CODEX_TERMUX_MANIFEST_URL || localManifest.manifest_url;

function compareVersions(a, b) {
  const parseVer = v => {
    const str = String(v);
    const dashIdx = str.indexOf('-');
    if (dashIdx === -1) {
      return { parts: str.split('.').map(Number), pre: -1 };
    }
    const pre = Number(str.slice(dashIdx + 1));
    return { parts: str.slice(0, dashIdx).split('.').map(Number), pre: isNaN(pre) ? 0 : pre };
  };
  const av = parseVer(a);
  const bv = parseVer(b);
  const len = Math.max(av.parts.length, bv.parts.length);
  for (let i = 0; i < len; i++) {
    const diff = (av.parts[i] || 0) - (bv.parts[i] || 0);
    if (diff !== 0) return diff;
  }
  return av.pre - bv.pre;
}

function readCache() {
  try {
    return JSON.parse(readFileSync(cacheFile, 'utf8'));
  } catch {
    return {};
  }
}

function writeCache(cache) {
  mkdirSync(dirname(cacheFile), { recursive: true });
  writeFileSync(cacheFile, JSON.stringify(cache, null, 2) + '\n');
}

function fetchManifest(url) {
  return new Promise((resolve, reject) => {
    const req = https.get(url, { timeout: timeoutMs }, (response) => {
      if (response.statusCode !== 200) {
        response.resume();
        reject(new Error(`manifest fetch failed: HTTP ${response.statusCode}`));
        return;
      }
      let body = '';
      response.setEncoding('utf8');
      response.on('data', (chunk) => { body += chunk; });
      response.on('end', () => {
        try { resolve(JSON.parse(body)); } catch (err) { reject(err); }
      });
    });
    req.on('timeout', () => { req.destroy(new Error('manifest fetch timeout')); });
    req.on('error', reject);
  });
}

async function resolveManifest(forceRefresh) {
  if (skipCheck) {
    return { manifest: localManifest, cache: readCache() };
  }
  const cache = readCache();
  const now = Date.now();
  if (!forceRefresh && cache.manifest && cache.fetched_at && now - cache.fetched_at < ttlMs) {
    return { manifest: cache.manifest, cache };
  }
  try {
    const manifest = await fetchManifest(manifestUrl);
    const nextCache = { ...cache, fetched_at: now, manifest };
    writeCache(nextCache);
    return { manifest, cache: nextCache };
  } catch {
    if (cache.manifest) return { manifest: cache.manifest, cache };
    return { manifest: localManifest, cache };
  }
}

function updateNoticeCache(cache, latestVersion) {
  const nextCache = {
    ...cache,
    last_notice: {
      current_version: currentVersion,
      latest_audited_version: latestVersion,
      notified_at: Date.now(),
    },
  };
  writeCache(nextCache);
}

function shouldNotify(cache, latestVersion) {
  const lastNotice = cache.last_notice;
  if (!lastNotice) return true;
  if (lastNotice.current_version !== currentVersion) return true;
  if (lastNotice.latest_audited_version !== latestVersion) return true;
  return Date.now() - Number(lastNotice.notified_at || 0) >= ttlMs;
}

function installTarget(targetVersion) {
  const spec = `${pkg.name}@${targetVersion}`;
  const command = `npm install -g ${spec}`;
  if (dryRun) {
    console.log(command);
    return 0;
  }
  console.error(`Updating to audited version ${targetVersion}`);
  const result = spawnSync('npm', ['install', '-g', spec], {
    stdio: 'inherit',
    env: process.env,
  });
  return result.status === null ? 1 : result.status;
}

async function runNotify() {
  const { manifest, cache } = await resolveManifest(false);
  const latest =
    manifest.latest_audited_version ||
    localManifest.latest_audited_version ||
    pkg.version;
  if (compareVersions(currentVersion, latest) >= 0) return 0;
  if (!shouldNotify(cache, latest)) return 0;
  console.error(`Audited update available: ${currentVersion} -> ${latest}`);
  console.error('Run: codex update');
  updateNoticeCache(cache, latest);
  return 0;
}

async function runUpdate() {
  const { manifest } = await resolveManifest(true);
  const target =
    manifest.latest_audited_version ||
    localManifest.latest_audited_version ||
    pkg.version;
  if (compareVersions(currentVersion, target) >= 0) {
    console.error(`Already on latest audited version: ${currentVersion}`);
    return 0;
  }
  return installTarget(target);
}

async function main() {
  if (mode === 'notify') {
    process.exitCode = await runNotify();
    return;
  }
  if (mode === 'update') {
    process.exitCode = await runUpdate();
    return;
  }
  throw new Error(`Unknown mode: ${mode}`);
}

main().catch((err) => {
  console.error(err && err.stack ? err.stack : String(err));
  process.exit(1);
});
