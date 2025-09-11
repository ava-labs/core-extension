import { useNetworkContext } from '@core/ui';
import { useAllTokens } from './useAllTokens';

// TODO: Currently the hook is using favoriteNetwork. It should be changed to enabledNetworks once added.
export const useAllTokensFromEnabledNetworks = () => {
  const { favoriteNetworks } = useNetworkContext();

  return useAllTokens(favoriteNetworks, false);
};
