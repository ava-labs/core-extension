import type { BrowserContext, Page } from '@playwright/test';
import * as fs from 'node:fs';
import * as path from 'node:path';
import { TEST_CONFIG } from '../constants';

const SNAPSHOTS_ROOT = path.resolve(__dirname, 'storage-snapshots');

/**
 * Returns the ordered list of directories to search for a snapshot.
 * Primary: storage-snapshots/<SNAPSHOT_SET>/ (defaults to 'alpha' when unset).
 * Fallback: storage-snapshots/ (legacy flat layout).
 */
function getSnapshotSearchPaths(): string[] {
  const set = process.env.SNAPSHOT_SET ?? 'alpha';
  return [path.join(SNAPSHOTS_ROOT, set), SNAPSHOTS_ROOT];
}

/**
 * Dynamically loads snapshot data from files in the storage-snapshots directory.
 * Snapshots are downloaded from AWS S3 in CI, not committed to git.
 */
function loadSnapshotFromFile(snapshotName: string): object | null {
  for (const dir of getSnapshotSearchPaths()) {
    const tsFilePath = path.join(dir, `${snapshotName}.ts`);
    const jsonFilePath = path.join(dir, `${snapshotName}.json`);

    if (fs.existsSync(tsFilePath)) {
      try {
        // eslint-disable-next-line @typescript-eslint/no-require-imports
        const module = require(tsFilePath);
        return module.default || module[snapshotName] || module;
      } catch (error) {
        console.error(
          `Error loading TypeScript snapshot ${snapshotName} from ${dir}:`,
          error,
        );
      }
    }

    if (fs.existsSync(jsonFilePath)) {
      try {
        const content = fs.readFileSync(jsonFilePath, 'utf-8');
        return JSON.parse(content);
      } catch (error) {
        console.error(
          `Error loading JSON snapshot ${snapshotName} from ${dir}:`,
          error,
        );
      }
    }
  }

  return null;
}

/**
 * Gets available snapshot names, searching the active snapshot set first and
 * falling back to the legacy flat layout.
 */
function getAvailableSnapshots(): string[] {
  const names = new Set<string>();

  for (const dir of getSnapshotSearchPaths()) {
    if (!fs.existsSync(dir)) continue;
    for (const f of fs.readdirSync(dir)) {
      if ((f.endsWith('.ts') || f.endsWith('.json')) && f !== 'README.md') {
        names.add(f.replace(/\.(ts|json)$/, ''));
      }
    }
  }

  return Array.from(names);
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

    // If no extension page exists, wait for service worker and create page
    if (!extensionPage) {
      // Wait for extension service worker to be ready (indicates extension is loaded)
      let [serviceWorker] = context.serviceWorkers();
      if (!serviceWorker) {
        console.log('Waiting for extension service worker...');
        serviceWorker = await context.waitForEvent('serviceworker', {
          timeout: 30000,
        });
      }
      console.log('Service worker ready');

      let extensionId = TEST_CONFIG.extension.id;
      try {
        const workerUrl = serviceWorker.url();
        const derivedId = new URL(workerUrl).host;
        if (derivedId) {
          extensionId = derivedId;
        }
      } catch (error) {
        console.warn(
          'Failed to derive extension ID from service worker:',
          error,
        );
      }
      console.log(`Using extension ID: ${extensionId}`);

      // Create a new page and navigate to the extension popup
      extensionPage = await context.newPage();
      const extensionUrl = `chrome-extension://${extensionId}/popup.html`;
      await extensionPage.goto(extensionUrl, { waitUntil: 'domcontentloaded' });

      // Wait for the extension to fully initialize
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
    // This waits for the loading spinner to disappear and actual UI to appear
    console.log('Waiting for extension to initialize...');
    try {
      await extensionPage
        .locator('[data-testid="loading-screen"]')
        .waitFor({ state: 'hidden', timeout: 30000 })
        .catch(() => {});

      const readyIndicator = extensionPage
        .locator('input[type="password"]')
        .or(extensionPage.locator('[data-testid*="settings"]'))
        .or(extensionPage.locator('[data-testid*="nav"]'))
        .first();
      await readyIndicator.waitFor({ state: 'visible', timeout: 30000 });
      console.log('Extension initialized successfully');
    } catch {
      console.log(
        'Timeout waiting for extension initialization, continuing anyway...',
      );
    }

    // Close this temporary page - a new one will be opened by the fixture
    await extensionPage.close();
    console.log('✓ Extension reloaded and ready');
  } catch (error) {
    console.error('Error loading wallet snapshot:', error);
    throw error;
  }
};
