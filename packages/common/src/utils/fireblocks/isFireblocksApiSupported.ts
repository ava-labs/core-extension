import { FireblocksAccount } from '@core/types';

// If we have the BTC address for a Fireblocks account, that means that we were
// provided the correct API credentials (otherwise we wouldn't be able to fetch
// the address).
export function isFireblocksApiSupported(account?: FireblocksAccount) {
  return Boolean(account?.addressBTC);
}
