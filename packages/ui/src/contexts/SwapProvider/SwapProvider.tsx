import { TokenType } from '@avalabs/vm-module-types';
import { SwapSide } from '@paraswap/sdk';
import Big from 'big.js';
import {
  createContext,
  PropsWithChildren,
  useCallback,
  useContext,
  useEffect,
  useMemo,
  useState,
} from 'react';
import { useTranslation } from 'react-i18next';
import { BehaviorSubject, debounceTime } from 'rxjs';
import browser from 'webextension-polyfill';

import { useTokensWithBalances } from '../../hooks/useTokensWithBalances';
import { Monitoring, isSolanaNetwork } from '@core/common';
import { NetworkWithCaipId } from '@core/types';

import { useAccountsContext } from '../AccountsProvider';
import { useAnalyticsContext } from '../AnalyticsProvider';
import { useNetworkContext } from '../NetworkProvider';
import { useWalletContext } from '../WalletProvider';

import { SwapErrorCode } from '@core/types';
import {
  DISALLOWED_SWAP_ASSETS,
  GetRateParams,
  OnTransactionReceiptCallback,
  SwapContextAPI,
  SwapError,
  SwapFormValues,
  SwapParams,
  isJupiterSwapParams,
  isParaswapSwapParams,
  SwapQuote,
  isEvmWrapSwapParams,
  isMarkrSwapParams,
  isEvmUnwrapSwapParams,
} from './models';
import { applyFeeDeduction, swapError } from './swap-utils';
import { useEvmSwap } from './useEvmSwap';
import { useSolanaSwap } from './useSolanaSwap';
import { NormalizedSwapQuoteResult, SwapProviders } from './types';
import { SWAP_REFRESH_INTERVAL } from './constants';
import { useErrorMessage } from '../../hooks';

export const SwapContext = createContext<SwapContextAPI>({} as any);

export function SwapContextProvider({ children }: PropsWithChildren<object>) {
  const { network: activeNetwork } = useNetworkContext();
  const {
    accounts: { active: activeAccount },
  } = useAccountsContext();
  const { captureEncrypted } = useAnalyticsContext();
  const { walletDetails } = useWalletContext();
  const { t } = useTranslation();
  const tokens = useTokensWithBalances({
    forceShowTokensWithoutBalances: true,
    disallowedAssets: DISALLOWED_SWAP_ASSETS,
  });

  const [quotes, setQuotes] = useState<NormalizedSwapQuoteResult | null>(null);
  const [manuallySelected, setManuallySelected] = useState<boolean>(false);
  const [error, setError] = useState<SwapError>({ message: '' });
  const [destAmount, setDestAmount] = useState<string | undefined>(undefined);
  const [srcAmount, setSrcAmount] = useState<string | undefined>(undefined);
  const [isSwapLoading, setIsSwapLoading] = useState<boolean>(false);
  const [swapNetwork, setSwapNetwork] = useState<NetworkWithCaipId | undefined>(
    activeNetwork,
  );
  const getTranslatedError = useErrorMessage();

  useEffect(() => {
    // TODO: Cleanup once legacy app is gone -- new app uses setSwapNetwork() explicitly.
    setSwapNetwork(activeNetwork);
  }, [activeNetwork]);

  const findSymbol = useCallback(
    (symbolOrAddress: string) => {
      const tokenInfo = tokens.find((token) =>
        token.type === TokenType.NATIVE
          ? token.symbol === symbolOrAddress
          : token.address === symbolOrAddress,
      );

      return tokenInfo?.symbol ?? symbolOrAddress;
    },
    [tokens],
  );

  const swapFormValuesStream = useMemo(() => {
    return new BehaviorSubject<SwapFormValues>({});
  }, []);

  const notifyOnSwapResult: OnTransactionReceiptCallback = useCallback(
    async ({
      isSuccessful,
      txHash,
      chainId,
      userAddress,
      srcToken,
      destToken,
      srcAmount: resultSrcAmount,
      destAmount: resultDestAmount,
      srcDecimals,
      destDecimals,
    }) => {
      captureEncrypted(isSuccessful ? 'SwapSuccessful' : 'SwapFailed', {
        address: userAddress,
        txHash: txHash,
        chainId,
      });

      const srcAsset = findSymbol(srcToken);
      const destAsset = findSymbol(destToken);
      const srcAssetAmount = new Big(resultSrcAmount)
        .div(10 ** srcDecimals)
        .toString();
      const destAssetAmount = new Big(resultDestAmount)
        .div(10 ** destDecimals)
        .toString();

      const notificationText = isSuccessful
        ? t('Swap transaction succeeded! 🎉')
        : t('Swap transaction failed! ❌');

      browser.notifications.create({
        type: 'basic',
        title: notificationText,
        iconUrl: '../../../../images/icon-192.png',
        priority: 2,
        message: isSuccessful
          ? t(
              'Successfully swapped {{srcAmount}} {{srcToken}} to {{destAmount}} {{destToken}}',
              {
                srcAmount: srcAssetAmount,
                destAmount: destAssetAmount,
                srcToken: srcAsset,
                destToken: destAsset,
              },
            )
          : t(
              'Could not swap {{srcAmount}} {{srcToken}} to {{destAmount}} {{destToken}}',
              {
                srcToken: srcAsset,
                destToken: destAsset,
                srcAmount: srcAssetAmount,
                destAmount: destAssetAmount,
              },
            ),
      });
    },
    [captureEncrypted, findSymbol, t],
  );

  const { getRate: getEvmRate, swap: evmSwap } = useEvmSwap(
    {
      account: activeAccount,
      network: swapNetwork,
      walletDetails: walletDetails,
    },
    {
      onTransactionReceipt: notifyOnSwapResult,
    },
  );
  const { getRate: getSvmRate, swap: svmSwap } = useSolanaSwap(
    {
      network: swapNetwork,
      account: activeAccount,
    },
    {
      onTransactionReceipt: notifyOnSwapResult,
    },
  );

  const swap = useCallback(
    async (params: SwapParams<SwapQuote>) => {
      if (isSolanaNetwork(swapNetwork)) {
        if (!isJupiterSwapParams(params)) {
          throw swapError(SwapErrorCode.InvalidParams);
        }

        return svmSwap(params);
      }

      if (
        !isParaswapSwapParams(params) &&
        !isEvmWrapSwapParams(params) &&
        !isEvmUnwrapSwapParams(params) &&
        !isMarkrSwapParams(params)
      ) {
        throw swapError(SwapErrorCode.InvalidParams);
      }

      return evmSwap(params);
    },
    [swapNetwork, evmSwap, svmSwap],
  );

  const getRate = useCallback(
    async (params: GetRateParams) => {
      if (isSolanaNetwork(swapNetwork)) {
        return getSvmRate(params);
      }

      return getEvmRate(params);
    },
    [swapNetwork, getEvmRate, getSvmRate],
  );

  const checkUserBalance = useCallback(
    (balance: bigint, amount: string | undefined) => {
      if (balance && amount) {
        const hasEnough = balance >= BigInt(amount);
        if (!hasEnough) {
          setError({ message: t('Amount exceeds available balance.') });
        }
      }
    },
    [t],
  );

  const setAmounts = useCallback(
    (
      metadata: NormalizedSwapQuoteResult['selected']['metadata'],
      swapSide: SwapSide,
      skipFeeDeduction = false,
    ) => {
      // Set amountOut for sell side
      const amountOut = metadata.amountOut;
      if (
        swapSide === SwapSide.SELL &&
        amountOut &&
        typeof amountOut === 'string'
      ) {
        setDestAmount(
          skipFeeDeduction ? amountOut : applyFeeDeduction(amountOut, swapSide),
        );
      }
      // Set amountIn for buy side
      const amountIn = metadata.amountIn;
      if (
        swapSide === SwapSide.BUY &&
        amountIn &&
        typeof amountIn === 'string'
      ) {
        setSrcAmount(
          skipFeeDeduction ? amountIn : applyFeeDeduction(amountIn, swapSide),
        );
      }
    },
    [setDestAmount, setSrcAmount],
  );

  const fetchQuotes = useCallback(
    async ({
      amount,
      toTokenAddress,
      fromTokenAddress,
      toTokenDecimals,
      fromTokenDecimals,
      destinationInputField,
      fromTokenBalance,
      slippageTolerance,
    }: SwapFormValues) => {
      if (
        amount &&
        toTokenAddress &&
        fromTokenAddress &&
        fromTokenDecimals &&
        toTokenDecimals
      ) {
        // Reset state
        setError({ message: '' });
        setManuallySelected(false);
        setQuotes(null);

        const amountString = amount.toString();

        if (amountString === '0') {
          setQuotes(null);
          setError({ message: t('Please enter an amount') });
          setSrcAmount(undefined);
          setDestAmount(undefined);
          setIsSwapLoading(false);
          return;
        }

        const swapSide =
          destinationInputField === 'to' ? SwapSide.SELL : SwapSide.BUY;
        if (fromTokenBalance && swapSide === SwapSide.SELL) {
          // TODO: Should we return here? or should we continue with getting the quote?
          checkUserBalance(fromTokenBalance, amountString);
        }
        setIsSwapLoading(true);
        getRate({
          srcToken: fromTokenAddress,
          srcDecimals: fromTokenDecimals,
          destToken: toTokenAddress,
          destDecimals: toTokenDecimals,
          srcAmount: amountString,
          swapSide,
          fromTokenBalance,
          slippageTolerance,
          onUpdate: (update: NormalizedSwapQuoteResult) => {
            setManuallySelected(false);
            setQuotes(update);
            const selected = update.selected;
            // Set amounts based on the swap side
            setAmounts(selected.metadata, swapSide);
          },
        })
          .then((result) => {
            if (result) {
              setManuallySelected(false);
              setQuotes(result);
              const metadata = result.selected.metadata;
              // Set amounts based on the swap side
              setAmounts(
                metadata,
                swapSide,
                result.provider === SwapProviders.WNATIVE,
              );
              // Check balance here
              if (fromTokenBalance && swapSide === SwapSide.BUY) {
                const amountIn = metadata.amountIn;
                checkUserBalance(fromTokenBalance, amountIn);
              }
            }
          })
          .catch((err) => {
            // If somehow the error was not caught by the adapter,
            // log the error & show a generic error message.
            Monitoring.sentryCaptureException(
              err as Error,
              Monitoring.SentryExceptionTypes.SWAP,
            );
            setQuotes(null);
            setError({ message: getTranslatedError(err).title });
          })
          .finally(() => {
            setIsSwapLoading(false);
          });
      } else {
        setSrcAmount(undefined);
        setDestAmount(undefined);
        setQuotes(null);
      }
    },
    [getRate, checkUserBalance, setAmounts, getTranslatedError, t],
  );

  useEffect(() => {
    let intervalId: NodeJS.Timeout | null = null;

    const subscription = swapFormValuesStream
      .pipe(debounceTime(500))
      .subscribe((formValues) => {
        // Clear previous interval if exists
        if (intervalId) {
          clearInterval(intervalId);
          intervalId = null;
        }

        // Initial fetch
        fetchQuotes(formValues);

        // Set up 30-second interval for automatic refresh
        intervalId = setInterval(() => {
          fetchQuotes(formValues);
        }, SWAP_REFRESH_INTERVAL);
      });

    return () => {
      subscription.unsubscribe();
      if (intervalId) {
        clearInterval(intervalId);
      }
    };
  }, [swapFormValuesStream, fetchQuotes]);

  return (
    <SwapContext.Provider
      value={{
        getRate,
        swap,
        error,
        setError,
        isSwapLoading,
        setIsSwapLoading,
        quotes,
        setQuotes,
        manuallySelected,
        setManuallySelected,
        swapFormValuesStream,
        destAmount,
        setDestAmount,
        srcAmount,
        setSrcAmount,
        swapNetwork,
        setSwapNetwork,
      }}
    >
      {children}
    </SwapContext.Provider>
  );
}

export function useSwapContext() {
  return useContext(SwapContext);
}
