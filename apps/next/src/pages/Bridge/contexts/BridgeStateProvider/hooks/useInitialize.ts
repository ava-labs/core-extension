import { findMatchingBridgeAsset } from '@core/common/src/utils/bridge';
import { FungibleTokenBalance, getUniqueTokenId } from '@core/types';
import { useEffect, useRef } from 'react';
import { BridgeQueryContext } from '../../BridgeQuery';
import { useNextUnifiedBridgeContext } from '../../NextUnifiedBridge';

export function useInitialize(
  query: BridgeQueryContext,
  sourceTokens: FungibleTokenBalance[],
) {
  const { availableChainIds, isReady, state } = useNextUnifiedBridgeContext();
  const { sourceToken, sourceNetwork, updateQuery, transactionId } = query;
  const tx = state.pendingTransfers[transactionId];
  const txRef = useRef(tx);
  txRef.current = tx;

  useEffect(() => {
    if (!sourceNetwork || !availableChainIds.includes(sourceNetwork)) {
      updateQuery({
        sourceNetwork:
          txRef.current?.sourceChain.chainId ?? availableChainIds[0],
      });
    }
  }, [sourceNetwork, availableChainIds, isReady, updateQuery, transactionId]);

  useEffect(() => {
    const txAsset = txRef.current?.asset;
    const assetLookup = txAsset ? [txAsset] : [];
    const [firstToken = sourceTokens[0]] = txAsset
      ? sourceTokens.filter((t) => findMatchingBridgeAsset(assetLookup, t))
      : sourceTokens;
    if (sourceNetwork && !sourceToken && firstToken) {
      updateQuery({
        sourceToken: getUniqueTokenId(firstToken),
        sourceTokenQuery: '',
      });
    }
  }, [sourceToken, sourceTokens, sourceNetwork, updateQuery, transactionId]);
}
