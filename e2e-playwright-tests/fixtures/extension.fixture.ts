/* eslint-disable react-hooks/rules-of-hooks */
import fs from 'node:fs';
import path from 'node:path';
import { test as base, chromium, BrowserContext, Page } from '@playwright/test';
import { TEST_CONFIG } from '../constants';
import { getExtensionId, waitForExtensionLoad, openExtensionPopup } from '../helpers/extensionHelpers';
import { unlockWallet } from '../helpers/walletHelpers';
import { loadWalletSnapshot } from '../helpers/loadWalletSnapshot';

// Define custom fixtures
export type ExtensionFixtures = {
  context: BrowserContext;
  extensionId: string;
  extensionPage: Page;
  unlockedExtensionPage: Page;
  popupPage: Page;
};

export const test = base.extend<ExtensionFixtures>({
  /**
   * Browser context with extension loaded
   * This is the foundation fixture that loads the extension
   *
   * By default, starts with a fresh extension (no snapshot).
   * To use a wallet snapshot, add annotation: { type: 'snapshot', description: 'snapshotName' }
   */
  // eslint-disable-next-line no-empty-pattern
  context: async ({}, use, testInfo) => {
    console.log('\nSetting up browser context with extension...');

    const extensionPath = path.resolve(__dirname, '..', TEST_CONFIG.extension.path);
    const userDataDir = path.resolve(__dirname, '..', TEST_CONFIG.extension.userDataDir);

    // Check if extension exists
    if (!fs.existsSync(extensionPath)) {
      throw new Error(`Extension not found at: ${extensionPath}. Please build the extension first.`);
    }

    // Get snapshot name from test annotation (if provided)
    // Default is 'none' for fresh extension launch
    const snapshotAnnotation = testInfo.annotations.find((a) => a.type === 'snapshot');
    const snapshotName = snapshotAnnotation?.description || 'none';

    if (snapshotName === 'none') {
      console.log('Starting with fresh extension (no snapshot)');
    } else {
      console.log(`Using snapshot: ${snapshotName}`);
    }

    // Launch browser with extension in persistent context
    const context = await chromium.launchPersistentContext(userDataDir, {
      headless: TEST_CONFIG.browser.headless,
      channel: 'chromium',
      permissions: ['clipboard-read', 'clipboard-write'],
      args: [
        `--disable-extensions-except=${extensionPath}`,
        `--load-extension=${extensionPath}`,
        '--no-sandbox',
        '--start-maximized',
        '--disable-dev-shm-usage',
        '--disable-background-timer-throttling',
        '--disable-backgrounding-occluded-windows',
        '--disable-renderer-backgrounding',
      ],
    });

    console.log('Browser context created');

    // Check if translation mocking is requested via test annotation
    const mockTranslationsAnnotation = testInfo.annotations.find((a) => a.type === 'mockTranslations');
    if (mockTranslationsAnnotation) {
      console.log('[FIXTURE] Setting up translation mocking at context level...');
      const mockTranslations: Record<string, string> = {
        "That's it!": "That's it!",
        'Enjoy your wallet': 'Enjoy your wallet',
        "Let's go!": "Let's go!",
        'You can now start buying, swapping, sending, receiving crypto and collectibles with no added fees':
          'You can now start buying, swapping, sending, receiving crypto and collectibles with no added fees',
        'Create wallet': 'Create wallet',
        'Import wallet': 'Import wallet',
        Next: 'Next',
        Back: 'Back',
        Continue: 'Continue',
        Cancel: 'Cancel',
        Confirm: 'Confirm',
        Skip: 'Skip',
      };

      // Set up routes BEFORE any pages are created
      await context.route('**/*locales**', async (route) => {
        const url = route.request().url();
        const method = route.request().method();
        if (method === 'GET' && (url.includes('locales') || url.includes('translation') || url.includes('i18n'))) {
          console.log(`[FIXTURE-MOCK] Context route intercept: ${method} ${url}`);
          await route.fulfill({
            status: 200,
            contentType: 'application/json',
            headers: {
              'Access-Control-Allow-Origin': '*',
              'Content-Type': 'application/json',
            },
            body: JSON.stringify(mockTranslations),
          });
        } else {
          await route.continue();
        }
      });

      await context.route('https://core.app/**', async (route) => {
        const url = route.request().url();
        const method = route.request().method();
        if (method === 'GET' && (url.includes('locales') || url.includes('translation'))) {
          console.log(`[FIXTURE-MOCK] core.app route intercept: ${method} ${url}`);
          await route.fulfill({
            status: 200,
            contentType: 'application/json',
            headers: {
              'Access-Control-Allow-Origin': '*',
              'Content-Type': 'application/json',
            },
            body: JSON.stringify(mockTranslations),
          });
        } else {
          await route.continue();
        }
      });

      // Add init script to context (applies to all pages)
      await context.addInitScript((mockData: Record<string, string>) => {
        // @ts-expect-error - window exists in browser context where this code runs
        const originalFetch = window.fetch;
        // @ts-expect-error - window exists in browser context where this code runs
        window.fetch = function (...args: any[]) {
          const url = typeof args[0] === 'string' ? args[0] : args[0].url;
          if (url && (url.includes('locales') || url.includes('translation') || url.includes('i18n'))) {
            console.log('[FIXTURE-MOCK] JavaScript fetch intercept:', url);
            return Promise.resolve(
              new Response(JSON.stringify(mockData), {
                status: 200,
                statusText: 'OK',
                headers: {
                  'Content-Type': 'application/json',
                  'Access-Control-Allow-Origin': '*',
                },
              }),
            );
          }
          return originalFetch.apply(this, args);
        };

        // @ts-expect-error - XMLHttpRequest exists in browser context where this code runs
        const originalXHROpen = XMLHttpRequest.prototype.open;
        // @ts-expect-error - XMLHttpRequest exists in browser context where this code runs
        const originalXHRSend = XMLHttpRequest.prototype.send;
        // @ts-expect-error - XMLHttpRequest exists in browser context where this code runs
        XMLHttpRequest.prototype.open = function (method: string, url: string, ...rest: any[]) {
          (this as any)._mockUrl = url;
          return originalXHROpen.apply(this, [method, url, ...rest]);
        };
        // @ts-expect-error - XMLHttpRequest exists in browser context where this code runs
        XMLHttpRequest.prototype.send = function (...args: any[]) {
          if (
            (this as any)._mockUrl &&
            ((this as any)._mockUrl.includes('locales') ||
              (this as any)._mockUrl.includes('translation') ||
              (this as any)._mockUrl.includes('i18n'))
          ) {
            console.log('[FIXTURE-MOCK] JavaScript XHR intercept:', (this as any)._mockUrl);
            setTimeout(() => {
              Object.defineProperty(this, 'status', { value: 200, writable: false });
              Object.defineProperty(this, 'statusText', { value: 'OK', writable: false });
              Object.defineProperty(this, 'responseText', { value: JSON.stringify(mockData), writable: false });
              Object.defineProperty(this, 'readyState', { value: 4, writable: false });
              if (this.onreadystatechange) {
                this.onreadystatechange();
              }
              if (this.onload) {
                this.onload();
              }
            }, 0);
            return;
          }
          return originalXHRSend.apply(this, args);
        };
      }, mockTranslations);

      console.log('[FIXTURE] Translation mocking configured at context level');
    }

    // Wait for extension to load
    await waitForExtensionLoad(context);
    console.log('Extension loaded');

    // Load wallet snapshot if specified
    if (snapshotName !== 'none') {
      console.log(`Loading snapshot: ${snapshotName}`);
      await loadWalletSnapshot(context, snapshotName, TEST_CONFIG.wallet.password);
      console.log(`Snapshot loaded: ${snapshotName}`);

      // Wait a bit for the extension to process the snapshot data
      await context
        .pages()[0]
        ?.waitForTimeout(500)
        .catch(() => {});
    }

    // Close any about:blank pages that might have opened
    for (const page of context.pages()) {
      if (page.url() === 'about:blank') {
        await page.close().catch(() => {});
      }
    }

    // Use the context
    await use(context);

    // Cleanup: close context and remove user data
    console.log('Cleaning up context...');
    await context.close();

    if (fs.existsSync(userDataDir)) {
      fs.rmSync(userDataDir, { recursive: true, force: true });
    }

    console.log('Context cleaned up\n');
  },

  extensionId: async ({ context }, use) => {
    const extensionId = await getExtensionId(context);
    await use(extensionId);
  },

  /**
   * Extension page - basic page without wallet unlocked
   * Useful for testing onboarding, login flows, etc.
   * Starts fresh by default (no wallet snapshot loaded).
   */
  extensionPage: async ({ context, extensionId }, use, testInfo) => {
    console.log('Creating extension page (for tests WITHOUT wallet unlock)...');

    // Check if a snapshot is being used
    const snapshotAnnotation = testInfo.annotations.find((a) => a.type === 'snapshot');
    const hasSnapshot = snapshotAnnotation && snapshotAnnotation.description !== 'none';

    if (hasSnapshot) {
      console.warn(
        'WARNING: extensionPage fixture is being used with a snapshot. Consider using unlockedExtensionPage instead.',
      );
    }

    // Wait for extension to auto-open its page
    await context.waitForEvent('page', { timeout: 5000 }).catch(() => {});

    // Find the extension page that was auto-opened
    let page = context.pages().find((p) => p.url().startsWith(`chrome-extension://${extensionId}`));

    // If no auto-opened page found, create one and let extension redirect naturally
    if (!page) {
      console.log('No auto-opened page found, creating new page...');
      page = await context.newPage();
      await page.goto(`chrome-extension://${extensionId}/home.html`);
      await page.waitForLoadState('domcontentloaded');
    } else {
      console.log(`Using auto-opened extension page: ${page.url()}`);
      await page.waitForLoadState('domcontentloaded');
    }

    // Wait for potential redirects (e.g., fresh extension redirects to onboarding)
    await page.waitForTimeout(2000);

    // Close any extra extension pages
    for (const p of context.pages()) {
      if (p !== page && p.url().startsWith(`chrome-extension://${extensionId}`)) {
        console.log('Closing extra extension page:', p.url());
        await p.close().catch(() => {});
      }
    }

    // Close any about:blank pages
    for (const p of context.pages()) {
      if (p.url() === 'about:blank') {
        await p.close().catch(() => {});
      }
    }

    const finalUrl = page.url();
    console.log(`Extension page ready at: ${finalUrl}`);

    // Log the type of page we ended up on
    if (finalUrl.includes('onboard')) {
      console.log('→ On onboarding page (fresh extension - no wallet)');
    } else if (finalUrl.includes('lock') || finalUrl.includes('login')) {
      console.log('→ On lock/login page (wallet exists but locked)');
    } else if (finalUrl.includes('home')) {
      console.log('→ On home page (wallet may be unlocked)');
    }

    await use(page);

    // Cleanup page storage
    try {
      await page.evaluate(() => {
        // @ts-expect-error - window is available in browser context
        window.localStorage.clear();
      });
      await page.evaluate(() => {
        // @ts-expect-error - window is available in browser context
        window.sessionStorage.clear();
      });
    } catch {
      // Page might be closed already
    }
  },

  /**
   * Unlocked extension page - wallet is already unlocked
   * This is the most commonly used fixture for testing wallet features
   *
   * Note: Requires a wallet snapshot to be loaded. Add annotation:
   * testInfo.annotations.push({ type: 'snapshot', description: 'example' });
   */
  unlockedExtensionPage: async ({ context, extensionId }, use, testInfo) => {
    console.log('Creating unlocked extension page...');

    // Check if a snapshot is being used
    const snapshotAnnotation = testInfo.annotations.find((a) => a.type === 'snapshot');
    const hasSnapshot = snapshotAnnotation && snapshotAnnotation.description !== 'none';

    if (!hasSnapshot) {
      throw new Error(
        'unlockedExtensionPage fixture requires a wallet snapshot. Add annotation: { type: "snapshot", description: "snapshotName" }',
      );
    }

    // Always create a new page for the test (don't reuse auto-opened extension pages)
    const page = await context.newPage();
    console.log(`Navigating to popup.html#/home...`);
    await page.goto(`chrome-extension://${extensionId}/popup.html#/home`);
    await page.waitForLoadState('domcontentloaded');

    console.log(`Current page URL after navigation: ${page.url()}`);

    // Wait for snapshot data to be loaded and extension to render lock screen
    await page.waitForTimeout(2000);

    // Close any extra extension pages that auto-opened
    for (const p of context.pages()) {
      if (p !== page && p.url().startsWith(`chrome-extension://${extensionId}`)) {
        console.log('Closing auto-opened extension page:', p.url());
        await p.close().catch(() => {});
      }
    }

    // Close any about:blank pages
    for (const p of context.pages()) {
      if (p.url() === 'about:blank') {
        await p.close().catch(() => {});
      }
    }

    // Now unlock the wallet with the password
    console.log('Attempting to unlock wallet with password...');
    await unlockWallet(page, TEST_CONFIG.wallet.password);
    console.log('Wallet unlocked successfully');

    // Wait for unlock to complete and page to load
    await page.waitForTimeout(2000);
    await page.waitForLoadState('networkidle', { timeout: 10000 }).catch(() => {
      console.log('Network not idle after unlock, continuing...');
    });

    // Additional wait for UI to render
    await page.waitForTimeout(2000);

    console.log(`Final URL after unlock: ${page.url()}`);
    console.log('Extension page unlocked and ready');

    await use(page);

    // Cleanup page storage
    try {
      await page.evaluate(() => {
        // @ts-expect-error - window is available in browser context
        window.localStorage.clear();
      });
      await page.evaluate(() => {
        // @ts-expect-error - window is available in browser context
        window.sessionStorage.clear();
      });
    } catch {
      // Page might be closed already
    }
  },

  /**
   * Extension popup page - simulates clicking the extension icon
   * Useful for testing popup-specific features
   */
  popupPage: async ({ context, extensionId }, use, testInfo) => {
    console.log('Creating popup page...');

    const page = await openExtensionPopup(context, extensionId);

    // Check if a snapshot is being used
    const snapshotAnnotation = testInfo.annotations.find((a) => a.type === 'snapshot');
    const hasSnapshot = snapshotAnnotation && snapshotAnnotation.description !== 'none';

    // Unlock wallet if snapshot is loaded
    if (hasSnapshot) {
      try {
        await unlockWallet(page, TEST_CONFIG.wallet.password);
        console.log('Popup wallet unlocked');
      } catch (error) {
        console.warn('Could not unlock popup wallet:', error);
      }
    }

    await use(page);

    // Cleanup page storage
    try {
      await page.evaluate(() => {
        // @ts-expect-error - window is available in browser context
        window.localStorage.clear();
      });
      await page.evaluate(() => {
        // @ts-expect-error - window is available in browser context
        window.sessionStorage.clear();
      });
    } catch {
      // Page might be closed already
    }
  },
});

test.afterEach(async ({ context }, testInfo) => {
  if (testInfo.status !== testInfo.expectedStatus) {
    console.log('Test failed, capturing screenshot...');

    const screenshotDir = path.resolve(__dirname, '..', 'test-results', 'screenshots');
    const filename = sanitizeFilename(`${testInfo.title}-${Date.now()}.png`);
    const filepath = path.join(screenshotDir, filename);

    // Create directory if it doesn't exist
    if (!fs.existsSync(screenshotDir)) {
      fs.mkdirSync(screenshotDir, { recursive: true });
    }

    // Take screenshot of the first available page
    const pages = context.pages();
    if (pages.length > 0 && pages[0]) {
      try {
        await pages[0].screenshot({
          path: filepath,
          fullPage: true,
        });

        console.log('Screenshot saved:', filename);

        // Add screenshot as test annotation for test management systems
        testInfo.annotations.push({
          type: 'screenshot',
          description: filepath,
        });
      } catch (error) {
        console.error('Failed to capture screenshot:', error);
      }
    }
  }
});

/**
 * Helper function to sanitize filenames
 */
function sanitizeFilename(name: string): string {
  return name
    .replace(/[<>:"/\\|?*]+/g, '-')
    .replace(/\s+/g, '_')
    .slice(0, 200);
}

// Re-export expect for convenience
export { expect } from '@playwright/test';
