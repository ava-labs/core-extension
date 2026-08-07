import {
  ChainList,
  NETWORKS_ENABLED_BY_DEFAULT,
  NETWORKS_ENABLED_FOREVER,
} from '@core/types';

/**
 * Hybrid resolution (always-enabled networks):
 *   - the hardcoded `NETWORKS_ENABLED_FOREVER` is the base set
 *   - the API's `isAlwaysEnabled` flag overrides the base set: `true` adds a
 *     network, `false` removes it, `undefined` leaves the base set untouched
 *
 * Hybrid resolution (default-enabled networks):
 *   - the hardcoded `NETWORKS_ENABLED_BY_DEFAULT` is the base set
 *   - the API's `isEnabledByDefault` flag overrides the base set: `true` adds a
 *     network, `false` removes it, `undefined` leaves the base set untouched
 *   - always-enabled networks are always included, regardless of the flag
 */

export function getAlwaysEnabledNetworkIds(chainList: ChainList): number[] {
  const ids = new Set<number>(NETWORKS_ENABLED_FOREVER);

  for (const network of Object.values(chainList)) {
    if (network.isAlwaysEnabled === true) {
      ids.add(network.chainId);
    } else if (network.isAlwaysEnabled === false) {
      ids.delete(network.chainId);
    }
  }

  return [...ids];
}

export function getDefaultEnabledNetworkIds(chainList: ChainList): number[] {
  const ids = new Set<number>(NETWORKS_ENABLED_BY_DEFAULT);

  for (const network of Object.values(chainList)) {
    if (network.isEnabledByDefault === true) {
      ids.add(network.chainId);
    } else if (network.isEnabledByDefault === false) {
      ids.delete(network.chainId);
    }
  }

  for (const id of getAlwaysEnabledNetworkIds(chainList)) {
    ids.add(id);
  }

  return [...ids];
}
