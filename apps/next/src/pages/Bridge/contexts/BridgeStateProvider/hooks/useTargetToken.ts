import { FungibleTokenBalance } from '@core/types';
import { useNetworkContext } from '@core/ui';
import { useMemo } from 'react';

// TODO: Find the actual target token based on the source token and the target network
export function useTargetToken(
  targetNetworkId: string,
  sourceToken: FungibleTokenBalance | undefined,
) {
  const { getNetwork } = useNetworkContext();
  const targetToken = useMemo<FungibleTokenBalance | undefined>(() => {
    if (!sourceToken) {
      return undefined;
    }
    return {
      ...sourceToken,
      coreChainId: getNetwork(targetNetworkId)?.chainId ?? -1,
    };
  }, [sourceToken, getNetwork, targetNetworkId]);

  return targetToken;
}
