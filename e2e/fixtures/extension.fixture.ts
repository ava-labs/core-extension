/* eslint-disable react-hooks/rules-of-hooks */
import fs from 'node:fs';
import path from 'node:path';
import { test as base, chromium, BrowserContext, Page } from '@playwright/test';
import { TEST_CONFIG } from '../constants';
import {
  getExtensionId,
  openExtensionPopup,
} from '../helpers/extensionHelpers';
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

// Helper to get a clean extension page state
async function getActiveExtensionPage(
  context: BrowserContext,
  extensionId: string,
  options: { preferOnboarding?: boolean } = {},
): Promise<Page> {
  let page: Page | undefined;

  // 1. If preferOnboarding is true, try to find an existing tab first
  if (options.preferOnboarding) {
    console.log('Polling for existing onboarding/home page...');
    for (let i = 0; i < 20; i++) {
      // Poll for up to 10 seconds
      const pages = context.pages();
      page = pages.find(
        (p) => p.url().includes('home.html') || p.url().includes('onboarding'),
      );
      if (page) {
        console.log('Found existing onboarding page');
        break;
      }
      await new Promise((resolve) => setTimeout(resolve, 500));
    }
  }

  // 2. If no page found yet, open a new popup
  if (!page) {
    console.log('Opening new extension popup');
    page = await openExtensionPopup(context, extensionId);
  }

  // 3. Bring the active page to front
  await page.bringToFront();

  // 4. Close all other tabs to ensure clean state
  const allPages = context.pages();
  for (const p of allPages) {
    if (p !== page && !p.isClosed()) {
      try {
        await p.close();
      } catch (_e) {
        // Ignore close errors
      }
    }
  }

  return page;
}

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

    const extensionPath = path.resolve(
      __dirname,
      '..',
      TEST_CONFIG.extension.path,
    );
    // Use unique user data directory per worker to avoid conflicts when running tests in parallel
    const baseUserDataDir = path.resolve(
      __dirname,
      '..',
      TEST_CONFIG.extension.userDataDir,
    );
    const userDataDir = `${baseUserDataDir}-worker-${testInfo.workerIndex}`;

    // Check if extension exists
    if (!fs.existsSync(extensionPath)) {
      throw new Error(
        `Extension not found at: ${extensionPath}. Please build the extension first.`,
      );
    }

    // Get snapshot name from test annotation (if provided)
    // Default is TEST_CONFIG wallet snapshot for extension tests
    const snapshotAnnotation = testInfo.annotations.find(
      (a) => a.type === 'snapshot',
    );
    const snapshotName =
      snapshotAnnotation?.description || TEST_CONFIG.wallet.snapshotName;

    if (snapshotName === 'none') {
      console.log('Starting with fresh extension (no snapshot)');
    } else {
      console.log(`Using snapshot: ${snapshotName}`);
    }

    // Launch browser with extension in persistent context
    const context = await chromium.launchPersistentContext(userDataDir, {
      headless: false, // Extensions require headed mode
      args: [
        `--disable-extensions-except=${extensionPath}`,
        `--load-extension=${extensionPath}`,
        '--no-sandbox',
        '--disable-dev-shm-usage',
        '--disable-background-timer-throttling',
        '--disable-backgrounding-occluded-windows',
        '--disable-renderer-backgrounding',
      ],
      viewport: { width: 1920, height: 1080 },
      ignoreHTTPSErrors: true,
      bypassCSP: true,
    });

    // Load wallet snapshot if specified
    if (snapshotName !== 'none') {
      try {
        await loadWalletSnapshot(
          context,
          snapshotName,
          TEST_CONFIG.wallet.password,
        );
      } catch (error) {
        console.error(`Failed to load snapshot "${snapshotName}":`, error);
        throw error;
      }
    }

    await use(context);

    // Cleanup
    await context.close();
  },

  /**
   * Gets the extension ID
   */
  extensionId: async ({ context }, use) => {
    const extensionId = await getExtensionId(context);
    console.log(`Extension ID: ${extensionId}`);
    await use(extensionId);
  },

  /**
   * Opens the extension page (may be locked)
   * If an onboarding page is already open (fresh install), uses that instead of popup
   */
  extensionPage: async ({ context, extensionId }, use) => {
    const page = await getActiveExtensionPage(context, extensionId, {
      preferOnboarding: true,
    });
    await use(page);
  },

  /**
   * Opens the extension page and unlocks it
   * Requires a snapshot with wallet data
   */
  unlockedExtensionPage: async ({ context, extensionId }, use) => {
    const page = await getActiveExtensionPage(context, extensionId, {
      preferOnboarding: false,
    });

    // Try to unlock if lock screen is visible
    try {
      const passwordInput = page.getByPlaceholder(/password/i);
      const isLocked = await passwordInput
        .isVisible({ timeout: 5000 })
        .catch(() => false);

      if (isLocked) {
        await unlockWallet(page);
      }
    } catch (_error) {
      console.log('Wallet may already be unlocked or no wallet exists');
    }

    await use(page);
  },

  /**
   * Opens a fresh popup page
   */
  popupPage: async ({ context, extensionId }, use) => {
    const page = await getActiveExtensionPage(context, extensionId, {
      preferOnboarding: false,
    });
    await use(page);
  },
});

// Re-export expect from Playwright
export { expect } from '@playwright/test';

/**
 * Test hook to take screenshots on failure
 */
test.afterEach(async ({ context }, testInfo) => {
  if (testInfo.status !== testInfo.expectedStatus) {
    // Take screenshot on failure
    const pages = context.pages();
    for (let i = 0; i < pages.length; i++) {
      const page = pages[i];
      const screenshotDir = path.resolve(
        __dirname,
        '..',
        'test-results',
        'screenshots',
      );

      if (!fs.existsSync(screenshotDir)) {
        fs.mkdirSync(screenshotDir, { recursive: true });
      }

      const filename = `${testInfo.title.replace(/[^a-z0-9]/gi, '_')}-page${i}-${Date.now()}.png`;
      await page.screenshot({
        path: path.join(screenshotDir, filename),
        fullPage: true,
      });

      testInfo.annotations.push({
        type: 'testrail_attachment',
        description: `./e2e/test-results/screenshots/${filename}`,
      });
    }
  }
});
