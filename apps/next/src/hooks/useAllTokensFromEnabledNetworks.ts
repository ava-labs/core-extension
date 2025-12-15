import { useNetworkContext } from '@core/ui';
import { useAllTokens } from './useAllTokens';

export const useAllTokensFromEnabledNetworks = (
  onlyTokensWithBalances?: boolean,
) => {
  const { enabledNetworks } = useNetworkContext();
  const tokens = useAllTokens(enabledNetworks, true);

  return !onlyTokensWithBalances
    ? tokens
    : tokens.filter((token) => token.balance);
};
