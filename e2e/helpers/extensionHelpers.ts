import type { BrowserContext, Page } from '@playwright/test';
import { TEST_CONFIG } from '../constants';

/**
 * Gets the extension ID - uses the known ID from config for speed
 */
export async function getExtensionId(
  _context: BrowserContext,
): Promise<string> {
  // Use the known extension ID directly for faster execution
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
    // Take a screenshot for debugging
    await page.screenshot({
      path: `./test-results/screenshots/extension-load-timeout-${Date.now()}.png`,
    });
  }
}

/**
 * Opens the extension popup in a new page
 */
export async function openExtensionPopup(
  context: BrowserContext,
  extensionId: string,
): Promise<Page> {
  const popupUrl = `chrome-extension://${extensionId}/popup.html`;
  console.log(`Opening extension popup: ${popupUrl}`);
  const page = await context.newPage();
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
