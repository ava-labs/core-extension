import { useNetworkContext } from '@core/ui';
import { useAllTokens } from './useAllTokens';

// TODO: Currently the hook is using favoriteNetwork. It should be changed to enabledNetworks once added.
export const useAllTokensFromEnabledNetworks = (
  onlyTokensWithBalances?: boolean,
  hideMalicious?: boolean,
) => {
  const { enabledNetworks } = useNetworkContext();
  const tokens = useAllTokens(enabledNetworks, hideMalicious);

  return !onlyTokensWithBalances
    ? tokens
    : tokens.filter((token) => token.balance);
};
