const fs = require('fs');
const path = require('path');

const repoRoot = path.resolve(__dirname, '..');
const manifestPath = path.join(repoRoot, 'config', 'codex-termux-release-manifest.json');
const packageJsonPath = path.join(repoRoot, 'packages', 'codex-termux', 'package.json');
const packageReadmePath = path.join(repoRoot, 'packages', 'codex-termux', 'README.md');
const rootReadmePath = path.join(repoRoot, 'README.md');
const guidancePath = path.join(repoRoot, 'docs', '20260503_codex-termux-release-guidance.md');

function readJson(filePath) {
  return JSON.parse(fs.readFileSync(filePath, 'utf8'));
}

function writeIfChanged(filePath, content) {
  const current = fs.existsSync(filePath) ? fs.readFileSync(filePath, 'utf8') : null;
  if (current === content) {
    return false;
  }
  fs.writeFileSync(filePath, content);
  return true;
}

function q(value) {
  return `\`${value}\``;
}

function trackedVersions(manifest) {
  return Array.isArray(manifest.tracked_versions) ? manifest.tracked_versions : [];
}

function getState(manifest) {
  const versions = trackedVersions(manifest);
  const auditedVersion = manifest.latest_audited_version;
  const candidateVersion = manifest.latest_candidate_version || auditedVersion;
  const rollbackVersion = manifest.rollback_version || auditedVersion;
  const isPublished =
    manifest.public_distribution_status === 'published' &&
    manifest.support_status === 'public_supported';
  const isReadyToPublish = manifest.canonical_package_status === 'ready_to_publish';
  const hasPendingCandidate = candidateVersion !== auditedVersion;

  return {
    auditedVersion,
    candidateVersion,
    hasPendingCandidate,
    installCommand: manifest.install_command || `npm install -g ${manifest.canonical_package_name}@latest`,
    isPublished,
    isReadyToPublish,
    rollbackVersion,
    trackedVersions: versions,
    updateCommand: manifest.update_command || `npm install -g ${manifest.canonical_package_name}@latest`,
  };
}

function renderTrackedVersions(state) {
  return state.trackedVersions.length > 0
    ? state.trackedVersions.map((version) => q(version)).join(', ')
    : q('unknown');
}

function renderVersionBlock(state) {
  const lines = [
    `- Latest audited version: ${q(state.auditedVersion)}`,
    `- Tracked versions: ${renderTrackedVersions(state)}`,
  ];
  if (state.hasPendingCandidate) {
    lines.push(`- Pending candidate version: ${q(state.candidateVersion)}`);
  }
  return lines.join('\n');
}

function renderRootStatusLines(state) {
  if (state.isPublished) {
    return [
      'Public package release is live.',
      '',
      '現在は public package を公開中です。',
      '',
      'This repository is public, and the package is published.',
      '',
      'このリポジトリは public で、package も公開済みです。',
      '',
      'Public support is available for the published package.',
      '',
      '公開 package をサポートします。',
    ];
  }

  if (state.isReadyToPublish) {
    return [
      'Public package release is staged for publish review.',
      '',
      '現在は public package の publish review 段階です。',
      '',
      'This repository is public, but install guidance remains withheld until publish completes.',
      '',
      'このリポジトリは public ですが、publish 完了まで install guidance は withheld のままです。',
      '',
      'Public support remains withheld until the publish gate passes.',
      '',
      'publish gate を通るまで public support は withheld のままです。',
    ];
  }

  return [
    'Public package release is not live yet.',
    '',
    '現在は public package の準備段階です。',
    '',
    'This repository is public, but the installable package line is not published yet.',
    '',
    'このリポジトリは public ですが、install 可能な package line はまだ未公開です。',
    '',
    'Public support remains withheld until the publish gate passes.',
    '',
    'publish gate を通るまで public support は withheld のままです。',
  ];
}

function renderPublishedCommands(manifest, state) {
  return [
    '## Install / インストール',
    '',
    '```sh',
    state.installCommand,
    'codex --version',
    'codex login status',
    '```',
    '',
    '## Update / 更新',
    '',
    '```sh',
    state.updateCommand,
    '```',
    '',
    '## Rollback / ロールバック',
    '',
    '```sh',
    `npm install -g ${manifest.canonical_package_name}@${state.rollbackVersion}`,
    '```',
  ];
}

function renderWithheldCommands() {
  return [
    '## Install / インストール',
    '',
    'Public install guidance remains withheld.',
    '',
    'public install guidance は withheld のままです。',
    '',
    '## Update / 更新',
    '',
    'Public update guidance remains withheld.',
    '',
    'public update guidance は withheld のままです。',
    '',
    '## Rollback / ロールバック',
    '',
    'Rollback guidance will be published after the release gate passes.',
    '',
    'rollback guidance は release gate 通過後に公開します。',
  ];
}

function renderRootReadme(manifest) {
  const state = getState(manifest);
  const commands = state.isPublished ? renderPublishedCommands(manifest, state) : renderWithheldCommands();

  return [
    '# Codex-Termux',
    '',
    'Codex wrapper package for Termux.',
    '',
    'Termux 向け Codex wrapper package です。',
    '',
    '## Status / 状態',
    '',
    ...renderRootStatusLines(state),
    '',
    '## Manifest Snapshot / manifest スナップショット',
    '',
    '- Repository visibility: `public`',
    `- Canonical package name: ${q(manifest.canonical_package_name)}`,
    `- Canonical package status: ${q(manifest.canonical_package_status)}`,
    `- Public distribution status: ${q(manifest.public_distribution_status)}`,
    `- Support status: ${q(manifest.support_status)}`,
    renderVersionBlock(state),
    '',
    ...commands,
    '',
    'Package files:',
    '',
    'package files:',
    '',
    '```text',
    'packages/codex-termux',
    '```',
    '',
    '## Source Of Truth / 正本',
    '',
    '- release manifest:',
    '  - `config/codex-termux-release-manifest.json`',
    '- release guidance:',
    '  - `docs/20260503_codex-termux-release-guidance.md`',
    '',
  ].join('\n');
}

function renderPackageReadme(manifest) {
  const state = getState(manifest);
  const notes = state.isPublished
    ? [
        `- Install with ${q(state.installCommand)}`,
        '- `codex update` is intercepted and rerouted to the same npm install command',
        `- Update with ${q(state.updateCommand)}`,
        '- Roll back by installing an explicit published version',
      ]
    : [
        '- Do not treat this branch state as public install guidance',
        '- `codex update` remains routed through the npm-managed package line',
        '- Publish/support wording is controlled by the release manifest',
      ];

  return [
    `# ${manifest.canonical_package_name}`,
    '',
    'Termux 向け Codex package です。',
    '',
    '## Manifest Snapshot',
    '',
    `- Canonical package status: ${q(manifest.canonical_package_status)}`,
    `- Public distribution status: ${q(manifest.public_distribution_status)}`,
    `- Support status: ${q(manifest.support_status)}`,
    `- Latest audited version: ${q(state.auditedVersion)}`,
    `- Tracked versions: ${renderTrackedVersions(state)}`,
    `- Update strategy: ${q(manifest.update_strategy)}`,
    '',
    '## Scope',
    '',
    '- `codex` / `codex-exec` launcher entrypoints',
    '- `LD_LIBRARY_PATH` sanitization for Termux',
    '- `CODEX_SELF_EXE` wiring',
    '- `exec` routing for non-command arguments',
    '- optional passthrough to locally staged Android artifacts',
    '',
    '## Package Shape',
    '',
    '- `bin/codex`',
    '- `bin/codex-exec`',
    '- `bin/codex-termux`',
    '- `bin/codex.js`',
    '- `bin/codex-exec.js`',
    '- `lib/stage-android-runtime.sh`',
    '',
    '## Resolution Order',
    '',
    'The JS launcher first routes to the shell launcher in `bin/`, which then looks',
    'for locally staged native artifacts under this package.',
    'If they are not present, it can fall back to an installed upstream',
    '`@openai/codex` package together with the Android platform package when present.',
    '',
    'The shell launcher keeps the Termux library path clean by removing the default',
    'Termux `lib` and `libexec` entries before prepending the package `bin/`',
    'directory.',
    '',
    '## Notes',
    '',
    ...notes,
    '',
  ].join('\n');
}

function renderGuidance(manifest) {
  const state = getState(manifest);
  const statusLines = state.isPublished
    ? [
        '- this repository is public',
        '- the package is published',
        '- public support is available',
      ]
    : state.isReadyToPublish
      ? [
          '- this repository is public',
          '- the package is staged for publish review',
          '- public support remains withheld until publish completes',
        ]
      : [
          '- this repository is public',
          '- the package line is in package-prep state',
          '- public support remains withheld',
        ];

  const installSection = state.isPublished
    ? [
        '## Install',
        '',
        '```sh',
        state.installCommand,
        'codex --version',
        'codex login status',
        '```',
        '',
        '## Update',
        '',
        '```sh',
        state.updateCommand,
        '```',
        '',
        'Do not install the upstream `@openai/codex` package directly on Termux.',
        '',
        '## Rollback',
        '',
        '```sh',
        `npm install -g ${manifest.canonical_package_name}@${state.rollbackVersion}`,
        '```',
      ]
    : [
        '## Install',
        '',
        'Public install guidance remains withheld.',
        '',
        '## Update',
        '',
        'Public update guidance remains withheld.',
        '',
        'Do not install the upstream `@openai/codex` package directly on Termux.',
        '',
        '## Rollback',
        '',
        'Rollback guidance will be published after the release gate passes.',
      ];

  const candidateLine = state.hasPendingCandidate
    ? [`- pending candidate version: ${q(state.candidateVersion)}`]
    : [];

  return [
    '# 2026-05-03 Codex-Termux Release Guidance',
    '',
    '## Status',
    '',
    ...statusLines,
    `- package name: ${q(manifest.canonical_package_name)}`,
    `- latest audited version: ${q(state.auditedVersion)}`,
    `- tracked versions: ${renderTrackedVersions(state)}`,
    ...candidateLine,
    '',
    '## Current Scope',
    '',
    '- package skeleton is in `packages/codex-termux`',
    '- CI currently covers:',
    '  - syntax check',
    '  - manifest / README drift check',
    '  - `npm pack --dry-run`',
    state.isPublished
      ? '- publish and registry verification have completed'
      : '- publish remains gated by manifest status and runtime staging',
    '',
    ...installSection,
    '',
    '## Source Of Truth',
    '',
    '- `config/codex-termux-release-manifest.json`',
    '',
  ].join('\n');
}

function renderPackageJson(manifest, pkg) {
  return `${JSON.stringify(
    {
      ...pkg,
      name: manifest.canonical_package_name,
      version: manifest.latest_audited_version,
    },
    null,
    2
  )}\n`;
}

function sync({ checkOnly = false } = {}) {
  const manifest = readJson(manifestPath);
  const pkg = readJson(packageJsonPath);
  const outputs = [
    [packageJsonPath, renderPackageJson(manifest, pkg)],
    [packageReadmePath, renderPackageReadme(manifest)],
    [rootReadmePath, renderRootReadme(manifest)],
    [guidancePath, renderGuidance(manifest)],
  ];

  if (checkOnly) {
    for (const [filePath, expected] of outputs) {
      const actual = fs.readFileSync(filePath, 'utf8');
      if (actual !== expected) {
        throw new Error(`${path.relative(repoRoot, filePath)} drift detected; run node scripts/sync-public-release-from-manifest.js`);
      }
    }
    return [];
  }

  const changedFiles = [];
  for (const [filePath, content] of outputs) {
    if (writeIfChanged(filePath, content)) {
      changedFiles.push(path.relative(repoRoot, filePath));
    }
  }
  return changedFiles;
}

if (require.main === module) {
  const changedFiles = sync({ checkOnly: process.argv.includes('--check') });
  if (changedFiles.length === 0) {
    console.log('public release files already match the manifest');
  } else {
    console.log(`updated ${changedFiles.length} file(s):`);
    for (const filePath of changedFiles) {
      console.log(`- ${filePath}`);
    }
  }
}

module.exports = {
  getState,
  renderGuidance,
  renderPackageJson,
  renderPackageReadme,
  renderRootReadme,
  sync,
};
