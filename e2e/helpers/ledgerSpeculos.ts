import type { BrowserContext } from '@playwright/test';
import { getServiceWorkerWithStorage } from './serviceWorker';

// Must match LEDGER_SPECULOS_URL_STORAGE_KEY in @core/common.
const LEDGER_SPECULOS_URL_STORAGE_KEY = 'core.e2e.ledger-speculos-url';

/** Only honoured by non-production builds. */
export async function seedLedgerSpeculosUrl(
  context: BrowserContext,
  url: string,
): Promise<void> {
  const serviceWorker = await getServiceWorkerWithStorage(context);

  await serviceWorker.evaluate(
    ({ storageKey, value }) =>
      chrome.storage.local.set({ [storageKey]: value }),
    { storageKey: LEDGER_SPECULOS_URL_STORAGE_KEY, value: url },
  );
}
