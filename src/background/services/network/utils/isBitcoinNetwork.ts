import type { Network } from '@avalabs/core-chains-sdk';
import { ChainId } from '@avalabs/core-chains-sdk';

export function isBitcoinNetwork(network: Network) {
  return isBitcoinChainId(network.chainId);
}

export function isBitcoinChainId(chainId: number) {
  return ChainId.BITCOIN === chainId || ChainId.BITCOIN_TESTNET === chainId;
}
