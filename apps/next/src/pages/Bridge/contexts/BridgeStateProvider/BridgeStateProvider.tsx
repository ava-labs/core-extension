import { BridgeAsset } from '@avalabs/bridge-unified';
import { caipToChainId, stringToBigint } from '@core/common';
import { FungibleTokenBalance } from '@core/types';
import {
  createContext,
  FC,
  PropsWithChildren,
  use,
  useEffect,
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
import { useNetworkFeeContext } from '@core/ui';

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
      requiredNetworkFee: bigint;
      isBridgeSupported: boolean;
      sourceToken: FungibleTokenBalance | undefined;
      sourceTokens: FungibleTokenBalance[];
      targetToken: FungibleTokenBalance | undefined;
    }
>(undefined);

export const BridgeStateProvider: FC<PropsWithChildren> = ({ children }) => {
  const query = useBridgeQuery();
  const {
    amount,
    sourceNetwork: sourceNetworkId,
    sourceToken: sourceTokenId,
    targetNetwork: targetNetworkId,
  } = query;
  const { getNetworkFee } = useNetworkFeeContext();

  const [requiredGas, setRequiredGas] = useState<bigint>(0n);
  const [requiredNetworkFee, setRequiredNetworkFee] = useState<bigint>(0n);

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

  useInitialize(query, sourceLookup.tokens, asset);

  const { amountAfterFee, fee } = useAmountAfterFee(
    asset,
    sourceToken?.balance,
    requiredNetworkFee,
    amount,
    sourceNetworkId,
    targetNetworkId,
  );

  const targetToken = useTargetToken(
    targetNetworkId,
    getTransferableAssets(targetNetworkId),
    asset,
    sourceToken,
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

  useEffect(() => {
    getNetworkFee(sourceNetworkId).then((networkFee) => {
      if (!networkFee || !requiredGas) {
        setRequiredNetworkFee(0n);
        return;
      }

      setRequiredNetworkFee(networkFee.low.maxFeePerGas * requiredGas);
    });
  }, [sourceNetworkId, requiredGas, getNetworkFee]);

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
        requiredNetworkFee,
        isBridgeSupported: Boolean(
          sourceNetworkId && checkIfXorPChain(caipToChainId(sourceNetworkId)),
        ),
        sourceChainIds,
        sourceToken,
        sourceTokens: sourceLookup.tokens,
        state,
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
