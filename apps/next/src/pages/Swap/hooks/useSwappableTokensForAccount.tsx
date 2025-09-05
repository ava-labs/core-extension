import { useTokensForAccount } from '@/hooks/useTokensForAccount';
import {
  Account,
  FungibleAssetType,
  FungibleTokenBalance,
  NetworkWithCaipId,
} from '@core/types';
import { SwappableAssetType, SwappableToken } from '../types';
import { useSwapEnabledNetworks } from './useSwapEnabledNetworks';

export const useSwappableTokensForAccount = (
  account?: Account,
): SwappableToken[] => {
  const tokens = useTokensForAccount(account);
  const networks = useSwapEnabledNetworks();

  return tokens.filter((token) => isSwappableToken(token, networks));
};

const SWAPPABLE_ASSET_TYPES = [
  'evm_erc20',
  'evm_native',
  'svm_native',
  'svm_spl',
] as const satisfies SwappableAssetType[];

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
