import { useBridgeQuery } from '@/pages/Bridge/contexts/BridgeQuery';
import { FungibleTokenBalance, getUniqueTokenId } from '@core/types';
import { useCallback } from 'react';

export const usePairFlipper = (
  targetToken: FungibleTokenBalance | undefined,
) => {
  const { updateQuery, targetNetwork } = useBridgeQuery();

  const canFlip = targetToken != null && !!targetNetwork;

  const flip = useCallback(() => {
    if (!canFlip) {
      return;
    }
    updateQuery({
      sourceNetwork: targetNetwork,
      sourceToken: getUniqueTokenId(targetToken),
      sourceTokenQuery: '',
      amount: '',
    });
  }, [canFlip, targetNetwork, targetToken, updateQuery]);

  return {
    flip,
    canFlip,
  };
};
