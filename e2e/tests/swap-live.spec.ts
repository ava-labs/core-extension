/**
 * Swap Live Tests — Real API, Real Transactions
 *
 * Uses real swap APIs and executes actual on-chain transactions with tiny
 * amounts. Costs real fees.
 *
 * After each successful swap the test:
 *   1. Waits for the "Transaction successful" Sonner toast
 *   2. Extracts the tx hash from the explorer link's data-tx-hash attribute
 *   3. Verifies the transaction on-chain via RPC / Glacier / Etherscan / Solana RPC
 *
 * Run: npx playwright test swap-live --grep @smoke
 */

import { test, expect } from '../fixtures/extension.fixture';
import { SwapPage } from '../pages/extension/SwapPage';
import {
  SWAP_PAIRS,
  SWAP_TOKENS,
  SWAP_TIMEOUTS,
  type SwapChain,
} from '../types/swap';
import {
  verifyTransactionOnExplorer,
  type ExplorerNetwork,
} from '../helpers/explorerApi';

const CHAIN_TO_EXPLORER: Record<SwapChain, ExplorerNetwork> = {
  avalanche: 'Avalanche C-Chain',
  ethereum: 'Ethereum',
  solana: 'Solana',
  base: 'Base',
};

const ALL_PAIRS = Object.entries(SWAP_PAIRS);

test.describe('Swap Live', () => {
  for (const [key, pair] of ALL_PAIRS) {
    // AVAX_USDC is the canonical live smoke gate; all other live pairs
    // are gated behind @swap-live (only run on manual workflow dispatch).
    const tags: string[] =
      key === 'AVAX_USDC' ? ['@smoke', '@swap-live'] : ['@swap-live'];

    test(
      `${pair.from.symbol} → ${pair.to.symbol} (${pair.chain})`,
      {
        annotation: [
          { type: 'snapshot', description: 'mainnetPrimaryExtWallet' },
          {
            type: 'testrail_case_field',
            description: `custom_automation_id:SWP-LIVE-${key}`,
          },
        ],
        tag: tags,
      },
      async ({ unlockedExtensionPage }) => {
        test.setTimeout(SWAP_TIMEOUTS.TEST);

        const page = unlockedExtensionPage;
        const swapPage = new SwapPage(page);

        await swapPage.navigateToSwap({
          from: pair.from,
          to: pair.to,
        });
        await swapPage.waitForTokensLoaded();
        await swapPage.enterFromAmount(pair.amount);
        await swapPage.waitForQuote();

        await expect
          .poll(() => swapPage.isSwapButtonEnabled(), { timeout: 10_000 })
          .toBe(true);

        // Start listening for the success toast before clicking Swap,
        // so we don't miss optimistic confirmations (Avalanche C-Chain).
        const successToastPromise = swapPage.waitForSuccessToast(
          SWAP_TIMEOUTS.TRANSACTION,
        );

        await swapPage.clickSwap();
        await swapPage.handleApprovalFlow();

        // Wait for the success toast and extract tx hash
        const successToast = await successToastPromise;
        await expect(successToast).toContainText('Transaction successful');

        const txHash = await swapPage.getTxHashFromToast();

        if (pair.chain === 'solana') {
          expect(txHash.length).toBeGreaterThan(10);
        } else {
          expect(txHash).toMatch(/^0x[a-fA-F0-9]{64}$/);
        }

        // Verify the transaction on-chain
        await verifyTransactionOnExplorer(
          txHash,
          CHAIN_TO_EXPLORER[pair.chain],
          'Mainnet',
        );
      },
    );
  }
});

test.describe('Swap Live — Edge Cases', () => {
  test(
    'amount exceeds balance → swap disabled',
    {
      annotation: [
        { type: 'snapshot', description: 'mainnetPrimaryExtWallet' },
        {
          type: 'testrail_case_field',
          description: 'custom_automation_id:SWP-LIVE-ERR-BALANCE',
        },
      ],
      tag: '@swap-live',
    },
    async ({ unlockedExtensionPage }) => {
      test.setTimeout(SWAP_TIMEOUTS.TEST);

      const swapPage = new SwapPage(unlockedExtensionPage);
      await swapPage.navigateToSwap({
        from: SWAP_TOKENS.AVAX,
        to: SWAP_TOKENS.USDC_AVAX,
      });
      await swapPage.waitForTokensLoaded();
      await swapPage.enterFromAmount('999999');
      await unlockedExtensionPage.waitForTimeout(3000);

      await expect(swapPage.swapButton).toBeDisabled();
    },
  );
});
