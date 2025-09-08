import {
  createContext,
  FC,
  useContext,
  useEffect,
  type ReactNode,
} from 'react';

import { Account, isNativeToken } from '@core/types';
import {
  useAccountsContext,
  useNetworkContext,
  useSwapContext,
  NormalizedSwapQuoteResult,
  SwapProviders,
} from '@core/ui';

import { useSwapQuery, useSwapTokens } from '../hooks';
import { stringToBigint } from '@core/common';
import { bigIntToString } from '@avalabs/core-utils-sdk';

type QueryState = Omit<ReturnType<typeof useSwapQuery>, 'update' | 'clear'> & {
  updateQuery: ReturnType<typeof useSwapQuery>['update'];
};
type TokensState = ReturnType<typeof useSwapTokens>;
type SwapState = QueryState &
  TokensState & {
    provider?: SwapProviders;
    account?: Account;
    fromAmount?: string;
    toAmount?: string;
    isAmountLoading?: boolean;
    quotes?: NormalizedSwapQuoteResult | null;
  };

const SwapStateContext = createContext<SwapState | undefined>(undefined);

export const SwapStateContextProvider: FC<{ children: ReactNode }> = ({
  children,
}) => {
  const { getNetwork } = useNetworkContext();
  const {
    accounts: { active: activeAccount },
  } = useAccountsContext();
  const {
    swapFormValuesStream,
    srcAmount,
    destAmount,
    isSwapLoading,
    setSwapNetwork,
    quotes,
  } = useSwapContext();

  const {
    update: updateQuery,
    side,
    userAmount,
    fromId,
    toId,
    fromQuery,
    toQuery,
  } = useSwapQuery();
  const { sourceTokens, targetTokens, fromToken, toToken } = useSwapTokens(
    fromId,
    toId,
  );

  const fromTokenAddress = fromToken
    ? isNativeToken(fromToken)
      ? fromToken.symbol
      : fromToken.address
    : undefined;
  const fromTokenDecimals = fromToken ? fromToken.decimals : undefined;
  const toTokenDecimals = toToken ? toToken.decimals : undefined;
  const fromTokenBalance = fromToken ? fromToken.balance : undefined;
  const toTokenBalance = toToken ? toToken.balance : undefined;
  const toTokenAddress = toToken
    ? isNativeToken(toToken)
      ? toToken.symbol
      : toToken.address
    : undefined;

  // TODO: calculate the other amount based on the received quotes.
  const fromAmount =
    side === 'sell'
      ? userAmount
      : fromTokenDecimals && srcAmount
        ? bigIntToString(BigInt(srcAmount), fromTokenDecimals)
        : '';
  const toAmount =
    side === 'sell'
      ? toTokenDecimals && destAmount
        ? bigIntToString(BigInt(destAmount), toTokenDecimals)
        : ''
      : userAmount;

  useEffect(() => {
    if (
      fromTokenAddress &&
      toTokenAddress &&
      fromTokenDecimals &&
      toTokenDecimals
    ) {
      swapFormValuesStream.next({
        ...swapFormValuesStream.getValue(),
        destinationInputField: side === 'sell' ? 'to' : 'from',
        amount: userAmount
          ? stringToBigint(
              userAmount,
              side === 'sell' ? fromTokenDecimals : toTokenDecimals,
            )
          : undefined,
        fromTokenAddress,
        fromTokenBalance,
        fromTokenDecimals,
        toTokenAddress,
        toTokenDecimals,
        slippageTolerance: '1', // TODO: allow customization
      });
    }
  }, [
    fromTokenAddress,
    toTokenAddress,
    fromTokenDecimals,
    toTokenDecimals,
    fromTokenBalance,
    toTokenBalance,
    swapFormValuesStream,
    side,
    userAmount,
  ]);

  useEffect(() => {
    if (fromToken?.coreChainId) {
      setSwapNetwork(getNetwork(fromToken?.coreChainId));
    }
  }, [fromToken?.coreChainId, setSwapNetwork, getNetwork]);

  return (
    <SwapStateContext.Provider
      value={{
        updateQuery,
        side,
        fromId,
        toId,
        fromQuery,
        toQuery,
        userAmount,
        sourceTokens,
        targetTokens,
        fromToken,
        toToken,
        provider: quotes?.provider,
        account: activeAccount,
        fromAmount,
        toAmount,
        isAmountLoading: isSwapLoading,
        quotes,
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
