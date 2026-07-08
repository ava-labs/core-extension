import { Network } from '@avalabs/core-chains-sdk';

export const HYPEREVM_CHAIN_ID = 999;

const HYPERCORE_CHAIN_NAME = 'HyperCore';
const HYPEREVM_CHAIN_NAME = 'HyperEVM';

export function isHyperliquidChainId(chainId: number) {
  return chainId === HYPEREVM_CHAIN_ID;
}

export function isHyperliquidNetwork(network?: Network) {
  if (!network) {
    return false;
  }

  // HyperCore is not an EVM chain and has no canonical chain id (Fusion/Relay use a
  // synthetic eip155:1337 at the SDK boundary, which collides with local devnets).
  if (network.chainName === HYPERCORE_CHAIN_NAME) {
    return true;
  }

  return (
    isHyperliquidChainId(network.chainId) ||
    network.chainName === HYPEREVM_CHAIN_NAME
  );
}
