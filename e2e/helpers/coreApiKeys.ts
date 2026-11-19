import { expect, type BrowserContext } from '@playwright/test';

// Must match CORE_API_KEYS_STORAGE_KEY in @core/common.
const CORE_API_KEYS_STORAGE_KEY = 'core.api-keys';

const CORE_API_KEY_ENV_VARS = {
  proxy: 'CORE_PROXY_API_KEY',
  glacier: 'GLACIER_API_KEY',
  markr: 'MARKR_API_TOKEN',
  idService: 'ID_SERVICE_API_KEY',
} as const;

type CoreApiKeys = Partial<Record<keyof typeof CORE_API_KEY_ENV_VARS, string>>;

function getCoreApiKeysFromEnv(): CoreApiKeys {
  return Object.entries(CORE_API_KEY_ENV_VARS).reduce<CoreApiKeys>(
    (keys, [service, envVar]) => {
      const value = process.env[envVar]?.trim();
      if (value) {
        keys[service as keyof CoreApiKeys] = value;
      }
      return keys;
    },
    {},
  );
}

/**
 * Seeds the API keys the extension reads at runtime instead of having them
 * baked into the build. Runs in the service worker because it is the first
 * extension context available; the extension picks the keys up through
 * `chrome.storage.onChanged` even if it already started.
 */
export async function seedCoreApiKeys(context: BrowserContext): Promise<void> {
  const keys = getCoreApiKeysFromEnv();
  const services = Object.keys(keys);

  if (services.length === 0) {
    console.log('No Core API keys in env; extension runs without them.');
    return;
  }

  const serviceWorker =
    context.serviceWorkers()[0] ??
    (await context.waitForEvent('serviceworker', { timeout: 30_000 }));

  // Playwright can attach before Chrome binds the extension APIs onto
  // `chrome`, so `chrome.storage` is briefly undefined.
  await expect
    .poll(
      () =>
        serviceWorker.evaluate(() =>
          Boolean(globalThis.chrome?.storage?.local),
        ),
      { timeout: 10_000, message: 'chrome.storage never became available' },
    )
    .toBe(true);

  await serviceWorker.evaluate(
    ({ storageKey, value }) =>
      chrome.storage.local.set({ [storageKey]: value }),
    { storageKey: CORE_API_KEYS_STORAGE_KEY, value: keys },
  );

  console.log(`Seeded Core API keys for: ${services.join(', ')}`);
}
