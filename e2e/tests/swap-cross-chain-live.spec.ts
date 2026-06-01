/**
 * Swap Cross-Chain — Live
 *
 * Parametrized over `CROSS_CHAIN_SWAP_PAIRS` (12 pairs copied verbatim from
 * Core Web's `unifiedSwaps.spec.ts`). Each test:
 *
 *   1. Submits the swap + handles the approval dialog
 *   2. Lands on `/fusion-transfer/:id` and asserts source + target cards
 *   3. Verifies the Sonner success toast is NOT shown (cross-chain suppresses
 *      it via `surpressSuccessToast: true` in `buildRequestContext.ts`)
 *   4. Clicks "Notify me when it's done" → leaves the progress page
 *   5. Opens Notifications via the header bell → asserts the in-progress
 *      transfer is listed on both `All` and `Transactions` tabs
 *   6. Clicks the notification → returns to `/fusion-transfer/:id`
 *   7. Waits for both source + target status to reach `Complete`
 *      (fast-fails in ~3 s if source side reports Failed/Refunded)
 *   8. Verifies BOTH on-chain hashes via `verifyTransactionOnExplorer`
 *   9. Re-opens Notifications and asserts the completed-state icon
 *
 * Runtime: up to 20 min per pair. Excluded from the daily regression run;
 * opt in via the `include-cross-chain-swaps: true` dropdown in the
 * regression workflow.
 *
 * Skipped pairs (Core Web parity, documented in `e2e/types/swap.ts`):
 *   Ethereum-source, L2-source, subnet/L1 (JUICE/BLAZE), Lombard BTC↔BTC.b.
 */

import { test, expect } from '../fixtures/extension.fixture';
import {
  CrossChainSwapFailedError,
  SwapPage,
} from '../pages/extension/SwapPage';
import { NotificationsPage } from '../pages/extension/NotificationsPage';
import {
  CROSS_CHAIN_SWAP_PAIRS,
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

/**
 * Partial-match regex used against the source/target chain name in
 * `ChainStatusInfoBox`. The Fusion SDK reports a `chain.chainName` string
 * that can vary slightly between environments (e.g. `Avalanche C-Chain` vs
 * `Avalanche (C-Chain)`); matching the distinctive substring keeps the
 * assertion robust without losing precision.
 */
const CHAIN_NAME_PATTERN: Record<SwapChain, RegExp> = {
  avalanche: /Avalanche/i,
  ethereum: /Ethereum/i,
  solana: /Solana/i,
  base: /Base/i,
};

/**
 * TestRail automation_id mapping. Adding a pair to `CROSS_CHAIN_SWAP_PAIRS`
 * without an ID here will fail the `satisfies` check.
 */
const CROSS_CHAIN_LIVE_IDS = {
  AVAX_TO_ETH: 'XCS-001',
  AVAX_TO_ETH_BASE: 'XCS-002',
  AVAX_TO_SOL: 'XCS-003',
  USDC_AVAX_TO_ETH: 'XCS-004',
  USDC_AVAX_TO_ETH_BASE: 'XCS-005',
  USDC_AVAX_TO_SOL: 'XCS-006',
  SOL_TO_AVAX: 'XCS-007',
  SOL_TO_ETH: 'XCS-008',
  SOL_TO_ETH_BASE: 'XCS-009',
  USDC_SOL_TO_AVAX: 'XCS-010',
  USDC_SOL_TO_ETH_BASE: 'XCS-011',
  USDC_SOL_TO_ETH: 'XCS-012',
} as const satisfies Record<keyof typeof CROSS_CHAIN_SWAP_PAIRS, string>;

const ALL_PAIRS = Object.entries(CROSS_CHAIN_SWAP_PAIRS) as Array<
  [
    keyof typeof CROSS_CHAIN_SWAP_PAIRS,
    (typeof CROSS_CHAIN_SWAP_PAIRS)[keyof typeof CROSS_CHAIN_SWAP_PAIRS],
  ]
>;

test.describe('Swap Cross-Chain — Live', () => {
  // Never retry a 20-min cross-chain run (mirrors Core Web's
  // `test.describe.configure({ retries: 0 })` on `Unified Swaps - Cross Chain`).
  test.describe.configure({ retries: 0 });

  for (const [key, pair] of ALL_PAIRS) {
    test(
      `${pair.from.symbol} (${pair.from.chain}) → ${pair.to.symbol} (${pair.to.chain}) (live cross-chain)`,
      {
        annotation: [
          { type: 'snapshot', description: 'mainnetPrimaryExtWallet' },
          {
            type: 'testrail_case_field',
            description: `custom_automation_id:${CROSS_CHAIN_LIVE_IDS[key]}`,
          },
        ],
        tag: '@swap-cross-chain',
      },
      async ({ unlockedExtensionPage }, testInfo) => {
        // Budget covers both attempts when retry-on-revert fires.
        // (CROSS_CHAIN_TEST = 20 min; double = 40 min upper bound.)
        test.setTimeout(SWAP_TIMEOUTS.CROSS_CHAIN_TEST * 2);

        const swap = new SwapPage(unlockedExtensionPage);
        const notifs = new NotificationsPage(unlockedExtensionPage);

        /**
         * Runs the full submit → progress → notify-me → notifications →
         * back → wait-for-complete → on-chain verify → notifications
         * round-trip. Throws `CrossChainSwapFailedError` if either side
         * reports a terminal failure; we catch that one error class and
         * retry the same pair once (per Markr's revert behaviour — usually
         * a transient slippage / liquidity issue).
         */
        const runCrossChainSwap = async (): Promise<void> => {
          // ── 1. Quote + submit ───────────────────────────────────────
          await swap.navigateToSwap({ from: pair.from, to: pair.to });
          await swap.waitForTokensLoaded();
          await swap.enterFromAmount(pair.amount);
          await swap.waitForQuote();

          // Exchange rate is displayed: "1 {from} = {rate} {to}"
          // (rendered by ExchangeRate.tsx via i18n key
          // "1 {{from}} = <rate>{{rate}}</rate> {{to}}"). We don't validate the
          // rate value — quote drift is real — just the shape.
          await expect(
            unlockedExtensionPage.getByText(
              new RegExp(
                `1\\s+${pair.from.symbol}\\s*=\\s*[\\d.]+\\s+${pair.to.symbol}`,
                'i',
              ),
            ),
          ).toBeVisible({ timeout: 10_000 });

          await expect
            .poll(() => swap.isSwapButtonEnabled(), { timeout: 30_000 })
            .toBe(true);

          await swap.clickSwap();
          await swap.handleApprovalFlow();

          // ── 2. Cross-chain progress page (two-card UI) ─────────────
          const transferId = await swap.waitForCrossChainProgressPage();

          // Title — should be "Swap in progress..." while not yet concluded.
          await expect(swap.progressPageTitle(/swap in progress/i)).toBeVisible(
            { timeout: 10_000 },
          );

          await swap.assertSourceAndTargetCardsRendered({
            sourceChainName: CHAIN_NAME_PATTERN[pair.from.chain],
            targetChainName: CHAIN_NAME_PATTERN[pair.to.chain],
          });

          // Token-amount summary at top of the progress page. The destination
          // (`received`) row should show a positive amount of the target
          // token. The source (`paid`) row should show a negative amount of
          // the source token. Intermediate paid rows (Markr USDC pivot, etc.)
          // exist but we don't assert on them — only the user-visible
          // endpoints.
          // chainId disambiguates rows that share a symbol — e.g. a USDC →
          // SOL swap via Markr renders intermediate USDC on the destination
          // chain AND the source USDC on the source chain.
          const receivedAmount = await swap.getSwapSummaryAmountText({
            type: 'received',
            tokenSymbol: pair.to.symbol,
            chainId: pair.to.chainId,
          });
          expect(
            receivedAmount,
            `Destination summary row should show a positive ${pair.to.symbol} amount`,
          ).not.toMatch(/^-/);
          expect(receivedAmount).toMatch(/^[\d.]+/);

          const paidAmount = await swap.getSwapSummaryAmountText({
            type: 'paid',
            tokenSymbol: pair.from.symbol,
            chainId: pair.from.chainId,
          });
          expect(
            paidAmount,
            `Source summary row should show a negative ${pair.from.symbol} amount`,
          ).toMatch(/^-/);

          // ── 3. Regression guard: success toast suppressed for cross-chain
          await expect(swap.getSuccessToast()).toHaveCount(0, {
            timeout: 2_000,
          });

          // ── 4. Tap "Notify me when it's done" → leaves progress page ─
          await swap.clickNotifyMeWhenDone();
          await expect(unlockedExtensionPage).not.toHaveURL(
            /#\/fusion-transfer\//,
            { timeout: 5_000 },
          );

          // ── 5. Open Notifications via header bell ──────────────────
          await notifs.openFromHeader();

          // In-progress transfer visible on "All" + "Transactions" tabs
          await notifs.selectTab('All');
          await notifs.assertInProgressTransferVisible({
            transferId,
            sourceSymbol: pair.from.symbol,
            targetSymbol: pair.to.symbol,
          });

          await notifs.selectTab('Transactions');
          await notifs.assertInProgressTransferVisible({
            transferId,
            sourceSymbol: pair.from.symbol,
            targetSymbol: pair.to.symbol,
          });

          // ── 6. Click notification → deeplink back to progress page ─
          await notifs.clickTransferItem(transferId);
          await swap.waitForCrossChainProgressPage();

          // ── 7. Wait for both sides Complete (fast-fail in ~3 s) ────
          await swap.waitForCrossChainComplete();

          // Title transitions to "Swap successful!" once the SDK reports
          // `status: completed`. Catches a regression where the heading
          // doesn't flip from "Swap in progress..." even after both sides
          // complete (e.g. `getTransferDetailsTitle` mapping breaks).
          // Note: we intentionally do NOT assert the header unread badge in
          // this flow — `IssuedSwapDetails` calls `markAsRead(transfer.id)`
          // synchronously when the transfer concludes while the user is on
          // the progress page, so the badge clears before we could observe
          // it. A dedicated badge test would need to leave the progress page
          // before completion and poll Notifications externally.
          await expect(swap.progressPageTitle(/swap successful/i)).toBeVisible({
            timeout: 10_000,
          });

          // ── 8. Verify on-chain on both sides ───────────────────────
          const srcHash = await swap.getCrossChainTxHash('source');
          const dstHash = await swap.getCrossChainTxHash('destination');
          await verifyTransactionOnExplorer(
            srcHash,
            CHAIN_TO_EXPLORER[pair.from.chain],
            'Mainnet',
          );
          await verifyTransactionOnExplorer(
            dstHash,
            CHAIN_TO_EXPLORER[pair.to.chain],
            'Mainnet',
          );

          // ── 9. Notifications: completed-state icon ─────────────────
          // Click "Close" to dismiss the success page (real user action).
          // `goBack()` pops history back to wherever we came from — in our
          // flow that's `/notifications` (entered in step 5, transferred to
          // progress page in step 6). If history put us anywhere else, fall
          // back to the header bell. Either way, the completed-state icon
          // should be visible under the "Transactions" tab.
          await swap.clickCloseOnConcludedTransfer();

          if (!unlockedExtensionPage.url().includes('#/notifications')) {
            await notifs.openFromHeader();
          }

          await notifs.selectTab('Transactions');
          await notifs.assertCompletedTransferVisible({
            transferId,
            sourceSymbol: pair.from.symbol,
            targetSymbol: pair.to.symbol,
          });
        };

        // ── Retry loop ──────────────────────────────────────────────
        // A reverted source tx or refunded bridge typically reflects a
        // transient liquidity / slippage condition. Retry the SAME pair
        // once before giving up.
        const MAX_FAILURE_RETRIES = 1;
        for (let attempt = 0; attempt <= MAX_FAILURE_RETRIES; attempt += 1) {
          try {
            await runCrossChainSwap();
            break;
          } catch (err) {
            if (
              err instanceof CrossChainSwapFailedError &&
              attempt < MAX_FAILURE_RETRIES
            ) {
              const note =
                `[retry ${attempt + 1}/${MAX_FAILURE_RETRIES}] ` +
                `${pair.from.symbol} → ${pair.to.symbol}: ${err.message}. ` +
                `Dismissing failed page and resubmitting.`;
              console.warn(note);
              testInfo.annotations.push({
                type: 'cross-chain-retry',
                description: note,
              });

              // Dismiss the failed-transfer page (Close button is rendered
              // when status is `failed` / `refunded` — same Conditional
              // CTA as `Notify me when it's done`). Tolerate failures
              // here so we still attempt the resubmit.
              await swap.clickCloseOnConcludedTransfer().catch(() => undefined);
              continue;
            }
            throw err;
          }
        }
      },
    );
  }
});
