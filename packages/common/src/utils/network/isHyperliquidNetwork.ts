import { Network } from '@avalabs/core-chains-sdk';

export const HYPEREVM_CHAIN_ID = 999;
export const HYPERCORE_CHAIN_ID = 9999; // synthetic, HyperCore has no real chain id

export const HYPEREVM_CHAIN_NAME = 'HyperEVM';
export const HYPERCORE_CHAIN_NAME = 'HyperCore';

export function isHyperliquidChainId(chainId: number) {
  return chainId === HYPEREVM_CHAIN_ID;
}

export function isHyperliquidNetwork(network?: Network) {
  if (!network) {
    return false;
  }

  // HyperCore is matched by name because it has no canonical chain id.
  if (network.chainName === HYPERCORE_CHAIN_NAME) {
    return true;
  }

  return (
    isHyperliquidChainId(network.chainId) ||
    network.chainName === HYPEREVM_CHAIN_NAME
  );
}
