import { Network } from '@avalabs/core-chains-sdk';

export const HYPEREVM_CHAIN_ID = 999;
export const HYPERCORE_CHAIN_ID = 1337;

export function isHyperliquidChainId(chainId: number) {
  return chainId === HYPEREVM_CHAIN_ID;
}

export function isHyperliquidNetwork(network?: Network) {
  if (!network) {
    return false;
  }

  if (network.chainId === HYPEREVM_CHAIN_ID) {
    return true;
  }

  return network.chainName === 'HyperCore' || network.chainName === 'HyperEVM';
}
