import { isProductionBuild } from './environment';

/**
 * Base URL of a Speculos (Ledger emulator) REST API, seeded by E2E runs with:
 *
 * chrome.storage.local.set({ 'core.e2e.ledger-speculos-url': 'http://localhost:5050' });
 *
 * Ignored in production builds.
 */
export const LEDGER_SPECULOS_URL_STORAGE_KEY = 'core.e2e.ledger-speculos-url';

const LOOPBACK_HOSTNAMES = new Set(['localhost', '127.0.0.1']);

export const parseLedgerSpeculosUrl = (value: unknown): string | undefined => {
  if (typeof value !== 'string') {
    return undefined;
  }

  try {
    const url = new URL(value.trim());

    if (
      (url.protocol !== 'http:' && url.protocol !== 'https:') ||
      !LOOPBACK_HOSTNAMES.has(url.hostname)
    ) {
      return undefined;
    }

    return url.origin;
  } catch {
    return undefined;
  }
};

export const getLedgerSpeculosUrl = async (): Promise<string | undefined> => {
  if (isProductionBuild()) {
    return undefined;
  }

  const storage = globalThis.chrome?.storage?.local;

  if (!storage) {
    return undefined;
  }

  try {
    const result = await storage.get(LEDGER_SPECULOS_URL_STORAGE_KEY);
    return parseLedgerSpeculosUrl(result[LEDGER_SPECULOS_URL_STORAGE_KEY]);
  } catch {
    return undefined;
  }
};
