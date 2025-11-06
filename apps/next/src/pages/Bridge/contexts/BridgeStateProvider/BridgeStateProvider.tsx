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
import {
  useAmountAfterFee,
  useFetchMinTransferAmount,
  useInitialize,
  useTargetToken,
  useTokenLookup,
} from './hooks';
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

  const sourceLookup = useTokenLookup(
    sourceNetworkId,
    getTransferableAssets(sourceNetworkId),
  );

  const { asset, token: sourceToken } = sourceLookup.get(sourceTokenId) ?? {};

  useInitialize(query, sourceLookup.tokens);

  const targetNetworkIds = useMemo(
    () => (asset?.destinations ? Object.keys(asset.destinations) : []),
    [asset?.destinations],
  );
  const [targetNetworkId = ''] = targetNetworkIds;

  const { amountAfterFee, fee } = useAmountAfterFee(
    asset,
    sourceToken?.balance,
    requiredGas,
    amount,
    sourceNetworkId,
    targetNetworkId,
  );

  const targetToken = useTargetToken(
    targetNetworkId,
    getTransferableAssets(targetNetworkId),
    asset,
  );

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
        amountAfterFee,
        asset,
        fee,
        isReady,
        minTransferAmount,
        query,
        requiredGas,
        shouldUseCrossChainTransfer: Boolean(
          sourceNetworkId && checkIfXorPChain(caipToChainId(sourceNetworkId)),
        ),
        sourceChainIds,
        sourceToken,
        sourceTokens: sourceLookup.tokens,
        state,
        targetNetworkId,
        targetNetworkIds,
        targetToken,
        transferAsset,
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
