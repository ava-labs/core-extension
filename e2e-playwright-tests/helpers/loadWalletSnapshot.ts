import type { BrowserContext, Page } from '@playwright/test';

// Dynamically load snapshots that exist
const SNAPSHOTS: Record<string, object> = {};

// Try to load mainnetPrimaryExtWallet
try {
  // eslint-disable-next-line @typescript-eslint/no-require-imports
  const { mainnetPrimaryExtWallet } = require('./storage-snapshots/mainnetPrimaryExtWallet');
  SNAPSHOTS.mainnetPrimaryExtWallet = mainnetPrimaryExtWallet;
} catch (_e) {
  console.warn('mainnetPrimaryExtWallet snapshot not available');
}

// Try to load testnetPrimaryExtWallet
try {
  // eslint-disable-next-line @typescript-eslint/no-require-imports
  const { testnetPrimaryExtWallet } = require('./storage-snapshots/testnetPrimaryExtWallet');
  SNAPSHOTS.testnetPrimaryExtWallet = testnetPrimaryExtWallet;
} catch (_e) {
  console.warn('testnetPrimaryExtWallet snapshot not available');
}

export const loadWalletSnapshot = async (
  context: BrowserContext,
  snapshotName: string,
  _password: string,
): Promise<void> => {
  try {
    console.log(`Loading wallet snapshot: ${snapshotName}`);

    // Get the snapshot data
    const snapshot = SNAPSHOTS[snapshotName];

    if (!snapshot) {
      throw new Error(
        `Snapshot "${snapshotName}" not found. Available snapshots: ${Object.keys(SNAPSHOTS).join(', ')}`,
      );
    }

    // Parse the snapshot data if it's a string
    const parsedSnapshot = typeof snapshot === 'string' ? JSON.parse(snapshot) : snapshot;

    // Find the extension page
    let extensionPage: Page | undefined;
    const loopEnd = Date.now() + 10000; // 10 seconds timeout

    // Loop until finding the extension url page (meaning it's fully loaded in the browser) or timeout after 10 seconds
    while (!extensionPage && Date.now() < loopEnd) {
      const pages = context.pages();
      for (const p of pages) {
        if (p.url().startsWith('chrome-extension://')) {
          extensionPage = p;
          break;
        }
      }
      // Wait 500ms before checking again
      if (!extensionPage) {
        await new Promise((resolve) => setTimeout(resolve, 500));
      }
    }

    if (!extensionPage) {
      throw new Error('Extension page not found. Extension may not be loaded correctly.');
    }

    console.log('Extension page found, loading snapshot data...');

    // Verify required keys exist (if applicable)
    const requiredKeys = ['WALLET_STORAGE_ENCRYPTION_KEY', 'accounts', 'settings', 'wallet'];
    const missingKeys = requiredKeys.filter((key) => !parsedSnapshot[key]);
    if (missingKeys.length > 0) {
      console.warn(`Warning: Missing potentially required keys: ${missingKeys.join(', ')}`);
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
                console.error('Error setting storage:', chrome.runtime.lastError);
                // @ts-expect-error - chrome is available in extension context
                reject(chrome.runtime.lastError);
              } else {
                // Verify the data was stored correctly
                // @ts-expect-error - chrome is available in extension context
                chrome.storage.local.get(keyString, (result) => {
                  console.log(`✓ Loaded ${keyString}:`, result[keyString] ? 'stored' : 'missing');
                  resolve();
                });
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
        chrome.storage.local.get(null, (items) => {
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
    console.error('Error in loadWalletSnapshot:', error);
    throw error;
  }
};

/**
 * Get list of available snapshots
 */
export const getAvailableSnapshots = (): string[] => {
  return Object.keys(SNAPSHOTS);
};
