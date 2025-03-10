// This is copied from @solana/wallet-standard-chains

import type { IdentifierString } from '@wallet-standard/base';
import type { Transaction, VersionedTransaction } from '@solana/web3.js';
import { SolanaCaip2ChainId } from '@avalabs/core-chains-sdk';

/** Solana Mainnet (beta) cluster, e.g. https://api.mainnet-beta.solana.com */
export const SOLANA_MAINNET_CHAIN = 'solana:mainnet';

/** Solana Devnet cluster, e.g. https://api.devnet.solana.com */
export const SOLANA_DEVNET_CHAIN = 'solana:devnet';

/** Solana Testnet cluster, e.g. https://api.testnet.solana.com */
export const SOLANA_TESTNET_CHAIN = 'solana:testnet';

/** Solana Localnet cluster, e.g. http://localhost:8899 */
// export const SOLANA_LOCALNET_CHAIN = 'solana:localnet';

/** Array of all Solana clusters */
export const SOLANA_CHAINS = [
  SOLANA_MAINNET_CHAIN,
  SOLANA_DEVNET_CHAIN,
  SOLANA_TESTNET_CHAIN,
  // SOLANA_LOCALNET_CHAIN,
] as const;

/** Type of all Solana clusters */
export type SolanaChain = (typeof SOLANA_CHAINS)[number];

export const SOLANA_CHAIN_TO_CAIP2_ID = {
  [SOLANA_MAINNET_CHAIN]: SolanaCaip2ChainId.MAINNET,
  [SOLANA_DEVNET_CHAIN]: SolanaCaip2ChainId.DEVNET,
  [SOLANA_TESTNET_CHAIN]: SolanaCaip2ChainId.TESTNET,
};

/**
 * Check if a chain corresponds with one of the Solana clusters.
 */
export function isSolanaChain(chain: IdentifierString): chain is SolanaChain {
  return SOLANA_CHAINS.includes(chain as SolanaChain);
}

export function getSolanaCaip2Id(chain: SolanaChain): SolanaCaip2ChainId {
  return SOLANA_CHAIN_TO_CAIP2_ID[chain];
}

export function isVersionedTransaction(
  transaction: Transaction | VersionedTransaction,
): transaction is VersionedTransaction {
  return 'version' in transaction;
}
