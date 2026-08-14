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
 * Run: npx playwright test swap-live --grep @swap-live
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
import {
  attachGaslessSkipArtifacts,
  waitForSuccessOrGaslessFail,
} from '../helpers/gaslessHelpers';

const CHAIN_TO_EXPLORER: Record<SwapChain, ExplorerNetwork> = {
  avalanche: 'Avalanche C-Chain',
  ethereum: 'Ethereum',
  solana: 'Solana',
  base: 'Base',
};

const ALL_PAIRS = Object.entries(SWAP_PAIRS);

// TestRail automation_id mapping. Live cases occupy a separate range from
// the mock cases (see swap-mock.spec.ts) so each runtime keeps an
// independent pass/fail history. Adding a new pair to SWAP_PAIRS without an
// ID here will fail the `satisfies` check below.
const LIVE_PAIR_IDS = {
  AVAX_USDC: 'SWP-016',
  BLACK_AVAX: 'SWP-017',
  USDC_BLACK: 'SWP-018',
  ETH_LINK: 'SWP-019',
  LINK_ETH: 'SWP-020',
  LINK_USDC: 'SWP-021',
  SOL_FARTCOIN: 'SWP-022',
  FARTCOIN_SOL: 'SWP-023',
  ETH_BASE_USDC: 'SWP-024',
  AERO_BASE_ETH: 'SWP-025',
} as const satisfies Record<keyof typeof SWAP_PAIRS, string>;

test.describe('Swap Live', () => {
  for (const [key, pair] of ALL_PAIRS) {
    // All live pairs are gated behind @swap-live (only run on manual
    // workflow dispatch). AVAX_USDC was previously the @smoke gate but has
    // been temporarily removed from the smoke suite.
    const tags: string[] = ['@swap-live'];

    test(
      `${pair.from.symbol} → ${pair.to.symbol} (${pair.chain}) (live)`,
      {
        annotation: [
          { type: 'snapshot', description: 'mainnetPrimaryExtWallet' },
          {
            type: 'testrail_case_field',
            description: `custom_automation_id:${LIVE_PAIR_IDS[key as keyof typeof LIVE_PAIR_IDS]}`,
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

test.describe('Swap Live — Gasless', () => {
  test(
    'AVAX → USDC with gasless toggled on (live)',
    {
      annotation: [
        { type: 'snapshot', description: 'mainnetPrimaryExtWallet' },
        {
          type: 'testrail_case_field',
          description: 'custom_automation_id:SWP-026',
        },
      ],
      tag: '@swap-live',
    },
    async ({ unlockedExtensionPage }, testInfo) => {
      test.setTimeout(SWAP_TIMEOUTS.TEST);

      const pair = SWAP_PAIRS.AVAX_USDC;
      const swapPage = new SwapPage(unlockedExtensionPage);

      await swapPage.navigateToSwap({ from: pair.from, to: pair.to });
      await swapPage.waitForTokensLoaded();
      await swapPage.enterFromAmount(pair.amount);
      await swapPage.waitForQuote();

      await expect
        .poll(() => swapPage.isSwapButtonEnabled(), { timeout: 10_000 })
        .toBe(true);

      await swapPage.clickSwap();

      // Wait for the approval overlay, then try to enable gasless.
      // If the toggle isn't shown (eligibility/feature flag/etc.), continue
      // with the regular paid-fee approval path — same fallback shape used
      // by the Send tests (SND-002/SND-006).
      const overlayVisible = await swapPage.waitForApprovalOverlay(
        SWAP_TIMEOUTS.APPROVAL,
      );
      expect(overlayVisible).toBe(true);

      const gaslessVisible = await swapPage.isGaslessToggleVisible();

      // When gasless is on, race success vs "Gasless funding failed". When
      // Gas Station / App Check is having a transient hiccup, the funding
      // hook silently swallows the error and never submits — without this
      // race we'd time out for ~30s+ on the success toast and the approval
      // dialog would stay up indefinitely.
      const outcomePromise = gaslessVisible
        ? waitForSuccessOrGaslessFail(
            swapPage.getSuccessToast(),
            unlockedExtensionPage,
            SWAP_TIMEOUTS.TRANSACTION,
          )
        : swapPage
            .waitForSuccessToast(SWAP_TIMEOUTS.TRANSACTION)
            .then(() => 'success' as const);

      if (gaslessVisible) {
        await swapPage.toggleGaslessOn();
        await expect(swapPage.getGaslessCheckbox()).toBeChecked();
        // Wait for the SW to swap in the gasless tx data: the fee preset
        // selector disappears once gasless mode takes over, then give the
        // network fee widget a moment to settle before approving so we
        // don't fire the approve click against a stale (paid-fee) tx.
        await expect(swapPage.getFeePresetSelector()).not.toBeVisible({
          timeout: 10_000,
        });
        await unlockedExtensionPage.waitForTimeout(2000);

        // Single-click approve. For gasless, the SW relays the tx through
        // Gas Station and the approval dialog stays up for ~5-7s while it
        // finalizes. We rely on the success-vs-gasless-fail race above
        // instead of waitForApprovalDialogClose() because on funding failure
        // the dialog never closes.
        await swapPage.clickApprove();
      } else {
        testInfo.annotations.push({
          type: 'note',
          description:
            'SWP-026 (gasless): toggle not shown (eligibility / API); asserted paid-fee approval path.',
        });
        await swapPage.handleApprovalFlow();
      }

      const outcome = await outcomePromise;

      if (outcome === 'gasless-failed') {
        await attachGaslessSkipArtifacts(
          unlockedExtensionPage,
          testInfo,
          'SWP-026',
        );
        test.skip(
          true,
          'SWP-026: Gas Station gasless funding failed (transient infra issue); swap was not submitted.',
        );
      }

      expect(outcome, 'Neither success nor gasless-fail toast appeared').toBe(
        'success',
      );

      const successToast = swapPage.getSuccessToast();
      await expect(successToast).toContainText('Transaction successful');

      const txHash = await swapPage.getTxHashFromToast();
      expect(txHash).toMatch(/^0x[a-fA-F0-9]{64}$/);

      await verifyTransactionOnExplorer(
        txHash,
        CHAIN_TO_EXPLORER[pair.chain],
        'Mainnet',
      );
    },
  );
});

test.describe('Swap Live — Edge Cases', () => {
  test(
    'amount exceeds balance → swap disabled (live)',
    {
      annotation: [
        { type: 'snapshot', description: 'mainnetPrimaryExtWallet' },
        {
          type: 'testrail_case_field',
          description: 'custom_automation_id:SWP-027',
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
