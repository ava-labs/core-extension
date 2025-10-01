import { useTokensForAccount } from '@/hooks/useTokensForAccount';
import { BridgeAsset } from '@avalabs/bridge-unified';
import { findMatchingBridgeAsset } from '@core/common';
import { FungibleTokenBalance, getUniqueTokenId } from '@core/types';
import { useAccountsContext } from '@core/ui';
import {
  createContext,
  FC,
  PropsWithChildren,
  use,
  useEffect,
  useState,
} from 'react';
import { BridgeQueryContext, useBridgeQuery } from './BridgeQuery';
import { useNextUnifiedBridgeContext } from './NextUnifiedBridge';

const BridgeStateContext = createContext<
  | undefined
  | {
      isReady: boolean;
      query: BridgeQueryContext;
      sourceChainIds: string[];
      sourceTokens: FungibleTokenBalance[];
      assets: BridgeAsset[];
      targetTokens: BridgeAsset[];
      fee: bigint;
    }
>(undefined);

export const BridgeStateProvider: FC<PropsWithChildren> = ({ children }) => {
  const query = useBridgeQuery();
  const { sourceToken, sourceNetwork, updateQuery, amount, targetToken } =
    query;
  const [fee, setFee] = useState<bigint>(0n);

  const unifiedBridge = useNextUnifiedBridgeContext();
  const {
    accounts: { active },
  } = useAccountsContext();
  const tokens = useTokensForAccount(active);
  const sourceTokens = tokens.filter((token) =>
    findMatchingBridgeAsset(unifiedBridge.transferableAssets, token),
  );

  const targetDestinations =
    unifiedBridge.transferableAssets.find(
      (asset) => asset.symbol === sourceToken,
    )?.destinations[sourceNetwork] ?? [];

  const [targetNetwork] = Object.keys(unifiedBridge.availableChainIds!);
  const targetTokens = targetDestinations[targetNetwork!];

  useEffect(() => {
    if (targetToken && amount && targetNetwork) {
      unifiedBridge
        .getFee(targetToken, BigInt(amount), targetNetwork)
        .then(setFee);
    }
  }, [targetToken, amount, targetNetwork, unifiedBridge]);

  useEffect(() => {
    if (
      !sourceNetwork ||
      !unifiedBridge.availableChainIds.includes(sourceNetwork)
    ) {
      updateQuery({
        sourceNetwork: unifiedBridge.availableChainIds[0],
      });
    }
  }, [
    sourceNetwork,
    unifiedBridge.availableChainIds,
    unifiedBridge.isReady,
    updateQuery,
  ]);

  useEffect(() => {
    const [firstToken] = sourceTokens;
    if (sourceNetwork && !sourceToken && firstToken) {
      updateQuery({
        sourceToken: getUniqueTokenId(firstToken),
        sourceTokenQuery: '',
      });
    }
  }, [sourceToken, sourceTokens, sourceNetwork, updateQuery]);

  return (
    <BridgeStateContext
      value={{
        isReady: unifiedBridge.isReady,
        query,
        sourceTokens,
        sourceChainIds: unifiedBridge.availableChainIds,
        assets: unifiedBridge.transferableAssets,
        targetTokens,
        fee,
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
