import { createContext, FC, useContext, type ReactNode } from 'react';

import { Account, FeatureGates } from '@core/types';
import { useAccountsContext, useFeatureFlagContext } from '@core/ui';

import { SwapProvider } from '../types';
import { useSwapQuery, useSwapTokens } from '../hooks';
import { getSwapProvider } from './lib/getSwapProvider';

type QueryState = Omit<ReturnType<typeof useSwapQuery>, 'update'> & {
  updateQuery: ReturnType<typeof useSwapQuery>['update'];
};
type TokensState = ReturnType<typeof useSwapTokens>;
type SwapState = QueryState &
  TokensState & { provider: SwapProvider; account?: Account };

const SwapStateContext = createContext<SwapState | undefined>(undefined);

export const SwapStateContextProvider: FC<{ children: ReactNode }> = ({
  children,
}) => {
  const { isFlagEnabled } = useFeatureFlagContext();
  const {
    accounts: { active: activeAccount },
  } = useAccountsContext();

  const { update: updateQuery, ...queryState } = useSwapQuery();
  const { sourceTokens, targetTokens, fromToken, toToken } = useSwapTokens(
    queryState.fromId,
    queryState.toId,
  );

  const provider = getSwapProvider(
    fromToken,
    toToken,
    isFlagEnabled(FeatureGates.SWAP_USE_MARKR),
  );

  return (
    <SwapStateContext.Provider
      value={{
        updateQuery,
        ...queryState,
        sourceTokens,
        targetTokens,
        fromToken,
        toToken,
        provider,
        account: activeAccount,
      }}
    >
      {children}
    </SwapStateContext.Provider>
  );
};

export const useSwapState = () => {
  const context = useContext(SwapStateContext);
  if (!context) {
    throw new Error(
      'useSwapState must be used within SwapStateContextProvider',
    );
  }

  return context;
};
