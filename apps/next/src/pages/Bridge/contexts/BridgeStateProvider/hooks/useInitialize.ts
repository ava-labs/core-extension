import { BridgeAsset, BridgeTransfer } from '@avalabs/bridge-unified';
import { findMatchingBridgeAsset } from '@core/common/src/utils/bridge';
import { FungibleTokenBalance, getUniqueTokenId } from '@core/types';
import { useEffect, useRef } from 'react';
import { BridgeQueryContext } from '../../BridgeQuery';
import { useNextUnifiedBridgeContext } from '../../NextUnifiedBridge';

export function useInitialize(
  query: BridgeQueryContext,
  sourceTokens: FungibleTokenBalance[],
  asset: BridgeAsset | undefined,
) {
  const { availableChainIds, isReady, state } = useNextUnifiedBridgeContext();
  const {
    sourceToken,
    sourceNetwork,
    targetNetwork,
    updateQuery,
    transactionId,
  } = query;
  const txRef = useRef<BridgeTransfer | undefined>(undefined);
  txRef.current = state.pendingTransfers[transactionId];

  useEffect(() => {
    if (!sourceNetwork || !availableChainIds.includes(sourceNetwork)) {
      updateQuery({
        sourceNetwork:
          txRef.current?.sourceChain.chainId ?? availableChainIds[0],
      });
    }
  }, [
    sourceNetwork,
    availableChainIds,
    isReady,
    updateQuery,
    transactionId,
    txRef,
  ]);

  useEffect(() => {
    if (!sourceNetwork || !asset) {
      return;
    }

    const chainIds = Object.keys(asset.destinations);

    if (!targetNetwork || !chainIds.includes(targetNetwork)) {
      const fallbackChainId = txRef.current?.targetChain.chainId ?? chainIds[0];
      updateQuery({
        targetNetwork: fallbackChainId,
      });
    }
  }, [
    sourceNetwork,
    targetNetwork,
    availableChainIds,
    isReady,
    updateQuery,
    asset,
    txRef,
  ]);

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
  }, [
    sourceToken,
    sourceTokens,
    sourceNetwork,
    updateQuery,
    transactionId,
    txRef,
  ]);
}
