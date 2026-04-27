#!/usr/bin/env node
/**
 * E2E feature coverage for core-extension (primary): % of top-level `apps/next/src/pages/<Feature>/` folders
 * “claimed” by at least one Playwright spec via file stem, test.describe title, and test() titles (token match).
 * Does not use data-testid — this is product-area coverage, not selector inventory.
 *
 * Modeled after core-web `QA-add-test-coverage-script` (coverage-model, required-scenarios, testid-coverage JSON + this script).
 *
 * Optional `--testid-inventory`: extra report for data-testid declaration vs getByTestId / `[data-testid=…]` locators.
 *
 * Config JSON: `e2e/<name>.config.json` or `e2e/scripts/<name>.config.json` (testid, required-scenarios, coverage-model).
 *
 * CLI: node e2e/scripts/e2e-testid-coverage.mjs [--json] [--verbose] [--testid-inventory] [--testrail] [--app-dir …] [--e2e-dir …]
 *
 * Optional --testrail: fetch TestRail run/suite for cross-check only; headline coverage is codebaseCompositeCoverage
 * (e2e/coverage-model.config.json) and does not use TestRail.
 */

import fs from 'node:fs';
import { createRequire } from 'node:module';
import path from 'node:path';
import process from 'node:process';
import { fileURLToPath } from 'node:url';

const require = createRequire(import.meta.url);
const ts = require('typescript');

const __dirname = path.dirname(fileURLToPath(import.meta.url));
// Script lives at e2e/scripts/*.mjs — monorepo root is two levels up
const REPO_ROOT = path.resolve(__dirname, '../..');

/** Feature folder names that are too generic to match from spec text (false positives). */
const AMBIGUOUS_FEATURE_DIRS = new Set([
  'Error',
  'Banner',
  'Button',
  'Carousel',
  'CommonTable',
  'CopyButton',
  'CoreLogoLink',
  'Loading',
]);

/** Tokens shared by many folder names — do not use alone to match a feature (e.g. "Landing Page" → \bpage\b). */
const GENERIC_FEATURE_TOKENS = new Set([
  'page',
  'tab',
  'tabs',
  'header',
  'grid',
  'list',
  'card',
  'row',
  'form',
  'button',
  'link',
  'table',
  'dialog',
  'modal',
  'drawer',
  'menu',
  'bar',
  'panel',
  'item',
  'cell',
  'icon',
  'layout',
  'content',
  'section',
]);

function defaultAppRoots() {
  const candidates = [path.join(REPO_ROOT, 'apps/next/src')];
  return candidates.filter((p) => fs.existsSync(p));
}

/** Top-level product folders under the Next app (parallel to core-web `apps/core/app/components/*`). */
function featureAreasRoot() {
  return path.normalize(path.join(REPO_ROOT, 'apps/next/src/pages'));
}

/**
 * True when `candidatePath` is the same as or under `rootDir` (resolved), without `startsWith` prefix false-positives.
 * @param {string} rootDir
 * @param {string} candidatePath
 */
function isPathWithinRoot(rootDir, candidatePath) {
  const rootResolved = path.resolve(rootDir);
  const candidateResolved = path.resolve(candidatePath);
  const relative = path.relative(rootResolved, candidateResolved);
  return (
    relative === '' ||
    (relative !== '..' &&
      !relative.startsWith(`..${path.sep}`) &&
      !path.isAbsolute(relative))
  );
}

function parseArgs(argv) {
  const opts = {
    json: false,
    verbose: false,
    testrail: false,
    /** Include testid bucket / orphan analysis (off by default). */
    testidInventory: false,
    /** @type {string[] | null} */
    appRoots: null,
    e2eDir: path.join(REPO_ROOT, 'e2e'),
  };
  for (let i = 2; i < argv.length; i++) {
    const a = argv[i];
    if (a === '--json') {
      opts.json = true;
    } else if (a === '--verbose') {
      opts.verbose = true;
    } else if (a === '--testid-inventory') {
      opts.testidInventory = true;
    } else if (a === '--testrail') {
      opts.testrail = true;
    } else if (a === '--app-dir') {
      const val = argv[++i];
      if (!val || val.startsWith('--')) {
        console.error(
          'e2e-testid-coverage: --app-dir requires a directory path (missing value or next token is a flag).',
        );
        process.exit(1);
      }
      if (!opts.appRoots) {
        opts.appRoots = [];
      }
      opts.appRoots.push(path.resolve(REPO_ROOT, val));
    } else if (a === '--e2e-dir') {
      const val = argv[++i];
      if (!val || val.startsWith('--')) {
        console.error(
          'e2e-testid-coverage: --e2e-dir requires a directory path (missing value or next token is a flag).',
        );
        process.exit(1);
      }
      opts.e2eDir = path.resolve(REPO_ROOT, val);
    }
  }
  if (!opts.appRoots?.length) {
    opts.appRoots = defaultAppRoots();
  }
  return opts;
}

/**
 * Prefer e2e/<file> when present; otherwise e2e/scripts/<file> (configs often live with tooling).
 * @param {string} e2eDir
 * @param {string} fileName
 */
function resolveE2eConfigPath(e2eDir, fileName) {
  const direct = path.join(e2eDir, fileName);
  if (fs.existsSync(direct)) {
    return direct;
  }
  const underScripts = path.join(e2eDir, 'scripts', fileName);
  if (fs.existsSync(underScripts)) {
    return underScripts;
  }
  return direct;
}

/**
 * @param {string} e2eDir
 * @returns {{ ignoredOrphanTestIds: string[], ledgerSpecAdditionalModules: string[] }}
 */
function loadCoverageConfig(e2eDir) {
  const configPath = resolveE2eConfigPath(
    e2eDir,
    'testid-coverage.config.json',
  );
  const defaults = {
    ignoredOrphanTestIds: [],
    ledgerSpecAdditionalModules: [],
  };
  if (!fs.existsSync(configPath)) {
    return defaults;
  }
  try {
    const raw = JSON.parse(fs.readFileSync(configPath, 'utf8'));
    return {
      ignoredOrphanTestIds: Array.isArray(raw.ignoredOrphanTestIds)
        ? raw.ignoredOrphanTestIds
        : [],
      ledgerSpecAdditionalModules: Array.isArray(
        raw.ledgerSpecAdditionalModules,
      )
        ? raw.ledgerSpecAdditionalModules
        : [],
    };
  } catch {
    return defaults;
  }
}

/**
 * @param {string} e2eDir
 * @returns {{ flows: string[], walletModes: string[], definition?: string }}
 */
function loadRequiredScenariosConfig(e2eDir) {
  const configPath = resolveE2eConfigPath(
    e2eDir,
    'required-scenarios.config.json',
  );
  const defaults = {
    flows: ['send', 'swap'],
    walletModes: ['mnemonic', 'seedless', 'ledger'],
  };
  if (!fs.existsSync(configPath)) {
    return defaults;
  }
  try {
    const raw = JSON.parse(fs.readFileSync(configPath, 'utf8'));
    return {
      flows:
        Array.isArray(raw.flows) && raw.flows.length
          ? raw.flows
          : defaults.flows,
      walletModes:
        Array.isArray(raw.walletModes) && raw.walletModes.length
          ? raw.walletModes
          : defaults.walletModes,
      definition:
        typeof raw.definition === 'string' ? raw.definition : undefined,
    };
  } catch {
    return defaults;
  }
}

/**
 * Weighted blend of codebase-only signals (no external QA tools). Weights should sum to 1.
 * @param {string} e2eDir
 */
function loadCoverageModelConfig(e2eDir) {
  const configPath = resolveE2eConfigPath(e2eDir, 'coverage-model.config.json');
  const defaults = {
    weights: {
      e2eFeatureCoveragePercent: 0.08,
      requiredScenariosPercent: 0.22,
      featureFolderWalletSlotPercent: 0.7,
    },
    impliedUncertaintyPercentagePoints: 10,
  };
  if (!fs.existsSync(configPath)) {
    return { ...defaults, definition: undefined };
  }
  try {
    const raw = JSON.parse(fs.readFileSync(configPath, 'utf8'));
    const w = raw.weights;
    const weights = {
      e2eFeatureCoveragePercent: Number(
        w?.e2eFeatureCoveragePercent ??
          defaults.weights.e2eFeatureCoveragePercent,
      ),
      requiredScenariosPercent: Number(
        w?.requiredScenariosPercent ??
          defaults.weights.requiredScenariosPercent,
      ),
      featureFolderWalletSlotPercent: Number(
        w?.featureFolderWalletSlotPercent ??
          defaults.weights.featureFolderWalletSlotPercent,
      ),
    };
    const sum =
      weights.e2eFeatureCoveragePercent +
      weights.requiredScenariosPercent +
      weights.featureFolderWalletSlotPercent;
    if (sum > 0 && Math.abs(sum - 1) > 0.02) {
      weights.e2eFeatureCoveragePercent /= sum;
      weights.requiredScenariosPercent /= sum;
      weights.featureFolderWalletSlotPercent /= sum;
    }
    return {
      weights,
      impliedUncertaintyPercentagePoints: Number(
        raw.impliedUncertaintyPercentagePoints ??
          defaults.impliedUncertaintyPercentagePoints,
      ),
      definition:
        typeof raw.definition === 'string' ? raw.definition : undefined,
    };
  } catch {
    return { ...defaults, definition: undefined };
  }
}

/** @param {string} dir @param {string[]} acc */
function walkE2eSpecFiles(dir, acc) {
  if (!fs.existsSync(dir)) {
    return;
  }
  for (const ent of fs.readdirSync(dir, { withFileTypes: true })) {
    const p = path.join(dir, ent.name);
    if (ent.isDirectory()) {
      walkE2eSpecFiles(p, acc);
    } else if (
      ent.name.endsWith('.spec.ts') ||
      ent.name.endsWith('.spec.tsx')
    ) {
      acc.push(p);
    }
  }
}

/**
 * Heuristic: spec source matches a configured product flow (see e2e/required-scenarios.config.json).
 * @param {string} flow
 * @param {string} text
 */
function specTextCoversFlow(flow, text) {
  if (flow === 'onboarding') {
    return /OnboardingPage|onboarding\.spec|pages\/extension\/OnboardingPage|Onboarding Tests/i.test(
      text,
    );
  }
  if (flow === 'networks') {
    return /NetworksPage|networks\.spec|navigateToNetworks|pages\/extension\/NetworksPage/i.test(
      text,
    );
  }
  if (flow === 'contacts') {
    return /ContactsPage|contacts\.spec|navigateToContacts|pages\/extension\/ContactsPage/i.test(
      text,
    );
  }
  if (flow === 'send') {
    return (
      /SendPage|sendTile|waitForURL\([^)]*\/send|getByRole\(\s*['"]link['"],\s*\{[^}]*name:\s*['"]Send['"]/i.test(
        text,
      ) || /pages\/Send|\/Send\/|navigateToSend|SendBody/i.test(text)
    );
  }
  if (flow === 'swap') {
    return (
      /SwapPage|swapTile|waitForURL\([^)]*\/swap|toHaveURL\([^)]*\/swap|getByRole\(\s*['"]link['"],\s*\{[^}]*name:\s*['"]Swap['"]/i.test(
        text,
      ) || /pages\/Swap|\/Swap\/|FusionSwap|pages\/Fusion/i.test(text)
    );
  }
  if (flow === 'cross-chain-transfer') {
    return (
      /CrossChainTransferPage|crossChainTile|cross-chain-transfer|Cross Chain Transfer|fillCrossChainTransfer/i.test(
        text,
      ) ||
      /pages\/Bridge|BridgePage|navigateToBridge|UnifiedBridge|crossChain/i.test(
        text,
      )
    );
  }
  if (flow === 'stake-delegate') {
    return /stakeTile|StakePage|waitForURL\([^)]*\/stake|getByRole\(\s*['"]link['"],\s*\{[^}]*name:\s*['"]Stake['"]|\/stake\/|delegate|Delegation|lockedStaked|PChain/i.test(
      text,
    );
  }
  if (flow === 'defi') {
    return /defiTab|DeFiPage|DeFiCollateral|\/defi|getByRole\(\s*['"]tab['"],\s*\{[^}]*name:\s*['"]DeFi['"]|granite|Granite|pages\/DeFi/i.test(
      text,
    );
  }
  if (flow === 'collectibles') {
    return /CollectiblesPage|collectible|\/collectibles|nft-gallery|NFT gallery|getByRole\(\s*['"]link['"],\s*\{[^}]*name:\s*['"]Collectibles['"]|CollectiblesTab|CollectibleCard/i.test(
      text,
    );
  }
  return false;
}

function specUsesMnemonicExtensionFixture(text) {
  return (
    text.includes('extension.fixture') ||
    text.includes("from '../fixtures/extension.fixture'") ||
    text.includes('from "../fixtures/extension.fixture"')
  );
}

/**
 * @param {string} e2eDir
 * @param {{ flows: string[], walletModes: string[], definition?: string }} cfg
 */
function computeRequiredScenarioMatrix(e2eDir, cfg) {
  const testsDir = path.join(e2eDir, 'tests');
  const allSpecs = [];
  walkE2eSpecFiles(testsDir, allSpecs);

  /** @type {{ id: string, flow: string, walletMode: string, implemented: boolean, evidence: string[] }[]} */
  const scenarios = [];

  for (const flow of cfg.flows) {
    for (const mode of cfg.walletModes) {
      const id = `${flow}-${mode}`;
      /** @type {string[]} */
      const evidence = [];
      let implemented = false;

      if (mode === 'mnemonic') {
        for (const sp of allSpecs) {
          const rel = path.relative(e2eDir, sp).replaceAll('\\', '/');
          if (rel.includes('ledger/')) {
            continue;
          }
          const txt = readSource(sp);
          if (
            !specUsesMnemonicExtensionFixture(txt) ||
            !specTextCoversFlow(flow, txt)
          ) {
            continue;
          }
          implemented = true;
          evidence.push(path.relative(REPO_ROOT, sp));
        }
      } else if (mode === 'seedless') {
        for (const sp of allSpecs) {
          const rel = path.relative(e2eDir, sp).replaceAll('\\', '/');
          const txt = readSource(sp);
          const seedlessContext =
            rel.includes('seedless/') ||
            txt.includes('seedless.fixture') ||
            txt.includes('@seedless') ||
            txt.includes('TAGS.seedless');
          if (!seedlessContext || !specTextCoversFlow(flow, txt)) {
            continue;
          }
          implemented = true;
          evidence.push(path.relative(REPO_ROOT, sp));
        }
      } else if (mode === 'ledger') {
        for (const sp of allSpecs) {
          const rel = path.relative(e2eDir, sp).replaceAll('\\', '/');
          if (!rel.includes('ledger/')) {
            continue;
          }
          const txt = readSource(sp);
          if (!specTextCoversFlow(flow, txt)) {
            continue;
          }
          implemented = true;
          evidence.push(path.relative(REPO_ROOT, sp));
        }
      }

      scenarios.push({
        id,
        flow,
        walletMode: mode,
        implemented,
        evidence: [...new Set(evidence)].sort(),
      });
    }
  }

  const totalRequired = scenarios.length;
  const implementedCount = scenarios.filter((s) => s.implemented).length;
  const pct =
    totalRequired === 0 ? 0 : (implementedCount / totalRequired) * 100;
  const missing = scenarios.filter((s) => !s.implemented).map((s) => s.id);

  return {
    scenarios,
    totalRequired,
    implementedCount,
    percent: Math.round(pct * 100) / 100,
    missing,
  };
}

/** @param {string} specPath */
function isLedgerSpecFile(specPath) {
  const n = specPath.replaceAll('\\', '/');
  return /\/e2e\/tests\/ledger\/.+\.spec\.tsx?$/.test(n);
}

/**
 * @param {string} e2eDir
 * @param {string[]} relativePaths
 */
function resolveE2eExtraModules(e2eDir, relativePaths) {
  const roots = [];
  for (const rel of relativePaths) {
    const abs = path.normalize(path.join(e2eDir, rel));
    if (!isPathWithinRoot(e2eDir, abs)) {
      continue;
    }
    if (fs.existsSync(abs) && fs.statSync(abs).isFile()) {
      roots.push(abs);
    }
  }
  return roots;
}

/**
 * Collect custom_automation_id values from Playwright annotations in source text.
 * @param {string} sourceText
 */
function extractRepoTestRailAutomationIds(sourceText) {
  const ids = new Set();
  const re = /custom_automation_id:([A-Za-z0-9-]+)/g;
  let m = re.exec(sourceText);
  while (m) {
    ids.add(m[1]);
    m = re.exec(sourceText);
  }
  return [...ids];
}

/**
 * @param {string} e2eTestsDir
 */
function collectAllRepoTestRailIds(e2eTestsDir) {
  const acc = new Set();
  const files = [];
  walkTsFiles(e2eTestsDir, files, { app: false });
  for (const f of files) {
    if (!f.endsWith('.spec.ts') && !f.endsWith('.spec.tsx')) {
      continue;
    }
    const text = readSource(f);
    for (const id of extractRepoTestRailAutomationIds(text)) {
      acc.add(id);
    }
  }
  return [...acc].sort();
}

/**
 * @param {Record<string, unknown>} caseRow
 * @param {string | undefined} fieldKey env TESTRAIL_AUTOMATION_FIELD overrides
 */
function getCaseAutomationId(caseRow, fieldKey) {
  if (fieldKey && caseRow[fieldKey]) {
    return String(caseRow[fieldKey]);
  }
  if (caseRow.custom_automation_id) {
    return String(caseRow.custom_automation_id);
  }
  for (const k of Object.keys(caseRow)) {
    if (
      k === 'custom_automation_id' ||
      (k.startsWith('custom_') && k.includes('automation'))
    ) {
      const v = caseRow[k];
      if (v !== undefined && v !== null && String(v).trim() !== '') {
        return String(v);
      }
    }
  }
  return null;
}

/**
 * @returns {Promise<{ ok: boolean, suiteAutomationIds: string[], error?: string }>}
 */
async function fetchTestRailSuiteAutomationIds() {
  const host = process.env.TESTRAIL_HOST?.replace(/\/$/, '');
  const user = process.env.TESTRAIL_USER;
  const key = process.env.TESTRAIL_API_KEY;
  const projectId = process.env.TESTRAIL_PROJECT_ID;
  const suiteId = process.env.TESTRAIL_SUITE_ID;
  const fieldKey = process.env.TESTRAIL_AUTOMATION_FIELD;
  if (!host || !user || !key || !projectId || !suiteId) {
    return {
      ok: false,
      suiteAutomationIds: [],
      error:
        'Missing one of TESTRAIL_HOST, TESTRAIL_USER, TESTRAIL_API_KEY, TESTRAIL_PROJECT_ID, TESTRAIL_SUITE_ID',
    };
  }
  const auth = Buffer.from(`${user}:${key}`).toString('base64');
  const ids = new Set();
  let offset = 0;
  while (true) {
    const u = new URL(`${host}/index.php?/api/v2/get_cases/${projectId}`);
    u.searchParams.set('suite_id', suiteId);
    u.searchParams.set('limit', '250');
    u.searchParams.set('offset', String(offset));
    const res = await fetch(u, { headers: { Authorization: `Basic ${auth}` } });
    if (!res.ok) {
      const errText = await res.text();
      return {
        ok: false,
        suiteAutomationIds: [],
        error: `${res.status} ${errText.slice(0, 500)}`,
      };
    }
    /** @type {{ cases?: Record<string, unknown>[] }} */
    const data = await res.json();
    const batch = data.cases ?? [];
    for (const c of batch) {
      const aid = getCaseAutomationId(c, fieldKey);
      if (aid) {
        ids.add(aid.trim());
      }
    }
    if (batch.length < 250) {
      break;
    }
    offset += 250;
  }
  return { ok: true, suiteAutomationIds: [...ids].sort() };
}

/**
 * @returns {{ host: string, authHeader: string } | null}
 */
function getTestRailAuth() {
  const host = process.env.TESTRAIL_HOST?.replace(/\/$/, '');
  const user = process.env.TESTRAIL_USER;
  const key = process.env.TESTRAIL_API_KEY;
  if (!host || !user || !key) {
    return null;
  }
  const authHeader = `Basic ${Buffer.from(`${user}:${key}`).toString('base64')}`;
  return { host, authHeader };
}

/**
 * TestRail run stats: pass+fail = executed in run (automated); untested = not executed in this run.
 * @param {string} host
 * @param {string} authHeader
 * @param {string | number} runId
 * @returns {Promise<{ ok: true } & Record<string, unknown> | { ok: false, error: string }>}
 */
async function fetchTestRailRunExecution(host, authHeader, runId) {
  const u = `${host}/index.php?/api/v2/get_run/${runId}`;
  const res = await fetch(u, { headers: { Authorization: authHeader } });
  if (!res.ok) {
    const errText = await res.text();
    return { ok: false, error: `${res.status} ${errText.slice(0, 500)}` };
  }
  /** @type {Record<string, unknown>} */
  const run = await res.json();
  const passed = Number(run.passed_count ?? 0);
  const failed = Number(run.failed_count ?? 0);
  const untested = Number(run.untested_count ?? 0);
  const blocked = Number(run.blocked_count ?? 0);
  const retest = Number(run.retest_count ?? 0);
  let testsCount = Number(run.tests_count ?? 0);
  if (!testsCount) {
    testsCount = passed + failed + untested + blocked + retest;
  }
  const executed = passed + failed;
  const percent =
    testsCount === 0 ? 0 : Math.round((executed / testsCount) * 10000) / 100;
  return {
    ok: true,
    runId: Number(run.id ?? runId),
    suiteId: run.suite_id,
    testsCount,
    passedCount: passed,
    failedCount: failed,
    untestedCount: untested,
    blockedCount: blocked,
    retestCount: retest,
    executedPassFailCount: executed,
    percentPassFailOfRunTests: percent,
  };
}

/**
 * Optional snapshot when API cannot be called (paste counts from TestRail run summary).
 * @param {string} e2eDir
 */
function loadTestRailRunReference(e2eDir) {
  const p = resolveE2eConfigPath(e2eDir, 'testrail-run-reference.json');
  if (!fs.existsSync(p)) {
    return null;
  }
  try {
    return JSON.parse(fs.readFileSync(p, 'utf8'));
  } catch {
    return null;
  }
}

/**
 * @param {unknown} raw
 * @returns {Record<string, unknown> | null}
 */
function normalizeTestRailRunReference(raw) {
  if (!raw || typeof raw !== 'object') {
    return null;
  }
  const o = /** @type {Record<string, unknown>} */ (raw);
  const runId = o.runId ?? o.run_id;
  const testsCount = Number(o.testsCount ?? o.tests_count ?? 0);
  const passed = Number(o.passedCount ?? o.passed_count ?? 0);
  const failed = Number(o.failedCount ?? o.failed_count ?? 0);
  if (runId === undefined || runId === null || testsCount <= 0) {
    return null;
  }
  const executed = passed + failed;
  const percent =
    testsCount === 0 ? 0 : Math.round((executed / testsCount) * 10000) / 100;
  return {
    runId: Number(runId),
    testsCount,
    passedCount: passed,
    failedCount: failed,
    untestedCount: Number(
      o.untestedCount ?? o.untested_count ?? Math.max(0, testsCount - executed),
    ),
    blockedCount: Number(o.blockedCount ?? o.blocked_count ?? 0),
    retestCount: Number(o.retestCount ?? o.retest_count ?? 0),
    executedPassFailCount: executed,
    percentPassFailOfRunTests: percent,
  };
}

function shouldIgnoreAppFile(absPath) {
  const n = absPath.replaceAll('\\', '/');
  if (n.includes('/node_modules/')) {
    return true;
  }
  if (n.includes('/__tests__/')) {
    return true;
  }
  if (/\.(test|spec)\.tsx?$/.test(n)) {
    return true;
  }
  return false;
}

/** @param {string} dir */
function walkTsFiles(dir, acc, { app } = { app: false }) {
  if (!fs.existsSync(dir)) {
    return;
  }
  for (const ent of fs.readdirSync(dir, { withFileTypes: true })) {
    const p = path.join(dir, ent.name);
    if (ent.isDirectory()) {
      if (
        ent.name === 'node_modules' ||
        ent.name === 'dist' ||
        ent.name === '.turbo'
      ) {
        continue;
      }
      walkTsFiles(p, acc, { app });
    } else if (/\.tsx?$/.test(ent.name) && !(app && shouldIgnoreAppFile(p))) {
      acc.push(p);
    }
  }
}

/** @param {string} filePath */
function readSource(filePath) {
  return fs.readFileSync(filePath, 'utf8');
}

/** Wildcard `*` matches any substring (empty allowed). */
function globToRegExp(glob) {
  const parts = glob
    .split('*')
    .map((p) => p.replace(/[.+?^${}()|[\]\\]/g, '\\$&'));
  return new RegExp(`^${parts.join('.*')}$`);
}

/**
 * @param {import('typescript').Expression | undefined} expr
 * @param {import('typescript').TypeChecker | null} checker
 */
function collectStringsFromExpr(expr, checker) {
  /** @type {{ statics: Set<string>, globs: Set<string> }} */
  const out = { statics: new Set(), globs: new Set() };
  if (!expr) {
    return out;
  }

  const visit = (e) => {
    if (!e) {
      return;
    }
    if (ts.isStringLiteral(e) || ts.isNoSubstitutionTemplateLiteral(e)) {
      out.statics.add(e.text);
      return;
    }
    if (ts.isTemplateExpression(e)) {
      let glob = '';
      glob += e.head.text;
      for (const span of e.templateSpans) {
        glob += '*';
        glob += span.literal.text;
      }
      if (glob.includes('*')) {
        out.globs.add(glob);
      } else {
        out.statics.add(glob);
      }
      return;
    }
    if (
      ts.isBinaryExpression(e) &&
      e.operatorToken.kind === ts.SyntaxKind.QuestionQuestionToken
    ) {
      visit(e.left);
      visit(e.right);
      return;
    }
    if (
      ts.isBinaryExpression(e) &&
      e.operatorToken.kind === ts.SyntaxKind.BarBarToken
    ) {
      visit(e.left);
      visit(e.right);
      return;
    }
    if (ts.isParenthesizedExpression(e)) {
      visit(e.expression);
      return;
    }
    if (ts.isConditionalExpression(e)) {
      visit(e.whenTrue);
      visit(e.whenFalse);
      return;
    }
    if (checker && ts.isIdentifier(e)) {
      const t = checker.getTypeAtLocation(e);
      if (t.isStringLiteral()) {
        out.statics.add(t.value);
      }
    }
  };

  visit(expr);
  return out;
}

/**
 * @param {string} filePath
 * @param {string} sourceText
 * @param {boolean} isTsx
 */
function createAst(filePath, sourceText, isTsx) {
  return ts.createSourceFile(
    filePath,
    sourceText,
    ts.ScriptTarget.Latest,
    true,
    isTsx ? ts.ScriptKind.TSX : ts.ScriptKind.TS,
  );
}

/**
 * @param {import('typescript').SourceFile} sf
 * @param {import('typescript').TypeChecker | null} checker
 */
function extractAppTestIds(sf, checker) {
  /** @type {{ statics: Set<string>, globs: Set<string> }} */
  const out = { statics: new Set(), globs: new Set() };
  const merge = (a) => {
    for (const s of a.statics) {
      out.statics.add(s);
    }
    for (const g of a.globs) {
      out.globs.add(g);
    }
  };

  const visit = (node) => {
    const jsxAttrName = ts.isJsxAttribute(node) ? node.name.getText(sf) : '';
    const isTestIdAttr =
      jsxAttrName === 'data-testid' || jsxAttrName === 'dataTestId';
    if (ts.isJsxAttribute(node) && isTestIdAttr && node.initializer) {
      const init = node.initializer;
      if (
        ts.isStringLiteral(init) ||
        ts.isNoSubstitutionTemplateLiteral(init)
      ) {
        out.statics.add(init.text);
      } else if (ts.isJsxExpression(init)) {
        merge(collectStringsFromExpr(init.expression, checker));
      }
    }
    if (ts.isPropertyAssignment(node)) {
      const name = node.name;
      const key =
        ts.isIdentifier(name) && name.text === 'dataTestId'
          ? 'dataTestId'
          : ts.isStringLiteral(name) && name.text === 'data-testid'
            ? 'data-testid'
            : ts.isIdentifier(name) && name.text === 'data_testid'
              ? 'data_testid'
              : null;
      if (key !== null) {
        merge(collectStringsFromExpr(node.initializer, checker));
      }
    }
    ts.forEachChild(node, visit);
  };

  visit(sf);
  return out;
}

/**
 * @param {import('typescript').Node} callee
 * @param {import('typescript').SourceFile} sf
 */
function isGetByTestIdCallee(callee, sf) {
  const t = callee.getText(sf);
  return (
    t.endsWith('.getByTestId') ||
    t.endsWith('getByTestId') ||
    t === 'getByTestId'
  );
}

/**
 * @param {import('typescript').SourceFile} sf
 * @param {import('typescript').TypeChecker | null} checker
 */
function extractE2eTestIdRefs(sf, checker) {
  /** @type {{ statics: Set<string>, globs: Set<string> }} */
  const out = { statics: new Set(), globs: new Set() };
  const merge = (a) => {
    for (const s of a.statics) {
      out.statics.add(s);
    }
    for (const g of a.globs) {
      out.globs.add(g);
    }
  };

  const visit = (node) => {
    if (
      ts.isCallExpression(node) &&
      isGetByTestIdCallee(node.expression, sf) &&
      node.arguments[0]
    ) {
      merge(collectStringsFromExpr(node.arguments[0], checker));
    }
    if (
      ts.isCallExpression(node) &&
      ts.isPropertyAccessExpression(node.expression)
    ) {
      const prop = node.expression.name.text;
      if (
        prop === 'locator' &&
        node.arguments[0] &&
        ts.isStringLiteral(node.arguments[0])
      ) {
        const m = node.arguments[0].text.match(
          /\[data-testid=["']([^"']+)["']\]/,
        );
        if (m) {
          out.statics.add(m[1]);
        }
      }
    }
    ts.forEachChild(node, visit);
  };

  visit(sf);
  return out;
}

/** @param {import('typescript').SourceFile} sf */
function extractFeatureName(sf) {
  let feature = null;
  const visit = (node) => {
    if (feature) {
      return;
    }
    if (!ts.isCallExpression(node)) {
      ts.forEachChild(node, visit);
      return;
    }
    const callee = node.expression;
    const calleeText = callee.getText(sf);
    const isDescribe =
      calleeText === 'test.describe' ||
      calleeText.endsWith('.describe') ||
      calleeText === 'test.describe.parallel' ||
      calleeText.endsWith('.describe.parallel') ||
      calleeText.endsWith('.describe.serial') ||
      calleeText.endsWith('.describe.only') ||
      calleeText.endsWith('.describe.skip');
    if (isDescribe && node.arguments[0]) {
      const a0 = node.arguments[0];
      if (ts.isStringLiteral(a0) || ts.isNoSubstitutionTemplateLiteral(a0)) {
        feature = a0.text;
        return;
      }
    }
    ts.forEachChild(node, visit);
  };
  visit(sf);
  return feature;
}

/** @param {import('typescript').SourceFile} sf */
function countParametrizedRows(sf) {
  let rows = 1;
  const visit = (node) => {
    if (!ts.isCallExpression(node)) {
      ts.forEachChild(node, visit);
      return;
    }
    const callee = node.expression.getText(sf);
    const isEach =
      callee === 'test.each' ||
      callee.endsWith('.each') ||
      callee === 'test.describe.each' ||
      callee.endsWith('.describe.each');
    if (isEach && node.arguments[0]) {
      const a0 = node.arguments[0];
      if (ts.isArrayLiteralExpression(a0)) {
        rows = Math.max(rows, a0.elements.length);
      } else if (ts.isNoSubstitutionTemplateLiteral(a0)) {
        const lineCount = a0.text
          .split('\n')
          .filter((l) => l.trim().length > 0).length;
        rows = Math.max(rows, Math.max(1, lineCount - 1));
      }
    }
    ts.forEachChild(node, visit);
  };
  visit(sf);
  return rows;
}

/** @param {import('typescript').SourceFile} sf */
function fileContainsJsx(sf) {
  let found = false;
  const visit = (node) => {
    if (found) {
      return;
    }
    if (
      ts.isJsxElement(node) ||
      ts.isJsxSelfClosingElement(node) ||
      ts.isJsxFragment(node) ||
      ts.isJsxExpression(node)
    ) {
      found = true;
      return;
    }
    ts.forEachChild(node, visit);
  };
  visit(sf);
  return found;
}

/**
 * Tokens used to match spec titles to a pages/* top-level folder name (e.g. SwapPage → swap, swappage).
 * @param {string} dirName
 */
function featureDirMatchTokens(dirName) {
  const normalized = dirName.replace(/([a-z])([A-Z])/g, '$1 $2').toLowerCase();
  const words = normalized.split(/[\s-_]+/).filter((w) => w.length > 0);
  const tokens = new Set([dirName.toLowerCase(), ...words]);
  if (words.length > 1) {
    tokens.add(words.join(''));
  }
  return [...tokens].filter(
    (t) => t.length >= 3 && !GENERIC_FEATURE_TOKENS.has(t),
  );
}

/**
 * String titles from test / noExtTest / extensionTest and .describe / .skip / .only (first arg when it is a string).
 * @param {import('typescript').SourceFile} sf
 */
function collectPlaywrightTestAndDescribeTitles(sf) {
  /** @type {string[]} */
  const titles = [];
  const testLikeIds = new Set(['test', 'it', 'noExtTest', 'extensionTest']);

  const visit = (node) => {
    if (!ts.isCallExpression(node) || !node.arguments[0]) {
      ts.forEachChild(node, visit);
      return;
    }
    const a0 = node.arguments[0];
    if (!ts.isStringLiteral(a0) && !ts.isNoSubstitutionTemplateLiteral(a0)) {
      ts.forEachChild(node, visit);
      return;
    }
    const title = a0.text;
    const callee = node.expression;
    let take = false;
    if (ts.isIdentifier(callee) && testLikeIds.has(callee.text)) {
      take = true;
    } else if (ts.isPropertyAccessExpression(callee)) {
      const obj = callee.expression;
      const prop = callee.name.text;
      const objText = ts.isIdentifier(obj) ? obj.text : '';
      if (prop === 'describe' && testLikeIds.has(objText)) {
        take = true;
      } else if (
        testLikeIds.has(objText) &&
        ['skip', 'only', 'fixme'].includes(prop)
      ) {
        take = true;
      }
    }
    if (take) {
      titles.push(title);
    }
    ts.forEachChild(node, visit);
  };
  visit(sf);
  return titles;
}

/**
 * Shared "swap" token can match both `pages/Fusion` and `pages/Swap`; drop Fusion unless the spec hints at fusion swap.
 * @param {Set<string>} dirs
 * @param {string[]} corpusParts
 */
function dedupeFusionSwapFolders(dirs, corpusParts) {
  const c = corpusParts.join(' ').toLowerCase();
  if (dirs.has('Fusion') && dirs.has('Swap')) {
    const fusionHint =
      /\bfusion\b/.test(c) ||
      /\bjupiter\b/.test(c) ||
      /\bparaswap\b/i.test(c) ||
      /\bmarkr\b/i.test(c);
    if (!fusionHint) {
      dirs.delete('Fusion');
    }
  }
}

/**
 * Extension UI: network management lives under `pages/Settings`, but specs often mention “Portfolio”.
 * Onboarding specs can spuriously match `KeystoneUsb` from unrelated copy.
 * @param {string} specAbsPath
 * @param {string} specText
 * @param {Set<string>} matchedFeatureDirs
 * @param {Map<string, { statics: Set<string>, globs: Set<string> }>} featureToTestIds
 */
function refinePagesFolderMatchesForExtension(
  specAbsPath,
  specText,
  matchedFeatureDirs,
  featureToTestIds,
) {
  const rel = specAbsPath.replaceAll('\\', '/');
  const fullLower = specText.toLowerCase();

  if (
    /networks\.spec\.(ts|tsx)$/.test(rel) ||
    /\bnetworkspage\b/i.test(fullLower)
  ) {
    matchedFeatureDirs.delete('Portfolio');
    if (featureToTestIds.has('Settings')) {
      matchedFeatureDirs.add('Settings');
    }
  }

  if (
    /onboarding\.spec\.(ts|tsx)$/.test(rel) ||
    /analytics\.spec\.(ts|tsx)$/.test(rel)
  ) {
    matchedFeatureDirs.delete('KeystoneUsb');
  }
}

/**
 * Match feature folders to spec text. `minTokenLen` avoids short tokens ("swap") matching many dirs on long corpora.
 * @param {Map<string, { statics: Set<string>, globs: Set<string> }>} featureToTestIds
 * @param {string[]} corpusParts
 * @param {{ minTokenLen?: number }} [opts]
 */
function inferMatchedFeatureDirs(featureToTestIds, corpusParts, opts = {}) {
  const minTokenLen = opts.minTokenLen ?? 4;
  const corpus = corpusParts.join(' ').toLowerCase();
  const matched = new Set();
  for (const dir of featureToTestIds.keys()) {
    if (AMBIGUOUS_FEATURE_DIRS.has(dir)) {
      continue;
    }
    const dirLower = dir.toLowerCase();
    if (dirLower.length >= 8 && corpus.includes(dirLower)) {
      matched.add(dir);
      continue;
    }
    for (const tok of featureDirMatchTokens(dir)) {
      if (tok.length < minTokenLen) {
        continue;
      }
      try {
        const re = new RegExp(
          `\\b${tok.replace(/[.*+?^${}()|[\]\\]/g, '\\$&')}\\b`,
          'i',
        );
        if (re.test(corpus)) {
          matched.add(dir);
          break;
        }
      } catch {}
    }
  }
  return matched;
}

/**
 * @param {Map<string, { statics: Set<string>, globs: Set<string> }>} featureToTestIds
 * @param {Set<string>} featureDirs
 */
function mergeAttributedTestIds(featureToTestIds, featureDirs) {
  /** @type {{ statics: Set<string>, globs: Set<string> }} */
  const out = { statics: new Set(), globs: new Set() };
  for (const d of featureDirs) {
    const b = featureToTestIds.get(d);
    if (!b) {
      continue;
    }
    for (const s of b.statics) {
      out.statics.add(s);
    }
    for (const g of b.globs) {
      out.globs.add(g);
    }
  }
  return out;
}

/**
 * @param {string} fromFile
 * @param {string} specifier
 * @param {string} e2eRoot
 */
function resolveE2eRelative(fromFile, specifier, e2eRoot) {
  if (!specifier.startsWith('.')) {
    return null;
  }
  const base = path.resolve(path.dirname(fromFile), specifier);
  const trials = [
    base,
    `${base}.ts`,
    `${base}.tsx`,
    path.join(base, 'index.ts'),
    path.join(base, 'index.tsx'),
  ];
  for (const p of trials) {
    const norm = path.normalize(p);
    if (!isPathWithinRoot(e2eRoot, norm)) {
      return null;
    }
    if (fs.existsSync(norm) && fs.statSync(norm).isFile()) {
      return norm;
    }
  }
  return null;
}

/**
 * @param {string} entrySpec
 * @param {string} e2eRoot
 * @param {string[]} [extraEntryFiles] Absolute paths under e2eRoot (e.g. shared page objects for ledger specs).
 */
function transitiveE2eModuleSet(entrySpec, e2eRoot, extraEntryFiles = []) {
  const files = new Set();
  const queue = [entrySpec, ...extraEntryFiles];
  while (queue.length) {
    const f = queue.pop();
    if (!f || files.has(f)) {
      continue;
    }
    if (!isPathWithinRoot(e2eRoot, f)) {
      continue;
    }
    if (!fs.existsSync(f)) {
      continue;
    }
    files.add(f);
    const text = readSource(f);
    const sf = createAst(f, text, f.endsWith('tsx'));
    for (const stmt of sf.statements) {
      if (
        !ts.isImportDeclaration(stmt) ||
        !stmt.moduleSpecifier ||
        !ts.isStringLiteral(stmt.moduleSpecifier)
      ) {
        continue;
      }
      const spec = stmt.moduleSpecifier.text;
      const resolved = resolveE2eRelative(f, spec, e2eRoot);
      if (resolved) {
        queue.push(resolved);
      }
    }
  }
  return files;
}

/**
 * @param {string} e2eId
 * @param {{ statics: Set<string>, globs: Set<string> }} app
 */
function appDefinesTestId(e2eId, app) {
  if (app.statics.has(e2eId)) {
    return true;
  }
  for (const g of app.globs) {
    if (globToRegExp(g).test(e2eId)) {
      return true;
    }
  }
  return false;
}

/**
 * @param {string} appId
 * @param {{ statics: Set<string>, globs: Set<string> }} e2e
 */
function e2eTouchesAppStaticId(appStaticId, e2e) {
  if (e2e.statics.has(appStaticId)) {
    return true;
  }
  for (const eg of e2e.globs) {
    if (globToRegExp(eg).test(appStaticId)) {
      return true;
    }
  }
  return false;
}

/**
 * App-side template bucket `foo-*-bar` is covered if some concrete e2e string matches it.
 * @param {string} appGlob
 * @param {{ statics: Set<string>, globs: Set<string> }} e2e
 */
function appPatternTouchedByE2e(appGlob, e2e) {
  const re = globToRegExp(appGlob);
  for (const s of e2e.statics) {
    if (re.test(s)) {
      return true;
    }
  }
  return false;
}

/**
 * @param {{ statics: Set<string>, globs: Set<string> }} appIds
 * @param {{ statics: Set<string>, globs: Set<string> }} e2e
 */
function partitionAppCoverage(appIds, e2e) {
  const coveredStatics = [];
  const uncoveredStatics = [];
  for (const id of appIds.statics) {
    if (e2eTouchesAppStaticId(id, e2e)) {
      coveredStatics.push(id);
    } else {
      uncoveredStatics.push(id);
    }
  }
  const coveredGlobs = [];
  const uncoveredGlobs = [];
  for (const g of appIds.globs) {
    if (appPatternTouchedByE2e(g, e2e)) {
      coveredGlobs.push(g);
    } else {
      uncoveredGlobs.push(g);
    }
  }
  const denominator = appIds.statics.size + appIds.globs.size;
  const numerator = coveredStatics.length + coveredGlobs.length;
  return {
    coveredStatics,
    uncoveredStatics,
    coveredGlobs,
    uncoveredGlobs,
    numerator,
    denominator,
  };
}

/**
 * % of top-level `apps/next/src/pages/<Name>` folders that declare at least one testid and are "hit" by global e2e.
 * @param {Map<string, { statics: Set<string>, globs: Set<string> }>} featureToTestIds
 * @param {{ statics: Set<string>, globs: Set<string> }} globalE2e
 */
function computeComponentFeatureFolderCoverage(featureToTestIds, globalE2e) {
  const totalTopLevelFolders = featureToTestIds.size;
  let foldersWithDeclaredTestIds = 0;
  let foldersTouchedByE2e = 0;
  /** @type {string[]} */
  const uncoveredFolders = [];
  for (const [dir, bucket] of featureToTestIds) {
    if (bucket.statics.size === 0 && bucket.globs.size === 0) {
      continue;
    }
    foldersWithDeclaredTestIds++;
    let hit = false;
    for (const id of bucket.statics) {
      if (e2eTouchesAppStaticId(id, globalE2e)) {
        hit = true;
        break;
      }
    }
    if (!hit) {
      for (const g of bucket.globs) {
        if (appPatternTouchedByE2e(g, globalE2e)) {
          hit = true;
          break;
        }
      }
    }
    if (hit) {
      foldersTouchedByE2e++;
    } else {
      uncoveredFolders.push(dir);
    }
  }
  const pctAmongDeclared =
    foldersWithDeclaredTestIds === 0
      ? 0
      : (foldersTouchedByE2e / foldersWithDeclaredTestIds) * 100;
  const foldersWithNoTestIdsDeclared =
    totalTopLevelFolders - foldersWithDeclaredTestIds;
  const pctOfAllAppAreasWithTestIds =
    totalTopLevelFolders === 0
      ? 0
      : (foldersWithDeclaredTestIds / totalTopLevelFolders) * 100;
  const pctOfAllAppAreasTouchedByE2e =
    totalTopLevelFolders === 0
      ? 0
      : (foldersTouchedByE2e / totalTopLevelFolders) * 100;
  return {
    totalTopLevelFolders,
    foldersWithDeclaredTestIds,
    foldersWithNoTestIdsDeclared,
    foldersTouchedByE2e,
    percentAmongFoldersWithTestIds: Math.round(pctAmongDeclared * 100) / 100,
    percentOfAllComponentAreasWithDeclaredTestIds:
      Math.round(pctOfAllAppAreasWithTestIds * 100) / 100,
    percentOfAllComponentAreasTouchedByE2e:
      Math.round(pctOfAllAppAreasTouchedByE2e * 100) / 100,
    uncoveredFoldersWithTestIds: uncoveredFolders.sort(),
  };
}

function filterIgnoredOrphans(ids, ignored) {
  const ig = new Set(ignored);
  return ids.filter((id) => !ig.has(id));
}

async function main() {
  const opts = parseArgs(process.argv);
  const e2eRootNorm = path.normalize(opts.e2eDir);
  const coverageConfig = loadCoverageConfig(opts.e2eDir);
  const requiredScenariosCfg = loadRequiredScenariosConfig(opts.e2eDir);
  const coverageModelCfg = loadCoverageModelConfig(opts.e2eDir);
  const requiredScenarioMatrix = computeRequiredScenarioMatrix(
    opts.e2eDir,
    requiredScenariosCfg,
  );
  const appFiles = [];
  for (const root of opts.appRoots) {
    walkTsFiles(root, appFiles, { app: true });
  }
  const specFiles = [];
  walkTsFiles(path.join(opts.e2eDir, 'tests'), specFiles, { app: false });
  const specs = specFiles.filter(
    (f) => f.endsWith('.spec.ts') || f.endsWith('.spec.tsx'),
  );
  const repoTestRailIds = collectAllRepoTestRailIds(
    path.join(opts.e2eDir, 'tests'),
  );

  const ledgerExtraAbs = resolveE2eExtraModules(
    e2eRootNorm,
    coverageConfig.ledgerSpecAdditionalModules,
  );

  /** @type {{ statics: Set<string>, globs: Set<string> }} */
  const appIds = { statics: new Set(), globs: new Set() };
  const program = ts.createProgram(appFiles, {
    target: ts.ScriptTarget.Latest,
    allowJs: true,
    jsx: ts.JsxEmit.React,
  });
  const appChecker = program.getTypeChecker();

  const pagesFeatureRoot = featureAreasRoot();
  /** @type {Map<string, { statics: Set<string>, globs: Set<string> }>} */
  const featureToTestIds = new Map();
  let componentTsxWithJsx = 0;
  let componentTsxWithJsxNoTestId = 0;

  for (const f of appFiles) {
    const sf = program.getSourceFile(f);
    if (!sf) {
      continue;
    }
    const part = extractAppTestIds(sf, appChecker);
    for (const s of part.statics) {
      appIds.statics.add(s);
    }
    for (const g of part.globs) {
      appIds.globs.add(g);
    }

    const normF = path.normalize(f);
    if (normF.startsWith(pagesFeatureRoot) && f.endsWith('.tsx')) {
      const rel = path.relative(pagesFeatureRoot, f);
      const top = rel.split(path.sep)[0];
      if (top && !top.startsWith('.')) {
        if (!featureToTestIds.has(top)) {
          featureToTestIds.set(top, { statics: new Set(), globs: new Set() });
        }
        const bucket = featureToTestIds.get(top);
        for (const s of part.statics) {
          bucket.statics.add(s);
        }
        for (const g of part.globs) {
          bucket.globs.add(g);
        }
      }
      if (fileContainsJsx(sf)) {
        componentTsxWithJsx++;
        if (part.statics.size === 0 && part.globs.size === 0) {
          componentTsxWithJsxNoTestId++;
        }
      }
    }
  }

  /** @type {typeof appIds} */
  const globalE2e = { statics: new Set(), globs: new Set() };
  const perFeature = [];
  /** Union of apps/next/src/pages/* folder names matched by any spec (stem/describe/titles). */
  const featureAreasClaimedByE2e = new Set();

  /** @type {Map<string, Set<string>>} */
  const modulesBySpec = new Map();
  /** @type {Set<string>} */
  const allE2eModules = new Set();
  for (const spec of specs) {
    const extraLedger = isLedgerSpecFile(spec) ? ledgerExtraAbs : [];
    const modules = transitiveE2eModuleSet(spec, e2eRootNorm, extraLedger);
    modulesBySpec.set(spec, modules);
    for (const m of modules) {
      allE2eModules.add(m);
    }
  }

  const sharedE2eProgram =
    allE2eModules.size > 0
      ? ts.createProgram([...allE2eModules], {
          target: ts.ScriptTarget.Latest,
          allowJs: true,
        })
      : null;
  const sharedE2eChecker = sharedE2eProgram
    ? sharedE2eProgram.getTypeChecker()
    : null;
  /** @type {Map<string, ReturnType<typeof extractE2eTestIdRefs>>} */
  const e2eModuleRefsCache = new Map();
  if (sharedE2eProgram && sharedE2eChecker) {
    for (const m of allE2eModules) {
      const sf = sharedE2eProgram.getSourceFile(m);
      if (!sf) {
        continue;
      }
      e2eModuleRefsCache.set(m, extractE2eTestIdRefs(sf, sharedE2eChecker));
    }
  }

  for (const spec of specs) {
    const modules = modulesBySpec.get(spec) ?? new Set();
    /** @type {typeof appIds} */
    const e2eUnion = { statics: new Set(), globs: new Set() };
    for (const m of modules) {
      const part = e2eModuleRefsCache.get(m);
      if (!part) {
        continue;
      }
      for (const s of part.statics) {
        e2eUnion.statics.add(s);
        globalE2e.statics.add(s);
      }
      for (const g of part.globs) {
        e2eUnion.globs.add(g);
        globalE2e.globs.add(g);
      }
    }

    const specText = readSource(spec);
    const specSf = createAst(spec, specText, spec.endsWith('tsx'));
    const baseName = path.basename(spec, path.extname(spec));
    const stem = baseName.replace(/\.spec$/i, '') || baseName;
    const describeTitle = extractFeatureName(specSf);
    const feature =
      describeTitle ??
      path.basename(spec, path.extname(spec)).replace(/\.spec$/, '');
    /** Primary: file stem + outermost describe title — enough to credit the intended feature without noisy cross-matches. */
    const primaryCorpus = [
      stem,
      ...(describeTitle ? [describeTitle] : []),
    ].filter(Boolean);
    const matchedPrimary = inferMatchedFeatureDirs(
      featureToTestIds,
      primaryCorpus,
      { minTokenLen: 4 },
    );
    /** Secondary: long tokens (≥8) from individual test titles only (reduces cross-folder "swap" noise). */
    const looseTitles = collectPlaywrightTestAndDescribeTitles(specSf).filter(
      (t) => t !== describeTitle,
    );
    const matchedLoose = inferMatchedFeatureDirs(
      featureToTestIds,
      looseTitles,
      { minTokenLen: 8 },
    );
    const matchedFeatureDirs = new Set([...matchedPrimary, ...matchedLoose]);
    dedupeFusionSwapFolders(matchedFeatureDirs, [
      stem,
      ...(describeTitle ? [describeTitle] : []),
      ...looseTitles,
    ]);
    refinePagesFolderMatchesForExtension(
      spec,
      specText,
      matchedFeatureDirs,
      featureToTestIds,
    );
    for (const d of matchedFeatureDirs) {
      featureAreasClaimedByE2e.add(d);
    }
    const attributed = mergeAttributedTestIds(
      featureToTestIds,
      matchedFeatureDirs,
    );
    let testIdsAddedByTitleAttribution = 0;
    for (const s of attributed.statics) {
      if (!e2eUnion.statics.has(s)) {
        testIdsAddedByTitleAttribution++;
      }
      e2eUnion.statics.add(s);
      globalE2e.statics.add(s);
    }
    for (const g of attributed.globs) {
      if (!e2eUnion.globs.has(g)) {
        testIdsAddedByTitleAttribution++;
      }
      e2eUnion.globs.add(g);
      globalE2e.globs.add(g);
    }

    const paramRows = countParametrizedRows(specSf);

    const { coveredStatics, coveredGlobs, numerator, denominator } =
      partitionAppCoverage(appIds, e2eUnion);
    const pct = denominator === 0 ? 0 : (numerator / denominator) * 100;

    const orphanE2e = filterIgnoredOrphans(
      [...e2eUnion.statics].filter((id) => !appDefinesTestId(id, appIds)),
      coverageConfig.ignoredOrphanTestIds,
    );

    perFeature.push({
      spec: path.relative(REPO_ROOT, spec),
      feature,
      parametrizedRows: paramRows,
      attributedFeatureDirs: [...matchedFeatureDirs].sort(),
      testIdsAddedByTitleAttribution,
      coveredStaticCount: coveredStatics.length,
      uncoveredStaticCount: appIds.statics.size - coveredStatics.length,
      coveredPatternCount: coveredGlobs.length,
      uncoveredPatternCount: appIds.globs.size - coveredGlobs.length,
      percent: Math.round(pct * 100) / 100,
      numerator,
      denominator,
      orphanE2eTestIds: orphanE2e,
    });
  }

  const globalPart = partitionAppCoverage(appIds, globalE2e);
  const gDenom = globalPart.denominator;
  const gNum = globalPart.numerator;
  const gPct = gDenom === 0 ? 0 : (gNum / gDenom) * 100;
  const surfaceGap = componentTsxWithJsxNoTestId;
  const featureFolderCov = computeComponentFeatureFolderCoverage(
    featureToTestIds,
    globalE2e,
  );

  const totalAppFeatureAreas = featureToTestIds.size;
  const featureAreasMatchedBySpecs = featureAreasClaimedByE2e.size;
  const e2eFeaturePercent =
    totalAppFeatureAreas === 0
      ? 0
      : (featureAreasMatchedBySpecs / totalAppFeatureAreas) * 100;
  const uncoveredFeatureAreas = [...featureToTestIds.keys()]
    .filter((k) => !featureAreasClaimedByE2e.has(k))
    .sort();

  const rawOrphans = [...globalE2e.statics]
    .filter((id) => !appDefinesTestId(id, appIds))
    .sort();
  const orphanE2eFiltered = filterIgnoredOrphans(
    rawOrphans,
    coverageConfig.ignoredOrphanTestIds,
  );

  /** @type {Record<string, unknown>} */
  let testRailReport = {
    repoAutomationIds: repoTestRailIds,
    note: 'IDs parsed from custom_automation_id:… in spec annotations. Compare to TestRail suite for manual-test gap.',
  };
  if (opts.testrail) {
    const trAuth = getTestRailAuth();
    const runIdEnv = process.env.TESTRAIL_RUN_ID;
    if (trAuth && runIdEnv) {
      const rx = await fetchTestRailRunExecution(
        trAuth.host,
        trAuth.authHeader,
        runIdEnv,
      );
      if (rx.ok) {
        const { ok: _ok, ...rest } = rx;
        testRailReport.testRailRunExecution = { ...rest, source: 'api' };
      } else {
        testRailReport.testRailRunExecutionFetchError = rx.error;
      }
    }
    if (!testRailReport.testRailRunExecution) {
      const refNorm = normalizeTestRailRunReference(
        loadTestRailRunReference(opts.e2eDir),
      );
      if (refNorm) {
        testRailReport.testRailRunExecution = {
          ...refNorm,
          source: 'e2e/testrail-run-reference.json',
        };
      }
    }
    if (!runIdEnv && !testRailReport.testRailRunExecution) {
      testRailReport.testRailRunExecutionHint =
        'Set TESTRAIL_RUN_ID (with TESTRAIL_HOST, TESTRAIL_USER, TESTRAIL_API_KEY) or add e2e/testrail-run-reference.json to report pass+fail vs total for a run (see testRailRunExecution).';
    }

    const projectId = process.env.TESTRAIL_PROJECT_ID;
    const suiteId = process.env.TESTRAIL_SUITE_ID;
    if (trAuth && projectId && suiteId) {
      const tr = await fetchTestRailSuiteAutomationIds();
      if (tr.ok) {
        const suiteSet = new Set(tr.suiteAutomationIds);
        const repoSet = new Set(repoTestRailIds);
        const inSuiteNotInRepo = tr.suiteAutomationIds.filter(
          (id) => !repoSet.has(id),
        );
        const inRepoNotInSuite = repoTestRailIds.filter(
          (id) => !suiteSet.has(id),
        );
        testRailReport = {
          ...testRailReport,
          fetchOk: true,
          suiteAutomationIds: tr.suiteAutomationIds,
          inSuiteNotAutomatedInRepo: inSuiteNotInRepo,
          inRepoNotInSuite,
          suiteTotalWithAutomationField: tr.suiteAutomationIds.length,
        };
      } else {
        testRailReport = {
          ...testRailReport,
          fetchOk: false,
          fetchError: tr.error,
        };
      }
    } else {
      testRailReport.suiteFetchSkipped =
        'Set TESTRAIL_PROJECT_ID and TESTRAIL_SUITE_ID (with host/user/key) to compare suite automation IDs to the repo.';
    }
  } else {
    testRailReport = {
      ...testRailReport,
      fetchSkipped:
        'Pass --testrail and set TESTRAIL_* env vars for TestRail comparison (run execution and/or suite).',
    };
  }

  const walletModesAssumed = Math.max(
    1,
    requiredScenariosCfg.walletModes.length,
  );
  const featureWalletSlotsTotal = totalAppFeatureAreas * walletModesAssumed;
  const featureWalletSlotsFilledAssumption = featureAreasMatchedBySpecs;
  const featureWalletSlotPercent =
    featureWalletSlotsTotal === 0
      ? 0
      : Math.round(
          (featureWalletSlotsFilledAssumption / featureWalletSlotsTotal) *
            10000,
        ) / 100;

  const featureCoveragePercent = Math.round(e2eFeaturePercent * 100) / 100;
  const requiredScenariosPercent = requiredScenarioMatrix.percent;
  const wModel = coverageModelCfg.weights;
  const codebaseCompositePercent =
    Math.round(
      (wModel.e2eFeatureCoveragePercent * featureCoveragePercent +
        wModel.requiredScenariosPercent * requiredScenariosPercent +
        wModel.featureFolderWalletSlotPercent * featureWalletSlotPercent) *
        100,
    ) / 100;

  const report = {
    metricsExplainer: {
      allAppFeatureAreas: {
        jsonPath: 'e2eFeatureCoverage',
        ignoresWalletType: true,
        description:
          'Primary breadth metric: share of top-level apps/next/src/pages/* folders that match at least one Playwright spec (file stem, describe, test titles). Wallet type is not considered. Includes non-transaction surfaces (e.g. onboarding, settings) when specs attribute to those folders.',
      },
      walletModeMatrix: {
        jsonPath: 'requiredScenarios',
        description:
          'Supplemental metric only: flow × wallet-mode cells from e2e/required-scenarios.config.json. Does not measure coverage of wallet-agnostic features; it is not a substitute for e2eFeatureCoverage.percent.',
      },
      codebaseComposite: {
        jsonPath: 'codebaseCompositeCoverage',
        description:
          'Headline % from codebase only: weighted sum of e2eFeatureCoverage.percent, requiredScenarios.percent, and featureFolderWalletSlotAssumption.percent (see e2e/coverage-model.config.json). Not derived from TestRail. Treat impliedUncertaintyPercentagePoints as approximate band (e.g. ±10).',
      },
      testRailRunView: {
        jsonPath: 'testrail.testRailRunExecution',
        description:
          'Optional manual cross-check only (--testrail / reference file). Not used in codebaseCompositeCoverage.',
      },
      aggressiveWalletSlots: {
        jsonPath: 'featureFolderWalletSlotAssumption',
        description:
          'Harsh lower bound: every pages/* folder ×N wallet slots (N = walletModes in required-scenarios.config.json); one slot per matched folder. Often low double digits %.',
      },
    },
    e2eFeatureCoverage: {
      definition:
        'Share of top-level apps/next/src/pages/* folders associated with at least one Playwright spec via file stem, test.describe title, or test() titles (word/token match). Not based on data-testid. Wallet type is not part of this percentage.',
      totalAppFeatureAreas,
      featureAreasMatchedByAtLeastOneSpec: featureAreasMatchedBySpecs,
      percent: featureCoveragePercent,
      uncoveredFeatureAreas,
      playwrightSpecFiles: specs.length,
    },
    featureFolderWalletSlotAssumption: {
      definition: `Aggressive model: assumes each top-level apps/next/src/pages/* folder should be covered under ${walletModesAssumed} wallet modes; credits one slot per folder that has any spec match (typically mnemonic-heavy). Denominator = folders×${walletModesAssumed}.`,
      walletModesAssumed,
      totalSlots: featureWalletSlotsTotal,
      filledSlotsCredited: featureWalletSlotsFilledAssumption,
      percent: featureWalletSlotPercent,
    },
    appRoots: opts.appRoots.map((p) => path.relative(REPO_ROOT, p)),
    e2eDir: path.relative(REPO_ROOT, opts.e2eDir),
    config: {
      path: path.relative(
        REPO_ROOT,
        resolveE2eConfigPath(opts.e2eDir, 'testid-coverage.config.json'),
      ),
      ignoredOrphanTestIds: coverageConfig.ignoredOrphanTestIds,
      ledgerSpecAdditionalModules: coverageConfig.ledgerSpecAdditionalModules,
    },
    requiredScenarios: {
      definition:
        requiredScenariosCfg.definition ??
        'Supplemental: each configured product flow should have e2e under mnemonic (extension.fixture), seedless (seedless path/fixture/tags), and ledger (tests/ledger) where applicable. Orthogonal to e2eFeatureCoverage (all top-level pages/* folders).',
      configPath: path.relative(
        REPO_ROOT,
        resolveE2eConfigPath(opts.e2eDir, 'required-scenarios.config.json'),
      ),
      flows: requiredScenariosCfg.flows,
      walletModes: requiredScenariosCfg.walletModes,
      totalRequired: requiredScenarioMatrix.totalRequired,
      implementedCount: requiredScenarioMatrix.implementedCount,
      percent: requiredScenarioMatrix.percent,
      missing: requiredScenarioMatrix.missing,
      scenarios: requiredScenarioMatrix.scenarios,
    },
    codebaseCompositeCoverage: {
      definition:
        coverageModelCfg.definition ??
        'Codebase-only headline: weighted blend of feature-folder breadth, flow×wallet matrix completeness, and aggressive wallet×folder slots. Interpret as ± impliedUncertaintyPercentagePoints percentage points (model uncertainty, not external QA data).',
      configPath: path.relative(
        REPO_ROOT,
        resolveE2eConfigPath(opts.e2eDir, 'coverage-model.config.json'),
      ),
      formula: 'weightedSum',
      weights: coverageModelCfg.weights,
      impliedUncertaintyPercentagePoints:
        coverageModelCfg.impliedUncertaintyPercentagePoints,
      percent: codebaseCompositePercent,
      components: {
        e2eFeatureCoveragePercent: featureCoveragePercent,
        requiredScenariosPercent,
        featureFolderWalletSlotPercent: featureWalletSlotPercent,
      },
    },
    specs: perFeature.sort((a, b) => a.feature.localeCompare(b.feature)),
    testrail: testRailReport,
  };

  if (opts.testidInventory) {
    report.testidInventory = {
      totals: {
        appStaticTestIds: appIds.statics.size,
        appPatternTestIds: appIds.globs.size,
        denominator: gDenom,
        coveredStatic: globalPart.coveredStatics.length,
        coveredPattern: globalPart.coveredGlobs.length,
        numerator: gNum,
        percent: Math.round(gPct * 100) / 100,
        componentFeatureDirs: featureToTestIds.size,
        componentTsxFilesWithJsx: componentTsxWithJsx,
        componentTsxFilesWithJsxNoTestId: surfaceGap,
        surfaceNote:
          'TSX files under apps/next/src/pages with JSX but no data-testid/dataTestId in that file are not selectable by testid (coarse per-file signal; layouts may delegate testids to children).',
        featureAreasByTestid: {
          definition:
            'Top-level folder under apps/next/src/pages. "Touched" = global e2e references ≥1 testid (or pattern) declared under that folder.',
          totalTopLevelFolders: featureFolderCov.totalTopLevelFolders,
          foldersWithDeclaredTestIds:
            featureFolderCov.foldersWithDeclaredTestIds,
          foldersWithNoTestIdsDeclared:
            featureFolderCov.foldersWithNoTestIdsDeclared,
          foldersTouchedByGlobalE2e: featureFolderCov.foldersTouchedByE2e,
          percentAmongFoldersWithTestIds:
            featureFolderCov.percentAmongFoldersWithTestIds,
          percentOfAllComponentAreasWithDeclaredTestIds:
            featureFolderCov.percentOfAllComponentAreasWithDeclaredTestIds,
          percentOfAllComponentAreasTouchedByE2e:
            featureFolderCov.percentOfAllComponentAreasTouchedByE2e,
          uncoveredFoldersWithTestIds:
            featureFolderCov.uncoveredFoldersWithTestIds,
        },
        orphanE2eReferences: orphanE2eFiltered,
        ignoredOrphansExcludedFromReport: rawOrphans.filter((id) =>
          coverageConfig.ignoredOrphanTestIds.includes(id),
        ),
      },
      uncovered: {
        statics: globalPart.uncoveredStatics.sort(),
        patterns: globalPart.uncoveredGlobs.sort(),
      },
    };
  }

  if (opts.json) {
    process.stdout.write(`${JSON.stringify(report, null, 2)}\n`);
    return;
  }

  const lines = [];
  const fc = report.e2eFeatureCoverage;
  lines.push('E2E feature coverage (core-extension)');
  lines.push(
    `App roots: ${report.appRoots.join(', ')} | E2E: ${report.e2eDir}`,
  );
  lines.push(
    `Feature areas matched by Playwright specs: ${fc.featureAreasMatchedByAtLeastOneSpec}/${fc.totalAppFeatureAreas} (${fc.percent}%) — ${fc.playwrightSpecFiles} spec files`,
  );
  lines.push(
    'Heuristic: spec file stem + describe + test titles → top-level apps/next/src/pages/* folder names (see JSON definition).',
  );
  lines.push(
    '(Above % is wallet-agnostic — any feature folder touched by a spec counts, including non-transaction UI.)',
  );
  const rs = report.requiredScenarios;
  if (rs) {
    lines.push(
      `Required scenarios (flows × wallet, supplemental): ${rs.implementedCount}/${rs.totalRequired} (${rs.percent}%) — ${rs.configPath}`,
    );
    if (rs.missing?.length) {
      lines.push(`  missing: ${rs.missing.join(', ')}`);
    }
  }
  const cbc = report.codebaseCompositeCoverage;
  if (cbc) {
    lines.push(
      `Codebase composite coverage (headline): ${cbc.percent}% (±${cbc.impliedUncertaintyPercentagePoints} pp model uncertainty) — ${cbc.configPath}`,
    );
  }
  const fws = report.featureFolderWalletSlotAssumption;
  if (fws) {
    lines.push(
      `Aggressive wallet×folder slots (${fws.walletModesAssumed}× folders, mnemonic credit): ${fws.filledSlotsCredited}/${fws.totalSlots} (${fws.percent}%)`,
    );
  }
  if (!opts.testidInventory) {
    lines.push(
      'Add --testid-inventory for data-testid selector inventory (optional).',
    );
  }
  lines.push('');
  for (const row of report.specs) {
    const dirs = row.attributedFeatureDirs?.length
      ? row.attributedFeatureDirs.join(', ')
      : '(none)';
    lines.push(
      `${row.feature}  (${row.spec})  →  [${dirs}]  [param rows ≥ ${row.parametrizedRows}]`,
    );
    if (opts.testidInventory) {
      lines.push(
        `    testid buckets: ${row.numerator}/${row.denominator} = ${row.percent}%`,
      );
    }
    if (opts.verbose && row.orphanE2eTestIds?.length) {
      lines.push(
        `  orphan e2e refs (not in app): ${row.orphanE2eTestIds.join(', ')}`,
      );
    }
  }
  lines.push('');
  lines.push(`Uncovered feature folders (${fc.uncoveredFeatureAreas.length}):`);
  if (opts.verbose && fc.uncoveredFeatureAreas.length) {
    lines.push(fc.uncoveredFeatureAreas.join('\n'));
  }

  if (opts.testidInventory && report.testidInventory) {
    const ti = report.testidInventory;
    lines.push('');
    lines.push('--- testid inventory (optional) ---');
    lines.push(
      `Testid buckets: ${ti.totals.numerator}/${ti.totals.denominator} (${ti.totals.percent}%) — static: ${ti.totals.appStaticTestIds}, patterns: ${ti.totals.appPatternTestIds}`,
    );
    lines.push(
      `Surface gap (coarse): ${ti.totals.componentTsxFilesWithJsxNoTestId} TSX files under apps/next/src/pages have JSX but no testid in file (${ti.totals.componentTsxFilesWithJsx} jsx files total).`,
    );
    lines.push(
      `Feature areas (testid touch): ${ti.totals.featureAreasByTestid.totalTopLevelFolders} folders; ${ti.totals.featureAreasByTestid.foldersWithDeclaredTestIds} declare testids; e2e touches ${ti.totals.featureAreasByTestid.foldersTouchedByGlobalE2e} → ${ti.totals.featureAreasByTestid.percentOfAllComponentAreasTouchedByE2e}% of all areas by testid`,
    );
    lines.push(`Uncovered static ids (global): ${ti.uncovered.statics.length}`);
    if (opts.verbose && ti.uncovered.statics.length) {
      lines.push(ti.uncovered.statics.join('\n'));
    }
    lines.push(
      `Uncovered pattern buckets (global): ${ti.uncovered.patterns.length}`,
    );
    if (opts.verbose && ti.uncovered.patterns.length) {
      lines.push(ti.uncovered.patterns.join('\n'));
    }
    lines.push(
      `Orphan e2e refs (global, after config ignore): ${ti.totals.orphanE2eReferences.length}`,
    );
    if (opts.verbose && ti.totals.orphanE2eReferences.length) {
      lines.push(ti.totals.orphanE2eReferences.join('\n'));
    }
    if (ti.totals.ignoredOrphansExcludedFromReport.length) {
      lines.push(
        `Ignored orphans: ${ti.totals.ignoredOrphansExcludedFromReport.join(', ')}`,
      );
    }
  }

  lines.push('');
  const tr = report.testrail;
  if (tr.testRailRunExecution) {
    const tre = tr.testRailRunExecution;
    lines.push(
      `TestRail run ${tre.runId}: pass+fail ${tre.executedPassFailCount}/${tre.testsCount} (${tre.percentPassFailOfRunTests}%) — matches run view; source: ${tre.source}`,
    );
  }
  if (opts.testrail && tr.testRailRunExecutionFetchError) {
    lines.push(`TestRail get_run failed: ${tr.testRailRunExecutionFetchError}`);
  }
  if (opts.testrail && tr.testRailRunExecutionHint) {
    lines.push(String(tr.testRailRunExecutionHint));
  }
  lines.push(
    `TestRail automation IDs in repo (annotations): ${tr.repoAutomationIds?.length ?? 0}`,
  );
  if (tr.fetchOk) {
    lines.push(
      `TestRail suite IDs with automation field: ${tr.suiteTotalWithAutomationField} | in suite not in repo: ${tr.inSuiteNotAutomatedInRepo?.length ?? 0}`,
    );
  } else if (opts.testrail && tr.fetchError) {
    lines.push(`TestRail suite fetch failed: ${tr.fetchError}`);
  } else if (tr.fetchSkipped) {
    lines.push(String(tr.fetchSkipped));
  }
  if (opts.testrail && tr.suiteFetchSkipped) {
    lines.push(String(tr.suiteFetchSkipped));
  }

  process.stdout.write(`${lines.join('\n')}\n`);
}

main().catch((err) => {
  process.stderr.write(`${err instanceof Error ? err.stack : err}\n`);
  process.exit(1);
});
