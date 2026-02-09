import { address } from '@solana/kit';
import { Asset, TokenType } from '@avalabs/unified-asset-transfer';

import { FungibleAssetType } from '@core/types';

export const buildAsset = (
  assetType: FungibleAssetType,
  name: string,
  symbol: string,
  decimals: number,
  tokenAddress?: string,
): Asset => {
  switch (assetType) {
    case 'evm_native':
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
    case 'unknown':
      throw new Error(`Unknown asset type: ${assetType}`);
  }
};
