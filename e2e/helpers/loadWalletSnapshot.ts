import type { BrowserContext, Page } from '@playwright/test';
import * as fs from 'node:fs';
import * as path from 'node:path';
import { TEST_CONFIG } from '../constants';

/**
 * Dynamically loads snapshot data from files in the storage-snapshots directory.
 * Snapshots are downloaded from AWS S3 in CI, not committed to git.
 */
function loadSnapshotFromFile(snapshotName: string): object | null {
  const snapshotsDir = path.resolve(__dirname, 'storage-snapshots');
  const tsFilePath = path.join(snapshotsDir, `${snapshotName}.ts`);
  const jsonFilePath = path.join(snapshotsDir, `${snapshotName}.json`);

  // Try to load TypeScript file first (for backward compatibility)
  if (fs.existsSync(tsFilePath)) {
    try {
      // Dynamic require for TypeScript files
      // eslint-disable-next-line @typescript-eslint/no-require-imports
      const module = require(tsFilePath);
      // The snapshot might be the default export or a named export matching the filename
      return module.default || module[snapshotName] || module;
    } catch (error) {
      console.error(
        `Error loading TypeScript snapshot ${snapshotName}:`,
        error,
      );
    }
  }

  // Try to load JSON file
  if (fs.existsSync(jsonFilePath)) {
    try {
      const content = fs.readFileSync(jsonFilePath, 'utf-8');
      return JSON.parse(content);
    } catch (error) {
      console.error(`Error loading JSON snapshot ${snapshotName}:`, error);
    }
  }

  return null;
}

/**
 * Gets available snapshot names from the storage-snapshots directory
 */
function getAvailableSnapshots(): string[] {
  const snapshotsDir = path.resolve(__dirname, 'storage-snapshots');

  if (!fs.existsSync(snapshotsDir)) {
    return [];
  }

  const files = fs.readdirSync(snapshotsDir);
  return files
    .filter((f) => f.endsWith('.ts') || f.endsWith('.json'))
    .filter((f) => f !== 'README.md')
    .map((f) => f.replace(/\.(ts|json)$/, ''));
}

export const loadWalletSnapshot = async (
  context: BrowserContext,
  snapshotName: string,
  _password: string,
): Promise<void> => {
  try {
    console.log(`Loading wallet snapshot: ${snapshotName}`);

    // Dynamically load the snapshot from file
    const snapshot = loadSnapshotFromFile(snapshotName);

    if (!snapshot) {
      const available = getAvailableSnapshots();
      throw new Error(
        `Snapshot "${snapshotName}" not found. Available snapshots: ${available.length > 0 ? available.join(', ') : 'none (download from S3 first)'}`,
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

    // If no extension page exists, use the known extension ID directly
    if (!extensionPage) {
      const extensionId = TEST_CONFIG.extension.id;
      console.log(`Using extension ID: ${extensionId}`);

      // Create a new page and navigate to the extension popup
      extensionPage = await context.newPage();
      const extensionUrl = `chrome-extension://${extensionId}/popup.html`;
      await extensionPage.goto(extensionUrl, { waitUntil: 'domcontentloaded' });

      // Wait a bit for the extension to initialize
      await extensionPage.waitForTimeout(1000);
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
            chrome.storage.local.set(data, () => {
              if (chrome.runtime.lastError) {
                console.error(
                  'Error setting storage:',
                  chrome.runtime.lastError,
                );
                reject(chrome.runtime.lastError);
              } else {
                // Verify the data was stored correctly
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

    // Reload the extension page to pick up the new storage data
    console.log('Reloading extension to apply snapshot data...');
    await extensionPage.reload({ waitUntil: 'domcontentloaded' });

    // Wait for the extension to fully initialize with the new data
    await extensionPage.waitForTimeout(3000);

    // Close this temporary page - a new one will be opened by the fixture
    await extensionPage.close();
    console.log('✓ Extension reloaded and ready');
  } catch (error) {
    console.error('Error loading wallet snapshot:', error);
    throw error;
  }
};
