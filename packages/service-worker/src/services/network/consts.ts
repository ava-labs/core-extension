import { ChainId } from '@avalabs/core-chains-sdk';

// Enabled by default, cannot be disabled
export const NETWORKS_ENABLED_FOREVER = [
  ChainId.AVALANCHE_MAINNET_ID,
  ChainId.AVALANCHE_TESTNET_ID,
  ChainId.AVALANCHE_P,
  ChainId.AVALANCHE_TEST_P,
  ChainId.AVALANCHE_X,
  ChainId.AVALANCHE_TEST_X,
  ChainId.BITCOIN,
  ChainId.BITCOIN_TESTNET,
  ChainId.ETHEREUM_HOMESTEAD,
  ChainId.ETHEREUM_TEST_SEPOLIA,
  ChainId.SOLANA_MAINNET_ID,
  ChainId.SOLANA_DEVNET_ID,
];

// Enabled by default, user can disable them
export const NETWORKS_ENABLED_BY_DEFAULT = [
  42161, //Arbitrum One Mainnet
  10, //Optimism Mainnet
  8453, //Base Mainnet
];
