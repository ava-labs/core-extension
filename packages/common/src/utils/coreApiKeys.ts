/**
 * API keys that must never be baked into a build. They are only needed by
 * E2E runs and local development, which seed them at runtime with:
 *
 * chrome.storage.local.set({
 *   'core.api-keys': { proxy: '…', glacier: '…', markr: '…', idService: '…' },
 * });
 *
 * Stored unencrypted on purpose: the wallet encryption key lives in the same
 * storage area, so encrypting them would add nothing.
 */
export const CORE_API_KEYS_STORAGE_KEY = 'core.api-keys';

const CORE_API_KEY_SERVICES = [
  'proxy',
  'glacier',
  'markr',
  'idService',
] as const;

export type CoreApiKeyService = (typeof CORE_API_KEY_SERVICES)[number];

export type CoreApiKeys = Partial<Record<CoreApiKeyService, string>>;

let cachedKeys: CoreApiKeys = {};
let loadingPromise: Promise<CoreApiKeys> | undefined;

const parseCoreApiKeys = (value: unknown): CoreApiKeys => {
  if (!value || typeof value !== 'object') {
    return {};
  }

  return CORE_API_KEY_SERVICES.reduce<CoreApiKeys>((keys, service) => {
    const key = (value as Record<string, unknown>)[service];

    if (typeof key === 'string' && key.trim()) {
      keys[service] = key.trim();
    }

    return keys;
  }, {});
};

export const loadCoreApiKeys = (): Promise<CoreApiKeys> => {
  if (loadingPromise) {
    return loadingPromise;
  }

  const storage = globalThis.chrome?.storage;

  if (!storage?.local) {
    loadingPromise = Promise.resolve(cachedKeys);
    return loadingPromise;
  }

  let changedBeforeLoad = false;

  storage.onChanged.addListener((changes, areaName) => {
    if (areaName === 'local' && CORE_API_KEYS_STORAGE_KEY in changes) {
      changedBeforeLoad = true;
      cachedKeys = parseCoreApiKeys(
        changes[CORE_API_KEYS_STORAGE_KEY]?.newValue,
      );
    }
  });

  loadingPromise = storage.local
    .get(CORE_API_KEYS_STORAGE_KEY)
    .then((result) => {
      // A write that lands while `get` is in flight is newer than its result.
      if (!changedBeforeLoad) {
        cachedKeys = parseCoreApiKeys(result[CORE_API_KEYS_STORAGE_KEY]);
      }
      return cachedKeys;
    })
    .catch(() => cachedKeys);

  return loadingPromise;
};

export const getCoreApiKey = async (
  service: CoreApiKeyService,
): Promise<string | undefined> => {
  await loadCoreApiKeys();
  return cachedKeys[service];
};

/**
 * For synchronous call sites. Returns `undefined` until the first storage
 * read resolves, so each extension context kicks off `loadCoreApiKeys()` at
 * startup.
 */
export const getCachedCoreApiKey = (
  service: CoreApiKeyService,
): string | undefined => {
  void loadCoreApiKeys();
  return cachedKeys[service];
};
