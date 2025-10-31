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
import { useFetchMinTransferAmount } from './hooks';
import { useAmountAfterFee } from './hooks/useAmountAfterFee';
import { useInitialize } from './hooks/useInitialize';
import { usePairFlipper } from './hooks/usePairFlipper';
import { useTargetToken } from './hooks/useTargetToken';
import { checkIfXorPChain } from './utils/checkIfXOrPChain';

type UnifiedBridgeContext = ReturnType<typeof useNextUnifiedBridgeContext>;

const BridgeStateContext = createContext<
  | undefined
  | {
      isReady: UnifiedBridgeContext['isReady'];
      sourceChainIds: UnifiedBridgeContext['availableChainIds'];
      transferAsset: UnifiedBridgeContext['transferAsset'];
      state: UnifiedBridgeContext['state'];
      isTxConfirming: UnifiedBridgeContext['isTxConfirming'];
      minTransferAmount: bigint | undefined;
      query: BridgeQueryContext;
      sourceTokens: FungibleTokenBalance[];
      assets: BridgeAsset[];
      asset: BridgeAsset | undefined;
      fee: bigint;
      amountAfterFee: bigint;
      shouldUseCrossChainTransfer: boolean;
      sourceNetwork: NetworkWithCaipId | undefined;
      targetNetworks: NetworkWithCaipId['caipId'][];
      targetNetworkId: NetworkWithCaipId['caipId'];
      targetToken: FungibleTokenBalance | undefined;
      flipPair: VoidFunction;
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
    getMinimumTransferAmount,
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

  const tokenAndAssetLookup = useMemo(
    () =>
      tokens.reduce((lookup, token) => {
        const asset = findMatchingBridgeAsset(
          getTransferableAssets(sourceNetworkId),
          token,
        );
        if (asset) {
          lookup.set(getUniqueTokenId(token), { asset, token });
        }
        return lookup;
      }, new Map<string, { asset: BridgeAsset; token: FungibleTokenBalance }>()),
    [tokens, getTransferableAssets, sourceNetworkId],
  );

  const sourceTokens = useMemo(
    () => tokens.filter((t) => tokenAndAssetLookup.has(getUniqueTokenId(t))),
    [tokens, tokenAndAssetLookup],
  );

  useInitialize(query, sourceTokens);

  const asset = tokenAndAssetLookup.get(sourceToken)?.asset ?? undefined;
  const targetNetworks = useMemo(
    () => (asset?.destinations ? Object.keys(asset.destinations) : []),
    [asset?.destinations],
  );
  const [targetNetworkId = ''] = targetNetworks;
  const targetToken = useTargetToken(
    targetNetworkId,
    tokenAndAssetLookup.get(sourceToken)?.token,
  );

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

  const minTransferAmount = useFetchMinTransferAmount(
    getMinimumTransferAmount,
    asset,
    query.amount,
    sourceNetworkId,
    targetNetworkId,
  );

  return (
    <BridgeStateContext
      value={{
        isReady,
        query,
        sourceNetwork,
        sourceTokens,
        sourceChainIds: availableChainIds,
        assets: getTransferableAssets(sourceNetworkId),
        asset,
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
        minTransferAmount,
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
