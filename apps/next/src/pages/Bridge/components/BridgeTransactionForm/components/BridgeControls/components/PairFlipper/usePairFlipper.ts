import { useBridgeQuery } from '@/pages/Bridge/contexts/BridgeQuery';
import { FungibleTokenBalance, getUniqueTokenId } from '@core/types';
import { useCallback } from 'react';

export const usePairFlipper = (
  targetNetworkId: string,
  targetToken: FungibleTokenBalance | undefined,
) => {
  const { updateQuery } = useBridgeQuery();

  const canFlip = targetToken != null && !!targetNetworkId;

  const flip = useCallback(() => {
    if (!canFlip) {
      return;
    }
    updateQuery({
      sourceNetwork: targetNetworkId,
      sourceToken: getUniqueTokenId(targetToken),
      sourceTokenQuery: '',
      amount: '',
    });
  }, [canFlip, targetNetworkId, targetToken, updateQuery]);

  return {
    flip,
    canFlip,
  };
};
