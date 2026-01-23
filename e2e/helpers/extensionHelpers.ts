import type { BrowserContext, Page } from '@playwright/test';

/**
 * Gets the extension ID from the browser context using the service worker
 * This is the most reliable method as it doesn't depend on open pages
 */
export async function getExtensionId(context: BrowserContext): Promise<string> {
  // First, try to get extension ID from existing pages
  const pages = context.pages();
  for (const page of pages) {
    const url = page.url();
    if (url.startsWith('chrome-extension://')) {
      const match = url.match(/chrome-extension:\/\/([^/]+)/);
      if (match) {
        return match[1];
      }
    }
  }

  // If no page found, get extension ID from service worker (more reliable)
  let [serviceWorker] = context.serviceWorkers();

  if (!serviceWorker) {
    console.log('Waiting for extension service worker...');
    serviceWorker = await context.waitForEvent('serviceworker', {
      timeout: 30000,
    });
  }

  const url = serviceWorker.url();
  const match = url.match(/chrome-extension:\/\/([^/]+)/);
  if (match) {
    return match[1];
  }

  throw new Error('Could not get extension ID from service worker');
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
      // @ts-expect-error - chrome is available in extension context
      chrome.storage.local.clear(() => {
        resolve();
      });
    });
  });
}
