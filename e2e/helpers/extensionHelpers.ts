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
 * Waits for the extension to fully load
 */
export async function waitForExtensionLoad(
  page: Page,
  timeout = 30000,
): Promise<void> {
  const startTime = Date.now();

  while (Date.now() - startTime < timeout) {
    const url = page.url();
    if (url.startsWith('chrome-extension://') && !url.includes('loading')) {
      // Check if the page has loaded content
      const content = await page.content();
      if (content.includes('</html>')) {
        return;
      }
    }
    await page.waitForTimeout(500);
  }

  throw new Error(`Extension did not load within ${timeout}ms`);
}

/**
 * Opens the extension popup in a new page
 */
export async function openExtensionPopup(
  context: BrowserContext,
  extensionId: string,
): Promise<Page> {
  const popupUrl = `chrome-extension://${extensionId}/popup.html`;
  const page = await context.newPage();
  await page.goto(popupUrl);
  await waitForExtensionLoad(page);
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
