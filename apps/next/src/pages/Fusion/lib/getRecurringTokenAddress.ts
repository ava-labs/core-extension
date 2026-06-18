import { type Address } from 'viem';
import { type Asset, ERC_ZERO_ADDRESS, TokenType } from '@avalabs/fusion-sdk';

// Recurring swaps are EVM-only (C-Chain). Markr represents the native asset
// with the zero address (see `assetToAddressString` in the SDK). Returns
// `undefined` for non-EVM assets (e.g. SPL), which are never recurring-eligible.
export const getRecurringTokenAddress = (asset: Asset): Address | undefined => {
  if (asset.type === TokenType.NATIVE) {
    return ERC_ZERO_ADDRESS;
  }

  if (asset.type === TokenType.ERC20) {
    return asset.address;
  }

  return undefined;
};
