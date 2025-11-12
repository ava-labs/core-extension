import { Caip2ChainId } from '@avalabs/vm-module-types';
import { ChainId, SolanaCaip2ChainId } from '@avalabs/core-chains-sdk';

import {
  chainIdToCaip,
  USDC_ADDRESS_C_CHAIN,
  USDC_ADDRESS_ETHEREUM,
  USDC_ADDRESS_SOLANA,
} from '@core/common';
import { NativeTokenBalance, NonNativeFungibleTokenBalance } from '@core/types';

export const SWAP_CAPABLE_CHAIN_IDS = [
  // C-Chain
  chainIdToCaip(ChainId.AVALANCHE_MAINNET_ID),
  // Ethereum
  chainIdToCaip(ChainId.ETHEREUM_HOMESTEAD),
  // Solana Mainnet
  SolanaCaip2ChainId.MAINNET,
] as const satisfies Caip2ChainId[];

// If the user does not choose the source token, we'll auto-select
// the first token in this array that has some balance.
export const DEFAULT_SOURCE_TOKENS = [
  'AVAX',
  'ETH',
  'SOL',
] as const satisfies NativeTokenBalance['symbol'][];

// If the user does not choose the target token, we'll auto-select
// it based on the source token (at the moment, we default to USDC).
export const DEFAULT_TARGET_TOKENS: Record<
  (typeof DEFAULT_SOURCE_TOKENS)[number],
  NonNativeFungibleTokenBalance['address']
> = {
  AVAX: USDC_ADDRESS_C_CHAIN,
  ETH: USDC_ADDRESS_ETHEREUM,
  SOL: USDC_ADDRESS_SOLANA,
};

export const MIN_SLIPPAGE = 0.1;
export const DEFAULT_SLIPPAGE = 0.2;
