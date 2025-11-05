import { FungibleTokenBalance, getUniqueTokenId } from '@core/types';
import { useCallback } from 'react';
import { useBridgeQuery } from '../../BridgeQuery';

type UsePairFlipperParams = {
  targetNetworkId: string;
  targetToken: FungibleTokenBalance | undefined;
};

export const usePairFlipper = ({
  targetNetworkId,
  targetToken,
}: UsePairFlipperParams) => {
  const { updateQuery } = useBridgeQuery();

  const flipPair = useCallback(() => {
    if (!targetToken || !targetNetworkId) {
      return;
    }
    updateQuery({
      sourceNetwork: targetNetworkId,
      sourceToken: getUniqueTokenId(targetToken),
      sourceTokenQuery: '',
      amount: '',
    });
  }, [targetNetworkId, targetToken, updateQuery]);

  return flipPair;
};
