import {
  createContext,
  Dispatch,
  FC,
  SetStateAction,
  useCallback,
  useContext,
  useEffect,
  useMemo,
  useState,
  type ReactNode,
} from 'react';
import { bigIntToString } from '@avalabs/core-utils-sdk';

import { Account, isNativeToken } from '@core/types';
import {
  useAccountsContext,
  useNetworkContext,
  useSwapContext,
  SwapProviders,
  SwapQuote,
  SwapContextAPI,
  useAnalyticsContext,
  useErrorMessage,
  isMarkrQuote,
} from '@core/ui';
import {
  getAddressForChain,
  isGasEstimationError,
  isSwapTxBuildError,
  isUserRejectionError,
  Monitoring,
  stringToBigint,
} from '@core/common';

import { useSwapQuery, useSwapTokens } from '../hooks';
import { toast } from '@avalabs/k2-alpine';
import { DEFAULT_SLIPPAGE } from '../swap-config';
import { useHistory } from 'react-router-dom';

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
    isConfirming: boolean;
    isAmountLoading?: boolean;
    quote?: SwapQuote;
    quotes?: SwapContextAPI['quotes'];
    setQuotes: SwapContextAPI['setQuotes'];
    manuallySelected: SwapContextAPI['manuallySelected'];
    setManuallySelected: SwapContextAPI['setManuallySelected'];
    swapError?: SwapContextAPI['error'];
    performSwap: () => Promise<void>;
    slippage: number;
    setSlippage: Dispatch<SetStateAction<number>>;
    autoSlippage: boolean;
    setAutoSlippage: Dispatch<SetStateAction<boolean>>;
    swapDisabled: boolean;
  };

const SwapStateContext = createContext<SwapState | undefined>(undefined);

export const SwapStateContextProvider: FC<{ children: ReactNode }> = ({
  children,
}) => {
  const { replace } = useHistory();
  const { getNetwork } = useNetworkContext();
  const { captureEncrypted } = useAnalyticsContext();
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
    setQuotes,
    error,
    swap,
    manuallySelected,
    setManuallySelected,
  } = useSwapContext();

  const getTranslatedError = useErrorMessage();

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

  const [isConfirming, setIsConfirming] = useState(false);
  const [slippage, setSlippage] = useState(DEFAULT_SLIPPAGE);
  const [autoSlippage, setAutoSlippage] = useState(true);

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

  // Reset slippage to default when either token changes
  useEffect(() => {
    setSlippage(DEFAULT_SLIPPAGE);
    setAutoSlippage(true);
  }, [fromTokenAddress, toTokenAddress]);

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

  const performSwap = useCallback(
    async (specificProvider?: SwapProviders, specificQuote?: SwapQuote) => {
      if (
        !fromToken?.coreChainId ||
        !fromTokenAddress ||
        !toTokenAddress ||
        !fromTokenDecimals ||
        !toTokenDecimals ||
        !fromAmount ||
        !toAmount ||
        !quotes
      ) {
        return;
      }

      setIsConfirming(true);

      const network = getNetwork(fromToken?.coreChainId);
      const address = getAddressForChain(network, activeAccount);

      const quoteToUse = specificQuote ?? quotes.selected.quote;
      const providerToUse = specificProvider ?? quotes.provider;

      captureEncrypted('SwapReviewOrder', {
        provider: providerToUse,
        slippage,
      });

      try {
        await swap({
          srcToken: fromTokenAddress,
          destToken: toTokenAddress,
          srcDecimals: fromTokenDecimals,
          destDecimals: toTokenDecimals,
          quote: quoteToUse,
          slippage,
          swapProvider: providerToUse,
          amountIn: fromAmount,
          amountOut: toAmount,
        });
        captureEncrypted('SwapConfirmed', {
          address,
          chainId: network?.chainId,
        });
        replace('/');
      } catch (err) {
        if (isUserRejectionError(err)) return;

        if (
          !manuallySelected &&
          (isSwapTxBuildError(err) || isGasEstimationError(err))
        ) {
          // Check if there are more quotes available to try
          if (quotes.quotes.length > 1) {
            const currentQuoteIndex = quotes.quotes.findIndex(
              (q) => q.quote === quoteToUse,
            );
            const nextQuoteIndex = currentQuoteIndex + 1;

            if (nextQuoteIndex < quotes.quotes.length) {
              // Try the next quote automatically
              const nextQuote = quotes.quotes[nextQuoteIndex];
              const swapProvider = quotes.provider;
              if (nextQuote) {
                setQuotes({
                  ...quotes,
                  selected: nextQuote,
                });

                // Retry swap with next quote without showing error
                performSwap(swapProvider, nextQuote.quote);
                return; // Don't handle error since we're retrying
              }
            }
          }
        }

        console.error(err);
        Monitoring.sentryCaptureException(
          err as Error,
          Monitoring.SentryExceptionTypes.SWAP,
        );

        const { title, hint } = getTranslatedError(err);

        toast.error(title, {
          description: hint,
        });

        captureEncrypted('SwapFailed', {
          address,
          chainId: network?.chainId,
        });
      } finally {
        setIsConfirming(false);
      }
    },
    [
      swap,
      fromToken?.coreChainId,
      fromTokenAddress,
      toTokenAddress,
      fromTokenDecimals,
      toTokenDecimals,
      fromAmount,
      toAmount,
      quotes,
      captureEncrypted,
      getTranslatedError,
      getNetwork,
      activeAccount,
      manuallySelected,
      setQuotes,
      slippage,
      replace,
    ],
  );

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
        slippageTolerance: slippage.toString(),
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
    slippage,
  ]);

  useEffect(() => {
    if (fromToken?.coreChainId) {
      setSwapNetwork(getNetwork(fromToken?.coreChainId));
    }
  }, [fromToken?.coreChainId, setSwapNetwork, getNetwork]);

  const swapDisabled = useMemo(() => {
    return (
      !fromToken?.coreChainId ||
      !fromTokenAddress ||
      !toTokenAddress ||
      !fromTokenDecimals ||
      !toTokenDecimals ||
      !fromAmount ||
      !toAmount ||
      !quotes
    );
  }, [
    fromToken?.coreChainId,
    fromTokenAddress,
    toTokenAddress,
    fromTokenDecimals,
    toTokenDecimals,
    fromAmount,
    toAmount,
    quotes,
  ]);

  // Auto-update slippage when auto mode is enabled and we have a recommendedSlippage
  useEffect(() => {
    if (autoSlippage && quotes?.selected?.quote) {
      const quote = quotes.selected.quote;
      if (isMarkrQuote(quote) && quote.recommendedSlippage) {
        // Convert bps to percentage: 200 bps → 2%
        const recommendedPercentage = quote.recommendedSlippage / 100;
        setSlippage(recommendedPercentage);
      }
    }
  }, [autoSlippage, quotes]);

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
        isConfirming,
        quotes,
        setQuotes,
        manuallySelected,
        setManuallySelected,
        quote: quotes?.selected?.quote,
        swapError: error,
        performSwap,
        slippage,
        setSlippage,
        autoSlippage,
        setAutoSlippage,
        swapDisabled,
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
