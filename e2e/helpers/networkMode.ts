import { expect, type Page } from '@playwright/test';
import { requestFromServiceWorker } from './serviceWorker';

// ExtensionRequest methods (ui-connection.ts in @core/types).
const NETWORKS_GET_STATE = 'networks_get_state';
const NETWORK_SET_DEVELOPER_MODE = 'network_setDeveloperMode';

type NetworkState = { activeNetwork?: { isTestnet?: boolean } };

async function isTestnetActive(page: Page): Promise<boolean> {
  const state = await requestFromServiceWorker<NetworkState>(
    page,
    NETWORKS_GET_STATE,
  );
  return Boolean(state?.activeNetwork?.isTestnet);
}

/**
 * Ensures testnet (developer) mode is the active network before a test runs.
 *
 * Tests seed a `testnet*` snapshot expecting Fuji to be the active network, but
 * under parallel load the service worker's network init can fail to resolve the
 * stored testnet scope against a contended chainlist and fall back to mainnet
 * (NetworkService.init). Rather than inferring the mode from UI (the portfolio
 * banner only exists on the home route and shares its copy with a transient
 * toast), ask the service worker directly and, if needed, issue the same
 * developer-mode request the Settings toggle fires. No-op when already testnet.
 */
export async function ensureTestnetMode(page: Page): Promise<void> {
  if (await isTestnetActive(page)) {
    return;
  }

  await requestFromServiceWorker(page, NETWORK_SET_DEVELOPER_MODE, [true]);

  await expect
    .poll(() => isTestnetActive(page), { timeout: 30_000 })
    .toBe(true);
}
