import { useMemo } from 'react';

import { useNetworkContext } from '@core/ui';
import { getUniqueTokenId } from '@core/types';

import { useAllTokens } from '@/hooks/useAllTokens';

import { SwappableToken } from '../types';

export const useTargetSwapTokens = (
  fromToken?: SwappableToken,
): SwappableToken[] => {
  const { getNetwork } = useNetworkContext();
  const networks = useMemo(() => {
    const network = fromToken?.coreChainId
      ? getNetwork(fromToken?.coreChainId)
      : null;

    return network ? [network] : [];
  }, [fromToken?.coreChainId, getNetwork]);

  const matchingNetworkTokens = useAllTokens(networks);

  return useMemo(() => {
    return fromToken
      ? (matchingNetworkTokens.filter(
          (token) => getUniqueTokenId(token) !== getUniqueTokenId(fromToken),
        ) as SwappableToken[])
      : [];
  }, [matchingNetworkTokens, fromToken]);
};
