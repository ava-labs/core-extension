import path from 'node:path';
import { REPO_ROOT } from './paths.mjs';
import { readSource, walkE2eSpecFiles } from './file-io.mjs';
export function specTextCoversFlow(flow, text) {
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

export function specUsesMnemonicExtensionFixture(text) {
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
export function computeRequiredScenarioMatrix(e2eDir, cfg) {
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
