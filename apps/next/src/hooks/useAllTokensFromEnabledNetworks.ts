import { useNetworkContext, useSettingsContext } from '@core/ui';
import { isEvmFungibleToken } from '@core/types';
import { useAllTokens } from './useAllTokens';

export const useAllTokensFromEnabledNetworks = (
  onlyTokensWithBalances?: boolean,
) => {
  const { enabledNetworks } = useNetworkContext();
  const { customTokens } = useSettingsContext();
  // The full per-network catalog is only needed when surfacing tokens the user
  // does not hold; the held+custom set already covers the balance-only view.
  const tokens = useAllTokens(enabledNetworks, true, !onlyTokensWithBalances);

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
