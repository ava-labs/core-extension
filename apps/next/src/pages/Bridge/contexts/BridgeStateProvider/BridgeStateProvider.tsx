import { useAllTokens } from '@/hooks/useAllTokens';
import { BridgeAsset } from '@avalabs/bridge-unified';
import { findMatchingBridgeAsset } from '@core/common';
import {
  FungibleTokenBalance,
  getUniqueTokenId,
  NetworkWithCaipId,
} from '@core/types';
import { useNetworkContext } from '@core/ui';
import { createContext, FC, PropsWithChildren, use, useMemo } from 'react';
import { BridgeQueryContext, useBridgeQuery } from '../BridgeQuery';
import { useNextUnifiedBridgeContext } from '../NextUnifiedBridge';
import { useAmountAfterFee } from './hooks/useAmountAfterFee';
import { useInitialize } from './hooks/useInitialize';
import { usePairFlipper } from './hooks/usePairFlipper';
import { checkIfXorPChain } from './utils/checkIfXOrPChain';

type UnifiedBridgeContext = ReturnType<typeof useNextUnifiedBridgeContext>;

const BridgeStateContext = createContext<
  | undefined
  | {
      isReady: UnifiedBridgeContext['isReady'];
      sourceChainIds: UnifiedBridgeContext['availableChainIds'];
      transferAsset: UnifiedBridgeContext['transferAsset'];
      state: UnifiedBridgeContext['state'];
      query: BridgeQueryContext;
      sourceTokens: FungibleTokenBalance[];
      assets: BridgeAsset[];
      target: BridgeAsset | undefined;
      fee: bigint;
      amountAfterFee: bigint;
      shouldUseCrossChainTransfer: boolean;
      targetNetworks: NetworkWithCaipId['caipId'][];
      targetNetworkId: NetworkWithCaipId['caipId'];
      targetToken: FungibleTokenBalance | undefined;
      flipPair: VoidFunction;
      isTxConfirming: UnifiedBridgeContext['isTxConfirming'];
    }
>(undefined);

export const BridgeStateProvider: FC<PropsWithChildren> = ({ children }) => {
  const query = useBridgeQuery();
  const { getNetwork } = useNetworkContext();
  const { amount, sourceNetwork: sourceNetworkId, sourceToken } = query;

  const {
    getTransferableAssets,
    availableChainIds,
    isReady,
    transferAsset,
    state,
    isTxConfirming,
  } = useNextUnifiedBridgeContext();

  const sourceNetwork = useMemo(
    () => (sourceNetworkId ? getNetwork(sourceNetworkId) : undefined),
    [getNetwork, sourceNetworkId],
  );

  const networksForToken = useMemo(
    () => (sourceNetwork ? [sourceNetwork] : []),
    [sourceNetwork],
  );
  const tokens = useAllTokens(networksForToken);

  const tokenToAssetMap = useMemo(
    () =>
      tokens.reduce((map, token) => {
        const asset = findMatchingBridgeAsset(
          getTransferableAssets(sourceNetworkId),
          token,
        );
        if (asset) {
          map.set(getUniqueTokenId(token), asset);
        }
        return map;
      }, new Map<string, BridgeAsset>()),
    [tokens, getTransferableAssets, sourceNetworkId],
  );

  const sourceTokens = useMemo(
    () => tokens.filter((t) => tokenToAssetMap.get(getUniqueTokenId(t))),
    [tokens, tokenToAssetMap],
  );

  useInitialize(query, sourceTokens);

  const sourceAsset = tokenToAssetMap.get(sourceToken);
  const targetNetworks = Object.keys(sourceAsset?.destinations ?? {});
  const [targetNetworkId = ''] = targetNetworks;
  // TODO: Find the actual target token based on the source token and the target network
  const targetToken = tokens.find((t) => getUniqueTokenId(t) === sourceToken);

  const { amountAfterFee, fee } = useAmountAfterFee(
    targetToken,
    amount,
    sourceNetworkId,
    targetNetworkId,
  );

  const flipPair = usePairFlipper({
    tokens,
    targetNetworkId,
    query,
  });

  return (
    <BridgeStateContext
      value={{
        isReady,
        query,
        sourceTokens,
        sourceChainIds: availableChainIds,
        assets: getTransferableAssets(sourceNetworkId),
        target: sourceAsset,
        fee,
        amountAfterFee,
        shouldUseCrossChainTransfer: checkIfXorPChain(sourceNetwork),
        targetNetworkId,
        targetNetworks,
        targetToken,
        transferAsset,
        flipPair,
        state,
        isTxConfirming,
      }}
    >
      {children}
    </BridgeStateContext>
  );
};

export const useBridgeState = () => {
  const context = use(BridgeStateContext);
  if (!context) {
    throw new Error('useBridgeState must be used within a BridgeStateProvider');
  }
  return context;
};
