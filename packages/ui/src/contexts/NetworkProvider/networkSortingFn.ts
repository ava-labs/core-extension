import {
  isAvalancheChainId,
  isPchainNetworkId,
  isXchainNetworkId,
} from '@core/common';
import { Network } from '@core/types';
import { flow, overSome } from 'lodash';

function getChainId(network: Network | Network['chainId']) {
  return typeof network === 'number' ? network : network.chainId;
}

const isAnyAvalancheChain = flow(
  getChainId,
  overSome([isAvalancheChainId, isPchainNetworkId, isXchainNetworkId]),
);

function getAvalancheChainOrder(network: Network | Network['chainId']) {
  const chainId = getChainId(network);
  if (isAvalancheChainId(chainId)) return 0;
  if (isPchainNetworkId(chainId)) return 1;
  if (isXchainNetworkId(chainId)) return 2;

  throw new Error('Network is not an Avalanche network');
}

export function promoteAvalancheNetworks<
  T extends Network | Network['chainId'],
>(one: T, another: T) {
  const oneIsAvalanche = isAnyAvalancheChain(one);
  const anotherIsAvalanche = isAnyAvalancheChain(another);
  const bothAreAvalanche = oneIsAvalanche && anotherIsAvalanche;

  if (bothAreAvalanche) {
    return getAvalancheChainOrder(one) - getAvalancheChainOrder(another);
  }

  if (oneIsAvalanche) {
    return -1;
  }

  if (anotherIsAvalanche) {
    return 1;
  }

  return 0;
}
