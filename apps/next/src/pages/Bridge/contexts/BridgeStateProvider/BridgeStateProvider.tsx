import { BridgeAsset } from '@avalabs/bridge-unified';
import { caipToChainId, stringToBigint } from '@core/common';
import { FungibleTokenBalance, NetworkWithCaipId } from '@core/types';
import {
  createContext,
  FC,
  PropsWithChildren,
  use,
  useEffect,
  useMemo,
  useState,
} from 'react';
import { BridgeQueryContext, useBridgeQuery } from '../BridgeQuery';
import { useNextUnifiedBridgeContext } from '../NextUnifiedBridge';
import { useFetchMinTransferAmount, useTargetToken } from './hooks';
import { useAmountAfterFee } from './hooks/useAmountAfterFee';
import { useInitialize } from './hooks/useInitialize';
import { usePairFlipper } from './hooks/usePairFlipper';
import { useTokenLookup } from './hooks/useTokenLookup';
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
      amountAfterFee: bigint | undefined;
      asset: BridgeAsset | undefined;
      fee: bigint | undefined;
      flipPair: VoidFunction;
      minTransferAmount: bigint | undefined;
      requiredGas: bigint;
      shouldUseCrossChainTransfer: boolean;
      sourceToken: FungibleTokenBalance | undefined;
      sourceTokens: FungibleTokenBalance[];
      targetNetworkId: NetworkWithCaipId['caipId'];
      targetNetworkIds: NetworkWithCaipId['caipId'][];
      targetToken: FungibleTokenBalance | undefined;
    }
>(undefined);

export const BridgeStateProvider: FC<PropsWithChildren> = ({ children }) => {
  const query = useBridgeQuery();
  const {
    amount,
    sourceNetwork: sourceNetworkId,
    sourceToken: sourceTokenId,
  } = query;
  const [requiredGas, setRequiredGas] = useState<bigint>(0n);

  const {
    getTransferableAssets,
    availableChainIds: sourceChainIds,
    isReady,
    transferAsset,
    state,
    getMinimumTransferAmount,
    estimateTransferGas,
  } = useNextUnifiedBridgeContext();

  const { tokens: sourceTokens, lookup: sourceTokenAndAssetLookup } =
    useTokenLookup(sourceNetworkId, getTransferableAssets(sourceNetworkId));

  const { asset, token: sourceToken } =
    sourceTokenAndAssetLookup.get(sourceTokenId) ?? {};
  const targetNetworkIds = useMemo(
    () => (asset?.destinations ? Object.keys(asset.destinations) : []),
    [asset?.destinations],
  );
  const [targetNetworkId = ''] = targetNetworkIds;

  const targetToken = useTargetToken(
    targetNetworkId,
    getTransferableAssets(targetNetworkId),
    asset,
  );
  useInitialize(query, sourceTokens);

  const { amountAfterFee, fee } = useAmountAfterFee(
    asset,
    sourceToken?.balance,
    requiredGas,
    amount,
    sourceNetworkId,
    targetNetworkId,
  );

  const flipPair = usePairFlipper({
    targetNetworkId,
    targetToken,
  });

  const minTransferAmount = useFetchMinTransferAmount(
    getMinimumTransferAmount,
    asset,
    query.amount,
    sourceNetworkId,
    targetNetworkId,
  );

  useEffect(() => {
    if (!asset || !amount) {
      return;
    }
    const amountBigInt = stringToBigint(amount, asset.decimals);

    if (amountBigInt && sourceNetworkId && targetNetworkId) {
      estimateTransferGas(
        asset.symbol,
        amountBigInt,
        sourceNetworkId,
        targetNetworkId,
      ).then(setRequiredGas);
    }
  }, [amount, sourceNetworkId, targetNetworkId, estimateTransferGas, asset]);

  return (
    <BridgeStateContext
      value={{
        isReady,
        query,
        sourceTokens,
        sourceChainIds,
        asset,
        fee,
        amountAfterFee,
        shouldUseCrossChainTransfer: Boolean(
          sourceNetworkId && checkIfXorPChain(caipToChainId(sourceNetworkId)),
        ),
        targetNetworkIds,
        targetNetworkId,
        targetToken,
        sourceToken,
        transferAsset,
        flipPair,
        state,
        minTransferAmount,
        requiredGas,
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
