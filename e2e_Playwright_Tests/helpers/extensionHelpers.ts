import { BrowserContext, Page } from '@playwright/test';
import { delay } from './waits';

export async function getExtensionId(context: BrowserContext): Promise<string> {
  console.log('Getting extension ID...');

  // Wait for service worker to be available
  let serviceWorker = context.serviceWorkers()[0];

  if (!serviceWorker) {
    console.log('Waiting for service worker...');
    serviceWorker = await context.waitForEvent('serviceworker', {
      timeout: 30000,
    });
  }

  const url = serviceWorker.url();
  const extensionId = url.split('/')[2];

  if (!extensionId) {
    throw new Error('Failed to extract extension ID from service worker URL');
  }

  console.log('Extension ID:', extensionId);
  return extensionId;
}

export async function getExtensionPage(context: BrowserContext, urlPattern: string, timeout = 10000): Promise<Page> {
  const start = Date.now();

  while (Date.now() - start < timeout) {
    const pages = context.pages();
    const extensionPage = pages.find((p) => p.url().includes(urlPattern));

    if (extensionPage) {
      return extensionPage;
    }

    await delay(100);
  }

  throw new Error(`Extension page with pattern "${urlPattern}" not found within ${timeout}ms`);
}

export async function waitForExtensionLoad(context: BrowserContext, timeout = 30000): Promise<void> {
  const start = Date.now();

  while (Date.now() - start < timeout) {
    const pages = context.pages();
    const extensionPage = pages.find((p) => p.url().startsWith('chrome-extension://'));

    if (extensionPage) {
      await extensionPage.waitForLoadState('domcontentloaded');
      console.log('Extension loaded');
      return;
    }

    await delay(500);
  }

  throw new Error(`Extension did not load within ${timeout}ms`);
}

export async function closeOnboardingPages(context: BrowserContext): Promise<void> {
  const pages = context.pages();

  for (const page of pages) {
    const url = page.url();
    if (url.includes('/onboarding') || url.includes('/welcome') || url.includes('getting-started')) {
      console.log('Closing onboarding page:', url);
      await page.close();
    }
  }
}

export async function setExtensionStorage(page: Page, key: string, value: any): Promise<void> {
  await page.evaluate(
    async ([storageKey, storageValue]) => {
      return new Promise<void>((resolve, reject) => {
        chrome.storage.local.set({ [storageKey]: storageValue }, () => {
          if (chrome.runtime.lastError) {
            reject(chrome.runtime.lastError);
          } else {
            resolve();
          }
        });
      });
    },
    [key, value],
  );
}

export async function getExtensionStorage<T = any>(page: Page, key: string): Promise<T | undefined> {
  return await page.evaluate(async (storageKey) => {
    return new Promise<any>((resolve) => {
      chrome.storage.local.get(storageKey, (result) => {
        resolve(result[storageKey]);
      });
    });
  }, key);
}

export async function clearExtensionStorage(page: Page): Promise<void> {
  await page.evaluate(async () => {
    return new Promise<void>((resolve, reject) => {
      chrome.storage.local.clear(() => {
        if (chrome.runtime.lastError) {
          reject(chrome.runtime.lastError);
        } else {
          resolve();
        }
      });
    });
  });
}

export async function loadExtensionStorage(page: Page, data: Record<string, any>): Promise<void> {
  console.log('Loading extension storage...');

  for (const [key, value] of Object.entries(data)) {
    await setExtensionStorage(page, key, value);
    console.log(`  Stored: ${key}`);
  }

  console.log('Extension storage loaded');
}

export async function openExtensionPopup(context: BrowserContext, extensionId: string): Promise<Page> {
  const popupUrl = `chrome-extension://${extensionId}/popup.html#/home`;
  const page = await context.newPage();
  await page.goto(popupUrl);
  await page.waitForLoadState('domcontentloaded');
  return page;
}

export async function takeScreenshot(page: Page, name: string, path = './test-results/screenshots'): Promise<void> {
  const timestamp = new Date().toISOString().replace(/[:.]/g, '-');
  const filename = `${name}-${timestamp}.png`;
  await page.screenshot({
    path: `${path}/${filename}`,
    fullPage: true,
  });
  console.log('Screenshot saved:', filename);
}

export async function switchToTab(context: BrowserContext, urlPattern: string): Promise<Page> {
  const pages = context.pages();
  const targetPage = pages.find((p) => p.url().includes(urlPattern));

  if (!targetPage) {
    throw new Error(`No tab found with URL pattern: ${urlPattern}`);
  }

  await targetPage.bringToFront();
  return targetPage;
}
