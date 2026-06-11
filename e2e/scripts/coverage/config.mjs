import fs from 'node:fs';
import path from 'node:path';
import process from 'node:process';
import { REPO_ROOT, defaultAppRoots } from './paths.mjs';
export function parseArgs(argv) {
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
export function resolveE2eConfigPath(e2eDir, fileName) {
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
export function loadCoverageConfig(e2eDir) {
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
export function loadRequiredScenariosConfig(e2eDir) {
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
export function loadCoverageModelConfig(e2eDir) {
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
