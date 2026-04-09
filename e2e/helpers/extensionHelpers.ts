import type { BrowserContext, Page, TestInfo } from '@playwright/test';
import { isTestnetWalletSnapshotName, TEST_CONFIG } from '../constants';

/**
 * Gets the extension ID - uses the known ID from config for speed
 */
export function resolveWalletSnapshotName(testInfo: TestInfo): string {
  const snapshotAnnotation = testInfo.annotations.find(
    (a) => a.type === 'snapshot',
  );
  return snapshotAnnotation?.description || TEST_CONFIG.wallet.snapshotName;
}

/**
 * When using a testnet-named wallet snapshot, ensure Settings → Testnet mode is on.
 * Fixes CI/local runs where a fresh profile or extension ID would otherwise leave mainnet mode on.
 */
export async function ensureTestnetModeIfNeeded(
  page: Page,
  extensionId: string,
  snapshotName: string,
): Promise<void> {
  if (!isTestnetWalletSnapshotName(snapshotName)) {
    return;
  }

  await navigateToRoute(page, extensionId, '/settings');

  // Testnet row: apps/next/.../Home.tsx `data-testid="settings-testnet-mode-row"`.
  const testnetSwitch = page.locator(
    '[data-testid="settings-testnet-mode-row"] input[type="checkbox"]',
  );
  await testnetSwitch.waitFor({ state: 'attached', timeout: 20000 });

  const alreadyOn = await testnetSwitch.isChecked();
  if (alreadyOn) {
    console.log(
      '[e2e] Testnet mode already enabled (matches testnet wallet snapshot)',
    );
    await navigateToRoute(page, extensionId, '/');
    return;
  }

  console.log('[e2e] Enabling Testnet mode for testnet wallet snapshot');
  await testnetSwitch.click({ force: true });
  await page.waitForFunction(
    () => {
      const el = document.querySelector<HTMLInputElement>(
        '[data-testid="settings-testnet-mode-row"] input[type="checkbox"]',
      );
      return el?.checked === true;
    },
    { timeout: 25000 },
  );

  await navigateToRoute(page, extensionId, '/');
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
