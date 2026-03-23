import { NetworkVMType } from '@avalabs/vm-module-types';
import type { Network } from '@core/types';

const ETH_NATIVE_EVM_CHAIN_IDS: ReadonlySet<number> = new Set([
  1, // Ethereum
  11155111, // Sepolia
  8453, // Base
  42161, // Arbitrum One
  10, // Optimism
]);

/** Used when activity rows need a native symbol but the network list is unavailable or incomplete. */
export function getEthNativeSymbolForKnownChainId(
  chainId: number,
): string | undefined {
  return ETH_NATIVE_EVM_CHAIN_IDS.has(chainId) ? 'ETH' : undefined;
}

/**
 * Remote tokenlist entries sometimes omit `networkToken.symbol` for L2 native currency.
 * Portfolio, activity, and Moralis converters assume a non-empty symbol for native ETH assets.
 * Tokenlist payloads may also set `networkToken` to null; optional chaining avoids throwing here.
 */
export function withDefaultNativeTokenSymbol<T extends Network>(network: T): T {
  const token = network.networkToken;
  const trimmed = token?.symbol?.trim();
  if (trimmed) {
    return network;
  }
  if (network.vmName !== NetworkVMType.EVM) {
    return network;
  }
  if (!ETH_NATIVE_EVM_CHAIN_IDS.has(network.chainId)) {
    return network;
  }
  const name = token?.name?.trim();
  const merged = token ?? {};
  return {
    ...network,
    networkToken: {
      description: merged.description ?? '',
      decimals: merged.decimals ?? 18,
      logoUri: merged.logoUri ?? '',
      symbol: 'ETH',
      name: name || 'Ether',
    },
  };
}
