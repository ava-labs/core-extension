import type { BrowserContext, Page } from '@playwright/test';
import { mainnetPrimaryExtWallet } from './storage-snapshots/mainnetPrimaryExtWallet';
import { testnetPrimaryExtWallet } from './storage-snapshots/testnetPrimaryExtWallet';

const snapshots: Record<string, object> = {
  mainnetPrimaryExtWallet,
  testnetPrimaryExtWallet,
};

/**
 * Gets the extension ID from the service worker
 */
async function getExtensionIdFromServiceWorker(
  context: BrowserContext,
): Promise<string> {
  // Try to get extension ID from existing service workers
  let [serviceWorker] = context.serviceWorkers();

  // If no service worker found, wait for one to appear
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

  throw new Error('Could not extract extension ID from service worker');
}

export const loadWalletSnapshot = async (
  context: BrowserContext,
  snapshotName: string,
  _password: string,
): Promise<void> => {
  try {
    console.log(`Loading wallet snapshot: ${snapshotName}`);

    // Get the snapshot data
    const snapshot = snapshots[snapshotName];

    if (!snapshot) {
      throw new Error(
        `Snapshot "${snapshotName}" not found. Available snapshots: ${Object.keys(snapshots).join(', ')}`,
      );
    }

    // Parse the snapshot data if it's a string
    const parsedSnapshot =
      typeof snapshot === 'string' ? JSON.parse(snapshot) : snapshot;

    // First, try to find an existing extension page
    let extensionPage: Page | undefined;
    const pages = context.pages();
    for (const p of pages) {
      if (p.url().startsWith('chrome-extension://')) {
        extensionPage = p;
        break;
      }
    }

    // If no extension page exists, get the extension ID and create one
    if (!extensionPage) {
      console.log(
        'No extension page found, getting extension ID from service worker...',
      );
      const extensionId = await getExtensionIdFromServiceWorker(context);
      console.log(`Extension ID: ${extensionId}`);

      // Create a new page and navigate to the extension popup
      extensionPage = await context.newPage();
      const extensionUrl = `chrome-extension://${extensionId}/popup.html`;
      console.log(`Navigating to extension: ${extensionUrl}`);
      await extensionPage.goto(extensionUrl, { waitUntil: 'domcontentloaded' });

      // Wait a bit for the extension to initialize
      await extensionPage.waitForTimeout(2000);
    }

    if (!extensionPage) {
      throw new Error(
        'Extension page not found. Extension may not be loaded correctly.',
      );
    }

    console.log('Extension page found, loading snapshot data...');

    // Verify required keys exist (if applicable)
    const requiredKeys = [
      'WALLET_STORAGE_ENCRYPTION_KEY',
      'accounts',
      'settings',
      'wallet',
    ];
    const missingKeys = requiredKeys.filter((key) => !parsedSnapshot[key]);
    if (missingKeys.length > 0) {
      console.warn(
        `Warning: Missing potentially required keys: ${missingKeys.join(', ')}`,
      );
    }

    // Store each key in chrome.storage.local and verify immediately
    for (const [key, value] of Object.entries(parsedSnapshot)) {
      await extensionPage.evaluate(
        async ([k, v]) => {
          return new Promise<void>((resolve, reject) => {
            const keyString = k as string;
            const data = { [keyString]: v };
            // @ts-expect-error - chrome is available in extension context
            chrome.storage.local.set(data, () => {
              // @ts-expect-error - chrome is available in extension context
              if (chrome.runtime.lastError) {
                // @ts-expect-error - chrome is available in extension context
                console.error(
                  'Error setting storage:',
                  chrome.runtime.lastError,
                );
                // @ts-expect-error - chrome is available in extension context
                reject(chrome.runtime.lastError);
              } else {
                // Verify the data was stored correctly
                // @ts-expect-error - chrome is available in extension context
                chrome.storage.local.get(
                  keyString,
                  (result: Record<string, unknown>) => {
                    console.log(
                      `✓ Loaded ${keyString}:`,
                      result[keyString] ? 'stored' : 'missing',
                    );
                    resolve();
                  },
                );
              }
            });
          });
        },
        [key, value],
      );
    }

    console.log(`✓ Wallet snapshot "${snapshotName}" loaded successfully`);

    // Optional: Log storage summary for debugging
    const storageSummary = await extensionPage.evaluate(async () => {
      return new Promise<Record<string, string>>((resolve) => {
        // @ts-expect-error - chrome is available in extension context
        chrome.storage.local.get(null, (items: Record<string, unknown>) => {
          const summary: Record<string, string> = {};
          for (const [key, value] of Object.entries(items)) {
            summary[key] = typeof value;
          }
          resolve(summary);
        });
      });
    });

    console.log('Storage summary:', storageSummary);
  } catch (error) {
    console.error('Error loading wallet snapshot:', error);
    throw error;
  }
};
