import type { BrowserContext, Page, TestInfo } from '@playwright/test';
import { TEST_CONFIG } from '../constants';

/**
 * Gets the extension ID - uses the known ID from config for speed
 */
export function resolveWalletSnapshotName(testInfo: TestInfo): string {
  const snapshotAnnotation = testInfo.annotations.find(
    (a) => a.type === 'snapshot',
  );
  return snapshotAnnotation?.description || TEST_CONFIG.wallet.snapshotName;
}

/** Time to wait for portfolio UI after unlock (balances + header); CI is slower. */
const portfolioShellTimeoutMs = process.env.CI ? 90_000 : 45_000;

export type WaitForPortfolioShellOptions = {
  /**
   * Also wait for the assets toolbar Send control (matches SendPage portfolio entry).
   * Use after returning to Portfolio when the next step opens Send; skip for empty-wallet flows.
   */
  requireSendNav?: boolean;
};

/**
 * Waits until the extension shows the main Portfolio chrome: loading spinner gone and
 * header settings control visible. Call after unlock before relying on routing or toggles.
 */
export async function waitForPortfolioShellReady(
  page: Page,
  timeout = portfolioShellTimeoutMs,
  options: WaitForPortfolioShellOptions = {},
): Promise<void> {
  console.log(
    '[e2e] Waiting for Portfolio shell (spinner cleared, header ready)…',
  );
  await page.waitForFunction(
    () => {
      const spinner = document.querySelector('[class*="CircularProgress"]');
      if (spinner) return false;

      const settingsBtn = document.querySelector(
        '[data-testid="settings-button"]',
      );
      if (!settingsBtn) return false;

      const el = settingsBtn as HTMLElement;
      const rect = el.getBoundingClientRect();
      if (rect.width <= 0 || rect.height <= 0) return false;

      const style = window.getComputedStyle(el);
      return style.visibility !== 'hidden' && style.display !== 'none';
    },
    { timeout },
  );
  console.log('[e2e] Portfolio shell ready');

  if (options.requireSendNav) {
    console.log('[e2e] Waiting for Portfolio Send control…');
    const sendNav = page
      .locator('[data-testid="send-nav-button"]')
      .or(page.getByRole('button', { name: 'Send', exact: true }))
      .first();
    await sendNav.waitFor({
      state: 'visible',
      timeout: Math.min(timeout, 60_000),
    });
    console.log('[e2e] Portfolio Send control visible');
  }
}

export async function getExtensionId(context: BrowserContext): Promise<string> {
  // Prefer the runtime extension ID from the service worker.
  let serviceWorker = context.serviceWorkers()[0];
  if (!serviceWorker) {
    serviceWorker = await context
      .waitForEvent('serviceworker', { timeout: 30000 })
      .catch(() => undefined);
  }

  if (serviceWorker) {
    try {
      const derivedId = new URL(serviceWorker.url()).host;
      if (derivedId) {
        return derivedId;
      }
    } catch (error) {
      console.warn('Failed to parse extension ID from service worker:', error);
    }
  }

  // Fallback to the known extension ID
  return TEST_CONFIG.extension.id;
}

/**
 * Waits for the extension to fully load (past the loading spinner)
 * Checks for actual UI elements that indicate the app is ready
 */
export async function waitForExtensionLoad(
  page: Page,
  timeout = 30000,
): Promise<void> {
  console.log('Waiting for extension to fully load...');

  // Wait for one of these states:
  // 1. Lock screen (password input visible)
  // 2. Main UI (navigation visible)
  // 3. Onboarding screen (create wallet button visible)
  try {
    await page.waitForFunction(
      () => {
        // Check for loading spinner - if visible, not ready yet
        const spinner = document.querySelector('[class*="CircularProgress"]');
        if (spinner) return false;

        // Check for lock screen
        const passwordInput = document.querySelector(
          'input[type="password"], input[placeholder*="password" i]',
        );
        if (passwordInput) return true;

        // Check for main UI elements
        const navButtons = document.querySelectorAll(
          '[data-testid*="nav"], [data-testid*="settings"]',
        );
        if (navButtons.length > 0) return true;

        // Check for onboarding
        const onboardingButtons = document.querySelectorAll(
          'button[class*="google" i], button[class*="apple" i]',
        );
        if (onboardingButtons.length > 0) return true;

        // Check for any button with meaningful text
        const buttons = Array.from(document.querySelectorAll('button'));
        const hasVisibleButton = buttons.some(
          (btn) => btn.textContent && btn.textContent.trim().length > 2,
        );
        if (hasVisibleButton) return true;

        return false;
      },
      { timeout },
    );
    console.log('Extension UI loaded successfully');
  } catch {
    console.log('Timeout waiting for extension UI, continuing anyway...');
    if (!page.isClosed()) {
      // Take a screenshot for debugging
      await page.screenshot({
        path: `./test-results/screenshots/extension-load-timeout-${Date.now()}.png`,
      });
    }
  }
}

// Matches the extension popup dimensions from useAppDimensions (miniMode)
const POPUP_VIEWPORT = { width: 375, height: 600 };

export async function openExtensionPopup(
  context: BrowserContext,
  extensionId: string,
  options: { pageType?: 'popup' | 'home' } = {},
): Promise<Page> {
  const pageType = options.pageType ?? 'popup';
  const pagePath = pageType === 'home' ? 'home.html' : 'popup.html';
  const popupUrl = `chrome-extension://${extensionId}/${pagePath}`;
  console.log(`Opening extension ${pageType}: ${popupUrl}`);
  const page = await context.newPage();
  await page.setViewportSize(POPUP_VIEWPORT);
  await page.goto(popupUrl, { waitUntil: 'domcontentloaded' });
  await waitForExtensionLoad(page, 45000); // Increased timeout for CI
  return page;
}

/**
 * Navigates to a specific route within the extension
 */
export async function navigateToRoute(
  page: Page,
  extensionId: string,
  route: string,
): Promise<void> {
  const url = `chrome-extension://${extensionId}/popup.html#${route}`;
  await page.goto(url);
  await page.waitForLoadState('domcontentloaded');
  await waitForExtensionLoad(page, 30000);
}

/**
 * Takes a screenshot and saves it to the test results
 */
export async function takeScreenshot(
  page: Page,
  name: string,
  path = './test-results/screenshots',
): Promise<void> {
  await page.screenshot({
    path: `${path}/${name}-${Date.now()}.png`,
    fullPage: true,
  });
}

/**
 * Waits for a specific element to be visible
 */
export async function waitForElement(
  page: Page,
  selector: string,
  timeout = 10000,
): Promise<void> {
  await page.waitForSelector(selector, { state: 'visible', timeout });
}

/**
 * Clears extension storage
 */
export async function clearExtensionStorage(page: Page): Promise<void> {
  await page.evaluate(() => {
    return new Promise<void>((resolve) => {
      chrome.storage.local.clear(() => {
        resolve();
      });
    });
  });
}
