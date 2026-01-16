import { useTokensForAccount } from '@/hooks/useTokensForAccount';
import {
  Account,
  FungibleAssetType,
  FungibleTokenBalance,
  NetworkWithCaipId,
} from '@core/types';
import { SwappableToken } from '../types';
import { useSwapEnabledNetworks } from './useSwapEnabledNetworks';

export const useSwappableTokensForAccount = (
  account?: Account,
): SwappableToken[] => {
  const tokens = useTokensForAccount(account);
  const networks = useSwapEnabledNetworks();

  return tokens.filter((token) => isSwappableToken(token, networks));
};

// TODO: Uncomment as support for more appears
const SWAPPABLE_ASSET_TYPES = [
  // 'avm_native',
  // 'btc_native',
  'evm_native',
  // 'pvm_native',
  // 'svm_native',
  'evm_erc20',
  // 'svm_spl',
] as const satisfies Exclude<FungibleAssetType, 'unknown'>[];

const isTokenOnSwapEnabledNetwork = (
  token: FungibleTokenBalance,
  networks: NetworkWithCaipId[],
): boolean => {
  return networks.some((network) => network.chainId === token.coreChainId);
};

const isSwappableToken = (
  token: FungibleTokenBalance,
  networks: NetworkWithCaipId[],
): token is SwappableToken =>
  (SWAPPABLE_ASSET_TYPES as FungibleAssetType[]).includes(token.assetType) &&
  token.balance > 0n &&
  isTokenOnSwapEnabledNetwork(token, networks);
