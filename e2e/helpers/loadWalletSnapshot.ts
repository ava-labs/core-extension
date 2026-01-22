import type { BrowserContext, Page } from '@playwright/test';
import * as fs from 'node:fs';
import * as path from 'node:path';

// Use dynamic imports to load snapshots
const SNAPSHOTS: Record<string, object> = {};
let snapshotsLoaded = false;

/**
 * Dynamically loads wallet snapshots from the storage-snapshots directory
 */
async function loadSnapshots(): Promise<void> {
  if (snapshotsLoaded) return;

  const snapshotsDir = path.resolve(__dirname, 'storage-snapshots');

  // Check for mainnetPrimaryExtWallet
  const mainnetPath = path.join(snapshotsDir, 'mainnetPrimaryExtWallet.ts');
  if (fs.existsSync(mainnetPath)) {
    try {
      const module = await import(
        './storage-snapshots/mainnetPrimaryExtWallet'
      );
      SNAPSHOTS.mainnetPrimaryExtWallet = module.mainnetPrimaryExtWallet;
    } catch (e) {
      console.warn('mainnetPrimaryExtWallet snapshot not available:', e);
    }
  }

  // Check for testnetPrimaryExtWallet
  const testnetPath = path.join(snapshotsDir, 'testnetPrimaryExtWallet.ts');
  if (fs.existsSync(testnetPath)) {
    try {
      const module = await import(
        './storage-snapshots/testnetPrimaryExtWallet'
      );
      SNAPSHOTS.testnetPrimaryExtWallet = module.testnetPrimaryExtWallet;
    } catch (e) {
      console.warn('testnetPrimaryExtWallet snapshot not available:', e);
    }
  }

  snapshotsLoaded = true;
}

export const loadWalletSnapshot = async (
  context: BrowserContext,
  snapshotName: string,
  _password: string,
): Promise<void> => {
  try {
    // Ensure snapshots are loaded
    await loadSnapshots();

    console.log(`Loading wallet snapshot: ${snapshotName}`);

    // Get the snapshot data
    const snapshot = SNAPSHOTS[snapshotName];

    if (!snapshot) {
      throw new Error(
        `Snapshot "${snapshotName}" not found. Available snapshots: ${Object.keys(SNAPSHOTS).join(', ')}`,
      );
    }

    // Parse the snapshot data if it's a string
    const parsedSnapshot =
      typeof snapshot === 'string' ? JSON.parse(snapshot) : snapshot;

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
