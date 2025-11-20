import { useAllTokens } from '@/hooks/useAllTokens';
import { NetworkWithCaipId } from '@core/types';
import { useNetworkContext } from '@core/ui';
import { useMemo } from 'react';

export function useNetworkTokens(networkId: NetworkWithCaipId['caipId']) {
  const { getNetwork } = useNetworkContext();
  const networks = useMemo(() => {
    const network = getNetwork(networkId);
    return network ? [network] : [];
  }, [networkId, getNetwork]);

  return useAllTokens(networks);
}
