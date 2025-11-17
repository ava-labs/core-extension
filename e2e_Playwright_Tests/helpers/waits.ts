import { Locator, Page } from '@playwright/test';

export function delay(ms: number): Promise<void> {
  return new Promise((resolve) => setTimeout(resolve, ms));
}

export async function waitForText(locator: Locator, expectedText: string, timeout = 5000): Promise<void> {
  const start = Date.now();

  while (Date.now() - start < timeout) {
    try {
      const text = await locator.textContent();
      if (text && text.includes(expectedText)) {
        return;
      }
    } catch {
      // Element might not be available yet, continue waiting
    }
    await delay(100);
  }

  throw new Error(`Timeout: Expected text "${expectedText}" did not appear within ${timeout}ms`);
}

export async function waitForAttribute(
  locator: Locator,
  attribute: string,
  expectedValue: string,
  timeout = 5000,
): Promise<void> {
  const start = Date.now();

  while (Date.now() - start < timeout) {
    try {
      const value = await locator.getAttribute(attribute);
      if (value === expectedValue) {
        return;
      }
    } catch {
      // Element might not be available yet, continue waiting
    }
    await delay(100);
  }

  throw new Error(`Timeout: Attribute "${attribute}" did not have value "${expectedValue}" within ${timeout}ms`);
}

export async function waitForUrl(page: Page, urlPart: string, timeout = 5000): Promise<void> {
  const start = Date.now();

  while (Date.now() - start < timeout) {
    if (page.url().includes(urlPart)) {
      return;
    }
    await delay(100);
  }

  throw new Error(`Timeout: URL did not contain "${urlPart}" within ${timeout}ms`);
}

export async function waitForCount(locator: Locator, expectedCount: number, timeout = 5000): Promise<void> {
  const start = Date.now();

  while (Date.now() - start < timeout) {
    try {
      const count = await locator.count();
      if (count === expectedCount) {
        return;
      }
    } catch {
      // Continue waiting
    }
    await delay(100);
  }

  throw new Error(`Timeout: Element count did not reach ${expectedCount} within ${timeout}ms`);
}

export async function waitForNetworkIdle(page: Page, idleTime = 500, timeout = 10000): Promise<void> {
  let lastRequestTime = Date.now();
  const startTime = Date.now();

  const requestListener = () => {
    lastRequestTime = Date.now();
  };

  page.on('request', requestListener);

  try {
    while (Date.now() - startTime < timeout) {
      if (Date.now() - lastRequestTime >= idleTime) {
        page.off('request', requestListener);
        return;
      }
      await delay(100);
    }
    throw new Error(`Timeout: Network did not become idle within ${timeout}ms`);
  } finally {
    page.off('request', requestListener);
  }
}

export async function waitForExtensionStorage(page: Page, key: string, timeout = 5000): Promise<void> {
  const start = Date.now();

  while (Date.now() - start < timeout) {
    const hasKey = await page.evaluate(async (storageKey) => {
      return new Promise<boolean>((resolve) => {
        chrome.storage.local.get(storageKey, (result) => {
          resolve(storageKey in result);
        });
      });
    }, key);

    if (hasKey) {
      return;
    }
    await delay(100);
  }

  throw new Error(`Timeout: Storage key "${key}" not found within ${timeout}ms`);
}
