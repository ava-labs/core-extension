import { Network } from '@avalabs/core-chains-sdk';

export const HYPEREVM_CHAIN_ID = 999;
export const HYPERCORE_CHAIN_ID = 9999; // synthetic Core list id — not an EVM chain id
export const HYPERCORE_CAIP_ID = 'hlcore:mainnet';

export const HYPEREVM_CHAIN_NAME = 'HyperEVM';
export const HYPERCORE_CHAIN_NAME = 'HyperCore';

export function isHyperliquidChainId(chainId: number) {
  return chainId === HYPEREVM_CHAIN_ID;
}

// HyperCore is display-only: no RPC / send / swap / dApp actions. Match by
// name, synthetic chain id, or CAIP (`hlcore:mainnet`).
export function isHypercoreNetwork(network?: Network & { caipId?: string }) {
  if (!network) {
    return false;
  }

  return (
    network.chainName === HYPERCORE_CHAIN_NAME ||
    network.chainId === HYPERCORE_CHAIN_ID ||
    network.caip2Id === HYPERCORE_CAIP_ID ||
    network.caipId === HYPERCORE_CAIP_ID
  );
}

export function isHyperliquidNetwork(network?: Network & { caipId?: string }) {
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
