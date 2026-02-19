import type { Page } from '@playwright/test';

/**
 * Simple delay function
 */
export function delay(ms: number): Promise<void> {
  return new Promise((resolve) => setTimeout(resolve, ms));
}

/**
 * Waits for an element to be visible with retry
 */
export async function waitForElementWithRetry(
  page: Page,
  selector: string,
  timeout = 10000,
  retries = 3,
): Promise<void> {
  let lastError: Error | null = null;

  for (let i = 0; i < retries; i++) {
    try {
      await page.waitForSelector(selector, {
        state: 'visible',
        timeout: timeout / retries,
      });
      return;
    } catch (error) {
      lastError = error as Error;
      await delay(500);
    }
  }

  throw (
    lastError ||
    new Error(`Element ${selector} not found after ${retries} retries`)
  );
}

/**
 * Waits for navigation to complete
 */
export async function waitForNavigation(
  page: Page,
  timeout = 30000,
): Promise<void> {
  await page.waitForLoadState('domcontentloaded', { timeout });
}

/**
 * Waits for network to be idle
 */
export async function waitForNetworkIdle(
  page: Page,
  timeout = 10000,
): Promise<void> {
  await page.waitForLoadState('networkidle', { timeout });
}

/**
 * Waits for a specific URL pattern
 */
export async function waitForUrl(
  page: Page,
  urlPattern: string | RegExp,
  timeout = 30000,
): Promise<void> {
  await page.waitForURL(urlPattern, { timeout });
}

/**
 * Waits for text to appear on the page
 */
export async function waitForText(
  page: Page,
  text: string,
  timeout = 10000,
): Promise<void> {
  await page.getByText(text).waitFor({ state: 'visible', timeout });
}

/**
 * Waits for a storage key to exist in chrome.storage.local
 */
export async function waitForStorageKey(
  page: Page,
  key: string,
  timeout = 10000,
): Promise<void> {
  const startTime = Date.now();

  while (Date.now() - startTime < timeout) {
    const hasKey = await page.evaluate(async (k) => {
      return new Promise<boolean>((resolve) => {
        // @ts-expect-error - chrome is available in extension context
        chrome.storage.local.get(k, (result: Record<string, unknown>) => {
          resolve(result[k] !== undefined);
        });
      });
    }, key);

    if (hasKey) {
      return;
    }
    await delay(100);
  }

  throw new Error(
    `Timeout: Storage key "${key}" not found within ${timeout}ms`,
  );
}
