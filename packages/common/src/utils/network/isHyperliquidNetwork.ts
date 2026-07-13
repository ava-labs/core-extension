import { Network } from '@avalabs/core-chains-sdk';

export const HYPEREVM_CHAIN_ID = 999;
export const HYPERCORE_CHAIN_ID = 9999; // synthetic, HyperCore has no real chain id

export const HYPEREVM_CHAIN_NAME = 'HyperEVM';
export const HYPERCORE_CHAIN_NAME = 'HyperCore';

export function isHyperliquidChainId(chainId: number) {
  return chainId === HYPEREVM_CHAIN_ID;
}

// HyperCore is a synthetic, display-only network: it is modeled as EVM for
// reuse but has no RPC and no send/receive/swap/dApp actions, so EVM code paths
// must guard against it. Matched by name because it has no canonical chain id.
export function isHypercoreNetwork(network?: Network) {
  if (!network) {
    return false;
  }

  return (
    network.chainName === HYPERCORE_CHAIN_NAME ||
    network.chainId === HYPERCORE_CHAIN_ID
  );
}

export function isHyperliquidNetwork(network?: Network) {
  if (!network) {
    return false;
  }

  if (isHypercoreNetwork(network)) {
    return true;
  }

  return (
    isHyperliquidChainId(network.chainId) ||
    network.chainName === HYPEREVM_CHAIN_NAME
  );
}
