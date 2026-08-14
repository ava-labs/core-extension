import { useNetworkContext, useSettingsContext } from '@core/ui';
import { isEvmFungibleToken } from '@core/types';
import { useAllTokens } from './useAllTokens';

export const useAllTokensFromEnabledNetworks = (
  onlyTokensWithBalances?: boolean,
) => {
  const { enabledNetworks } = useNetworkContext();
  const { customTokens } = useSettingsContext();
  const tokens = useAllTokens(enabledNetworks, true);

  if (!onlyTokensWithBalances) {
    return tokens;
  }

  // Keep tokens with a balance, plus user-added custom tokens (which may have a zero balance)
  // so a token the user explicitly added always stays visible/manageable.
  return tokens.filter((token) => {
    if (token.balance) {
      return true;
    }
    const address =
      'address' in token
        ? isEvmFungibleToken(token)
          ? token.address.toLowerCase()
          : token.address
        : undefined;
    return address
      ? Boolean(customTokens?.[token.coreChainId]?.[address])
      : false;
  });
};
