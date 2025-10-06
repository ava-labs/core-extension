import { useTokensForAccount } from '@/hooks/useTokensForAccount';
import { BridgeAsset } from '@avalabs/bridge-unified';
import { findMatchingBridgeAsset } from '@core/common';
import { FungibleTokenBalance } from '@core/types';
import { useAccountsContext } from '@core/ui';
import { createContext, FC, PropsWithChildren, use } from 'react';
import { BridgeQueryContext, useBridgeQuery } from '../BridgeQuery';
import { useNextUnifiedBridgeContext } from '../NextUnifiedBridge';
import { useFee } from './hooks/useFee';
import { useInitialize } from './hooks/useInitialize';

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
  const { sourceToken, sourceNetwork, amount, targetToken } = query;

  const { transferableAssets, availableChainIds, isReady } =
    useNextUnifiedBridgeContext();
  const {
    accounts: { active },
  } = useAccountsContext();
  const tokens = useTokensForAccount(active);
  const sourceTokens = tokens.filter((token) =>
    findMatchingBridgeAsset(transferableAssets, token),
  );

  useInitialize(query, sourceTokens);

  const [targetNetwork] = Object.keys(availableChainIds!);
  const fee = useFee(targetToken, amount, targetNetwork);

  const targetDestinations =
    transferableAssets.find((asset) => asset.symbol === sourceToken)
      ?.destinations[sourceNetwork] ?? [];

  const targetTokens = targetDestinations[targetNetwork!];

  return (
    <BridgeStateContext
      value={{
        isReady: isReady,
        query,
        sourceTokens,
        sourceChainIds: availableChainIds,
        assets: transferableAssets,
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
