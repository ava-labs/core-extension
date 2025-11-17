import { Page, Locator } from '@playwright/test';
import { TEST_CONFIG } from '../../constants';

export abstract class BasePage {
  readonly page: Page;

  constructor(page: Page) {
    this.page = page;
  }

  async goto(path: string): Promise<void> {
    const extensionId = await this.getExtensionId();
    const url = `chrome-extension://${extensionId}/${path}`;
    await this.page.goto(url);
    await this.page.waitForLoadState('domcontentloaded');
  }

  async getExtensionId(): Promise<string> {
    if (TEST_CONFIG.extension.id) {
      return TEST_CONFIG.extension.id;
    }

    // Extract from current URL if we're on an extension page
    const url = this.page.url();
    if (url.startsWith('chrome-extension://')) {
      return url.split('/')[2];
    }

    throw new Error('Could not determine extension ID');
  }

  async waitForVisible(locator: Locator, timeout = TEST_CONFIG.timeouts.default): Promise<void> {
    await locator.waitFor({ state: 'visible', timeout });
  }

  async waitForHidden(locator: Locator, timeout = TEST_CONFIG.timeouts.default): Promise<void> {
    await locator.waitFor({ state: 'hidden', timeout });
  }

  async clickElement(locator: Locator): Promise<void> {
    await this.waitForVisible(locator);
    await locator.click();
  }

  async fillInput(locator: Locator, value: string): Promise<void> {
    await this.waitForVisible(locator);
    await locator.fill(value);
  }

  async getText(locator: Locator): Promise<string> {
    await this.waitForVisible(locator);
    return (await locator.textContent()) || '';
  }

  async isVisible(locator: Locator): Promise<boolean> {
    try {
      await locator.waitFor({ state: 'visible', timeout: 5000 });
      return true;
    } catch {
      return false;
    }
  }

  async waitForNavigation(): Promise<void> {
    await this.page.waitForLoadState('domcontentloaded');
  }

  async screenshot(name: string): Promise<void> {
    await this.page.screenshot({
      path: `./test-results/screenshots/${name}.png`,
      fullPage: true,
    });
  }

  async reload(): Promise<void> {
    await this.page.reload();
    await this.waitForNavigation();
  }

  async getStorageValue(key: string): Promise<any> {
    return await this.page.evaluate(async (storageKey) => {
      return new Promise((resolve) => {
        chrome.storage.local.get(storageKey, (result) => {
          resolve(result[storageKey]);
        });
      });
    }, key);
  }

  async setStorageValue(key: string, value: any): Promise<void> {
    await this.page.evaluate(
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
}
