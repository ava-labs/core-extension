import { Network, NETWORKS_ENABLED_FOREVER } from '@core/types';

function getChainId(network: Network | Network['chainId']) {
  return typeof network === 'number' ? network : network.chainId;
}

function getPriority(network: Network | Network['chainId']) {
  const chainId = getChainId(network);
  const hardcodedIndex = NETWORKS_ENABLED_FOREVER.indexOf(chainId);
  if (hardcodedIndex !== -1) {
    return hardcodedIndex;
  }
  if (typeof network !== 'number' && network.isAlwaysEnabled) {
    return NETWORKS_ENABLED_FOREVER.length;
  }
  return -1;
}

export function promoteNetworks<T extends Network | Network['chainId']>(
  one: T,
  another: T,
) {
  const onePriority = getPriority(one);
  const anotherPriority = getPriority(another);

  if (onePriority === -1 && anotherPriority === -1) {
    return 0;
  }

  if (onePriority === -1) {
    return 1;
  }

  if (anotherPriority === -1) {
    return -1;
  }

  return onePriority - anotherPriority;
}
