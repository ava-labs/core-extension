#!/usr/bin/env node
/**
 * Coverage ratchet: fails CI when any workspace's test coverage drops below
 * the effective baseline — the per-metric max of:
 *
 *   - the checked-in floor (coverage-baseline.json), and
 *   - a rolling baseline exported by the latest main-branch coverage run
 *     (passed via --rolling; see coverage-baseline.yaml).
 *
 * The rolling baseline keeps the bar at wherever main currently is without
 * manual updates; the floor bounds how far coverage can leak downward
 * between deliberate floor updates. When the rolling file is missing
 * (first run, expired artifact, red main), the check degrades to
 * floor-only with a warning.
 *
 * Usage:
 *   node scripts/coverage-ratchet.mjs --check [--rolling <path>] [--tolerance 0.1]
 *   node scripts/coverage-ratchet.mjs --update
 *   node scripts/coverage-ratchet.mjs --export <path>
 *
 * Expects each workspace to have been run with `jest --coverage` first, so
 * that <workspace>/coverage/coverage-summary.json exists (see the root
 * `test:coverage` script). Raising coverage does not fail the check — the
 * rolling baseline picks the gain up automatically on the next main build.
 */
import { readFileSync, writeFileSync, existsSync, readdirSync } from 'node:fs';
import { join, dirname, resolve } from 'node:path';
import { fileURLToPath } from 'node:url';

const ROOT = resolve(dirname(fileURLToPath(import.meta.url)), '..');
const BASELINE_PATH = join(ROOT, 'coverage-baseline.json');
const METRICS = ['lines', 'statements', 'functions', 'branches'];

const args = process.argv.slice(2);
const mode = args.includes('--update')
  ? 'update'
  : args.includes('--export')
    ? 'export'
    : 'check';
const exportPath = args.includes('--export')
  ? args[args.indexOf('--export') + 1]
  : null;
const rollingPath = args.includes('--rolling')
  ? args[args.indexOf('--rolling') + 1]
  : null;
const toleranceArg = args[args.indexOf('--tolerance') + 1];
// Percentage points a metric may fall below baseline before failing.
// Absorbs rounding jitter while still catching real regressions.
const TOLERANCE = args.includes('--tolerance') ? Number(toleranceArg) : 0.1;

if (mode === 'export' && !exportPath) {
  console.error('--export requires a target path.');
  process.exit(1);
}
if (args.includes('--rolling') && !rollingPath) {
  console.error('--rolling requires a path.');
  process.exit(1);
}
// A NaN tolerance would make every comparison false and silently
// disable the ratchet.
if (!Number.isFinite(TOLERANCE) || TOLERANCE < 0) {
  console.error(
    `--tolerance must be a non-negative number, got: ${toleranceArg}`,
  );
  process.exit(1);
}

function discoverWorkspaces() {
  const rootPkg = JSON.parse(readFileSync(join(ROOT, 'package.json'), 'utf8'));
  const workspaces = [];
  for (const pattern of rootPkg.workspaces) {
    const baseDir = join(ROOT, pattern.replace(/\/\*$/, ''));
    for (const entry of readdirSync(baseDir, { withFileTypes: true })) {
      if (!entry.isDirectory()) continue;
      const pkgPath = join(baseDir, entry.name, 'package.json');
      if (!existsSync(pkgPath)) continue;
      const pkg = JSON.parse(readFileSync(pkgPath, 'utf8'));
      if (pkg.scripts?.test) {
        workspaces.push({ name: pkg.name, dir: join(baseDir, entry.name) });
      }
    }
  }
  return workspaces.sort((a, b) => a.name.localeCompare(b.name));
}

function readCoverage(workspace) {
  const summaryPath = join(workspace.dir, 'coverage', 'coverage-summary.json');
  if (!existsSync(summaryPath)) return null;
  const { total } = JSON.parse(readFileSync(summaryPath, 'utf8'));
  return Object.fromEntries(
    METRICS.map((metric) => [
      metric,
      Math.round(total[metric].pct * 100) / 100,
    ]),
  );
}

function writeStepSummary(markdown) {
  if (process.env.GITHUB_STEP_SUMMARY) {
    writeFileSync(process.env.GITHUB_STEP_SUMMARY, markdown, { flag: 'a' });
  }
}

const workspaces = discoverWorkspaces();
const current = {};
const missing = [];
for (const workspace of workspaces) {
  const coverage = readCoverage(workspace);
  if (coverage) {
    current[workspace.name] = coverage;
  } else {
    missing.push(workspace.name);
  }
}

if (mode === 'update' || mode === 'export') {
  if (missing.length > 0) {
    console.error(
      `Cannot write baseline, missing coverage for: ${missing.join(', ')}.\n` +
        'Run `yarn test:coverage` first.',
    );
    process.exit(1);
  }
  const target = mode === 'export' ? exportPath : BASELINE_PATH;
  writeFileSync(target, JSON.stringify(current, null, 2) + '\n');
  console.log(`Baseline written to ${target}`);
  process.exit(0);
}

if (!existsSync(BASELINE_PATH)) {
  console.error(
    'No coverage-baseline.json found. Generate one with:\n' +
      '  yarn test:coverage && node scripts/coverage-ratchet.mjs --update',
  );
  process.exit(1);
}

const floor = JSON.parse(readFileSync(BASELINE_PATH, 'utf8'));
let rolling = {};
let baselineLabel = 'floor';
if (rollingPath) {
  if (existsSync(rollingPath)) {
    rolling = JSON.parse(readFileSync(rollingPath, 'utf8'));
    baselineLabel = 'max(rolling, floor)';
  } else {
    console.warn(
      `WARN  rolling baseline not found at ${rollingPath} — checking against the floor only.`,
    );
  }
}
const workspaceNames = new Set([
  ...Object.keys(floor),
  ...Object.keys(rolling),
]);
const baseline = Object.fromEntries(
  [...workspaceNames].map((name) => [
    name,
    Object.fromEntries(
      METRICS.map((metric) => [
        metric,
        Math.max(floor[name]?.[metric] ?? 0, rolling[name]?.[metric] ?? 0),
      ]),
    ),
  ]),
);
const failures = [];
const improvements = [];
const rows = [];

for (const workspace of workspaces) {
  const coverage = current[workspace.name];
  if (!coverage) {
    failures.push(
      `${workspace.name}: no coverage-summary.json found — did the test run crash?`,
    );
    continue;
  }
  const base = baseline[workspace.name];
  if (!base) {
    console.warn(
      `${workspace.name}: not in baseline yet — passing, but run --update to start ratcheting it.`,
    );
  }
  for (const metric of METRICS) {
    const was = base?.[metric] ?? 0;
    const now = coverage[metric];
    const delta = Math.round((now - was) * 100) / 100;
    rows.push({ workspace: workspace.name, metric, was, now, delta });
    if (now < was - TOLERANCE) {
      failures.push(
        `${workspace.name}: ${metric} coverage fell ${was}% → ${now}%`,
      );
    } else if (delta > TOLERANCE) {
      improvements.push(`${workspace.name}: ${metric} ${was}% → ${now}%`);
    }
  }
}

const table = [
  '| Workspace | Metric | Baseline | Current | Δ |',
  '| --- | --- | ---: | ---: | ---: |',
  ...rows.map(
    (r) =>
      `| ${r.workspace} | ${r.metric} | ${r.was}% | ${r.now}% | ${r.delta > 0 ? '+' : ''}${r.delta} |`,
  ),
].join('\n');

console.log(table + '\n');
writeStepSummary(
  `## Coverage ratchet (baseline: ${baselineLabel})\n\n${table}\n`,
);

if (improvements.length > 0) {
  const message =
    baselineLabel === 'floor'
      ? 'Coverage improved — lock it in by running ' +
        '`yarn test:coverage && yarn coverage:update` and committing coverage-baseline.json:\n' +
        improvements.map((line) => `  ${line}`).join('\n')
      : 'Coverage improved (the rolling baseline picks this up on the next main build):\n' +
        improvements.map((line) => `  ${line}`).join('\n');
  console.log(message);
  writeStepSummary(`\n:tada: ${improvements.length} metric(s) improved.\n`);
}

if (failures.length > 0) {
  const message =
    `Coverage dropped below baseline [${baselineLabel}] (tolerance ${TOLERANCE}pp):\n` +
    failures.map((line) => `  ${line}`).join('\n');
  console.error('\n' + message);
  writeStepSummary(
    `\n:x: **Failed**\n\n${failures.map((line) => `- ${line}`).join('\n')}\n`,
  );
  process.exit(1);
}

console.log('Coverage ratchet passed.');
