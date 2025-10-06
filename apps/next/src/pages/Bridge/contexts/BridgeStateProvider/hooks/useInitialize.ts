import { FungibleTokenBalance, getUniqueTokenId } from '@core/types';
import { useEffect } from 'react';
import { BridgeQueryContext } from '../../BridgeQuery';
import { useNextUnifiedBridgeContext } from '../../NextUnifiedBridge';

export function useInitialize(
  query: BridgeQueryContext,
  sourceTokens: FungibleTokenBalance[],
) {
  const { availableChainIds, isReady } = useNextUnifiedBridgeContext();
  const { sourceToken, sourceNetwork, updateQuery } = query;

  useEffect(() => {
    if (!sourceNetwork || !availableChainIds.includes(sourceNetwork)) {
      updateQuery({
        sourceNetwork: availableChainIds[0],
      });
    }
  }, [sourceNetwork, availableChainIds, isReady, updateQuery]);

  useEffect(() => {
    const [firstToken] = sourceTokens;
    if (sourceNetwork && !sourceToken && firstToken) {
      updateQuery({
        sourceToken: getUniqueTokenId(firstToken),
        sourceTokenQuery: '',
      });
    }
  }, [sourceToken, sourceTokens, sourceNetwork, updateQuery]);
}
