import { Network, NETWORKS_ENABLED_FOREVER } from '@core/types';

function getChainId(network: Network | Network['chainId']) {
  return typeof network === 'number' ? network : network.chainId;
}

function getPriority(chainId: number) {
  const index = NETWORKS_ENABLED_FOREVER.indexOf(chainId);
  return index;
}

export function promoteNetworks<T extends Network | Network['chainId']>(
  one: T,
  another: T,
) {
  const onePriority = getPriority(getChainId(one));
  const anotherPriority = getPriority(getChainId(another));

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
