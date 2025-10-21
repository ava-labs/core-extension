import { FungibleTokenBalance, getUniqueTokenId } from '@core/types';
import { useCallback, useRef } from 'react';
import { BridgeQueryContext } from '../../BridgeQuery';
import { useNextUnifiedBridgeContext } from '../../NextUnifiedBridge';

type UsePairFlipperParams = {
  tokens: FungibleTokenBalance[];
  targetNetworkId: string;
  query: BridgeQueryContext;
};

export const usePairFlipper = ({
  tokens,
  targetNetworkId,
  query,
}: UsePairFlipperParams) => {
  const queryRef = useRef(query);
  queryRef.current = query;
  const tokensRef = useRef(tokens);
  tokensRef.current = tokens;
  const { getAssetIdentifierOnTargetChain } = useNextUnifiedBridgeContext();

  const flipPair = useCallback(() => {
    const { sourceToken, updateQuery } = queryRef.current;
    const srcToken = tokensRef.current.find(
      (t) => getUniqueTokenId(t) === sourceToken,
    )!;
    updateQuery({
      sourceNetwork: targetNetworkId,
      sourceToken: getAssetIdentifierOnTargetChain(
        srcToken.symbol,
        targetNetworkId,
      ),
      sourceTokenQuery: '',
      amount: '',
    });
  }, [getAssetIdentifierOnTargetChain, targetNetworkId]);

  return flipPair;
};
