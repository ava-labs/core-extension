import { address } from '@solana/kit';
import { Asset, TokenType } from '@avalabs/fusion-sdk';

import { FungibleAssetType } from '@core/types';

import {
  HYPERLIQUID_USDC_TOKEN_ADDRESS,
  isHypercoreUsdcIdentity,
} from '../../../../lib/isHypercoreUsdcToken';

export const buildAsset = (
  assetType: FungibleAssetType,
  name: string,
  symbol: string,
  decimals: number,
  tokenAddress?: string,
  coreChainId?: number,
): Asset => {
  switch (assetType) {
    case 'evm_native':
      // HyperCore USDC is modeled as chain-native in balances, but Markr
      // expects the Hyperliquid spot token id (zero address), not NATIVE.
      if (
        coreChainId !== undefined &&
        isHypercoreUsdcIdentity(coreChainId, symbol)
      ) {
        return {
          name,
          symbol,
          decimals,
          type: TokenType.ERC20,
          address: HYPERLIQUID_USDC_TOKEN_ADDRESS,
        };
      }
    // falls through
    case 'svm_native':
    case 'avm_native':
    case 'btc_native':
    case 'pvm_native':
      return {
        name,
        type: TokenType.NATIVE,
        symbol,
        decimals,
      };
    case 'evm_erc20':
      return {
        name,
        address: tokenAddress as `0x${string}`,
        type: TokenType.ERC20,
        decimals,
        symbol,
      };
    case 'svm_spl':
      return {
        name,
        type: TokenType.SPL,
        decimals,
        symbol: symbol,
        address: address(tokenAddress!),
      };
    case 'hypercore_spot':
    case 'unknown':
      throw new Error(`Unknown asset type: ${assetType}`);
  }
};
