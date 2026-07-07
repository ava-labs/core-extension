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

  if (network.chainName === HYPERCORE_CHAIN_NAME) {
    return true;
  }

  return (
    network.chainId === HYPEREVM_CHAIN_ID ||
    network.chainName === HYPEREVM_CHAIN_NAME
  );
}
