import { useAllTokens } from '@/hooks/useAllTokens';
import { BridgeAsset } from '@avalabs/bridge-unified';
import { findMatchingBridgeAsset } from '@core/common';
import {
  FungibleTokenBalance,
  getUniqueTokenId,
  NetworkWithCaipId,
} from '@core/types';
import { createContext, FC, PropsWithChildren, use, useMemo } from 'react';
import { BridgeQueryContext, useBridgeQuery } from '../BridgeQuery';
import { useNextUnifiedBridgeContext } from '../NextUnifiedBridge';
import { useAmountAfterFee } from './hooks/useAmountAfterFee';
import { useInitialize } from './hooks/useInitialize';
import { checkIfXorPChain } from './utils/checkIfXOrPChain';

const BridgeStateContext = createContext<
  | undefined
  | {
      isReady: boolean;
      query: BridgeQueryContext;
      sourceChainIds: string[];
      sourceTokens: FungibleTokenBalance[];
      assets: BridgeAsset[];
      target: BridgeAsset | undefined;
      fee: bigint;
      amountAfterFee: string | undefined;
      getAssetIdentifierOnTargetChain: (
        symbol?: string,
        chainId?: string,
      ) => string | undefined;
      shouldUseCrossChainTransfer: boolean;
      targetNetworks: NetworkWithCaipId['caipId'][];
      targetNetworkId: NetworkWithCaipId['caipId'];
      targetToken: FungibleTokenBalance | undefined;
    }
>(undefined);

export const BridgeStateProvider: FC<PropsWithChildren> = ({ children }) => {
  const query = useBridgeQuery();
  const { amount, sourceToken } = query;

  const {
    transferableAssets,
    availableChainIds,
    isReady,
    getAssetIdentifierOnTargetChain,
    sourceNetwork,
  } = useNextUnifiedBridgeContext();

  const networksForToken = useMemo(
    () => (sourceNetwork ? [sourceNetwork] : []),
    [sourceNetwork],
  );
  const tokens = useAllTokens(networksForToken);

  const sourceTokens = useMemo(
    () => tokens.filter((t) => findMatchingBridgeAsset(transferableAssets, t)),
    [tokens, transferableAssets],
  );

  const tokenToAssetMap = useMemo(
    () =>
      new Map(
        sourceTokens.map((token) => [
          getUniqueTokenId(token),
          findMatchingBridgeAsset(transferableAssets, token),
        ]),
      ),
    [sourceTokens, transferableAssets],
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
    targetNetworkId,
  );

  return (
    <BridgeStateContext
      value={{
        isReady,
        query,
        sourceTokens,
        sourceChainIds: availableChainIds,
        assets: transferableAssets,
        target: sourceAsset,
        getAssetIdentifierOnTargetChain,
        fee,
        amountAfterFee,
        shouldUseCrossChainTransfer: checkIfXorPChain(sourceNetwork),
        targetNetworkId,
        targetNetworks,
        targetToken,
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
