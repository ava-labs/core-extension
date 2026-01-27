import { Account, FungibleAssetType, FungibleTokenBalance } from '@core/types';

import { useTokensForAccount } from '@/hooks/useTokensForAccount';

import { SwappableToken } from '../types';

export const useSwappableTokensForAccount = (
  account?: Account,
): SwappableToken[] => {
  const tokens = useTokensForAccount(account);

  return tokens.filter((token) => isSwappableToken(token));
};

// TODO: Uncomment as support for more appears
const SWAPPABLE_ASSET_TYPES = [
  'evm_native',
  'evm_erc20',
  // 'avm_native',
  // 'btc_native',
  // 'pvm_native',
  // 'svm_native',
  // 'svm_spl',
] as const satisfies Exclude<FungibleAssetType, 'unknown'>[];

const isSwappableToken = (
  token: FungibleTokenBalance,
): token is SwappableToken =>
  (SWAPPABLE_ASSET_TYPES as FungibleAssetType[]).includes(token.assetType) &&
  token.balance > 0n;
