import {
  errors,
  type Locator,
  type Page,
  type TestInfo,
} from '@playwright/test';

/**
 * Text used by the Sonner toast that `useGasless.tryFunding` shows when the
 * Gas Station fails to fund a gasless transaction.
 *
 * When this toast appears, the approval flow:
 *   1. Resets gasless state (`setGaslessDefaultValues`) — toggle flips off,
 *      fee preset selector reappears.
 *   2. Does NOT call the approve callback — the transaction is never
 *      submitted on-chain, so a plain `waitForSuccessToast` will time out.
 */
const GASLESS_ERROR_TOAST_TEXT = 'Gasless funding failed';

export function getGaslessErrorToast(page: Page): Locator {
  return page
    .locator('[data-sonner-toast]')
    .filter({ hasText: GASLESS_ERROR_TOAST_TEXT });
}

/**
 * Races a "success" locator (typically the Sonner success toast) against the
 * `Gasless funding failed` error toast. Tests that exercise the gasless-on
 * path should use this instead of awaiting the success toast directly so a
 * transient Gas Station / App Check outage surfaces as a skip rather than a
 * 30s `TimeoutError`.
 *
 * Returns:
 * - `'success'`        — success toast appeared first.
 * - `'gasless-failed'` — gasless error toast appeared first; tx was NOT
 *                       submitted. Callers should call `test.skip()`.
 * - `'timeout'`        — neither toast appeared within `timeout` ms.
 */
export async function waitForSuccessOrGaslessFail(
  successWaiter: Locator,
  page: Page,
  timeout = 30_000,
): Promise<'success' | 'gasless-failed' | 'timeout'> {
  const successPromise = successWaiter
    .waitFor({ state: 'visible', timeout })
    .then(() => 'success' as const);
  const gaslessFailPromise = getGaslessErrorToast(page)
    .waitFor({ state: 'visible', timeout })
    .then(() => 'gasless-failed' as const);

  // Suppress unhandled rejection on the losing waiter once the race settles.
  successPromise.catch(() => {});
  gaslessFailPromise.catch(() => {});

  try {
    return await Promise.race([successPromise, gaslessFailPromise]);
  } catch (err) {
    // Only timeouts collapse into 'timeout' — other failures (page closed,
    // selector errors, browser crash) must surface with their original
    // message so they aren't misdiagnosed as transient flakes.
    if (err instanceof errors.TimeoutError) {
      return 'timeout' as const;
    }
    throw err;
  }
}

/**
 * Captures a full-page screenshot + a skip annotation describing the
 * transient gasless failure. Playwright's default capture config only
 * attaches screenshots/traces/videos on FAILED tests, so a plain
 * `test.skip()` would leave nothing for triage in the HTML report.
 *
 * Always call this immediately before `test.skip()` on a gasless flake.
 */
export async function attachGaslessSkipArtifacts(
  page: Page,
  testInfo: TestInfo,
  testRailId: string,
): Promise<void> {
  try {
    const screenshot = await page.screenshot({ fullPage: true });
    await testInfo.attach(`${testRailId}-gasless-failed-state.png`, {
      body: screenshot,
      contentType: 'image/png',
    });
  } catch (err) {
    console.warn(
      `[gasless] Failed to capture screenshot before skip for ${testRailId}:`,
      err,
    );
  }

  try {
    const toastText =
      (
        await getGaslessErrorToast(page).first().textContent({ timeout: 1000 })
      )?.trim() ?? '(toast text unavailable)';
    await testInfo.attach(`${testRailId}-gasless-error-toast.txt`, {
      body: Buffer.from(toastText, 'utf-8'),
      contentType: 'text/plain',
    });
  } catch {
    // best-effort — toast may have auto-dismissed already
  }

  testInfo.annotations.push({
    type: 'gasless-skip',
    description: `${testRailId}: Gas Station gasless funding failed (transient infra issue); transaction was not submitted.`,
  });
}
