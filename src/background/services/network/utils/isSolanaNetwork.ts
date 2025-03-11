import { Network, ChainId } from '@avalabs/core-chains-sdk';

export function isSolanaNetwork(network?: Network) {
  return network ? isSolanaChainId(network.chainId) : false;
}

export function isSolanaChainId(chainId: number) {
  return (
    ChainId.SOLANA_DEVNET_ID === chainId ||
    ChainId.SOLANA_MAINNET_ID === chainId ||
    ChainId.SOLANA_TESTNET_ID === chainId
  );
}
