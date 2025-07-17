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
import {
  Monitoring,
  getExplorerAddressByNetwork,
  isSolanaNetwork,
} from '@core/common';
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
import { swapError } from './swap-utils';
import { useEvmSwap } from './useEvmSwap';
import { useSolanaSwap } from './useSolanaSwap';
import { NormalizedSwapQuoteResult } from './types';
import { SWAP_REFRESH_INTERVAL } from './constants';

export const SwapContext = createContext<SwapContextAPI>({} as any);

type SwapContextProviderProps = PropsWithChildren<{
  removeToast: (toastId: string) => void;
  showErrorToast: (message: string) => void;
  showPendingToast: () => string;
  showToastWithLink: (options: {
    title: string;
    url: string;
    label: string;
  }) => void;
}>;

export function SwapContextProvider({
  children,
  removeToast,
  showErrorToast,
  showPendingToast,
  showToastWithLink,
}: SwapContextProviderProps) {
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
      pendingToastId,
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

      removeToast(pendingToastId);

      if (isSuccessful) {
        showToastWithLink({
          title: notificationText,
          url: getExplorerAddressByNetwork(
            activeNetwork as NetworkWithCaipId,
            txHash,
          ),
          label: t('View in Explorer'),
        });
      } else {
        showErrorToast(notificationText);
      }

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
    [
      activeNetwork,
      captureEncrypted,
      findSymbol,
      t,
      showToastWithLink,
      removeToast,
      showErrorToast,
    ],
  );

  const { getRate: getEvmRate, swap: evmSwap } = useEvmSwap(
    {
      account: activeAccount,
      network: activeNetwork,
      walletDetails: walletDetails,
    },
    {
      onTransactionReceipt: notifyOnSwapResult,
      showPendingToast,
    },
  );
  const { getRate: getSvmRate, swap: svmSwap } = useSolanaSwap(
    {
      network: activeNetwork,
      account: activeAccount,
    },
    {
      onTransactionReceipt: notifyOnSwapResult,
      showPendingToast,
    },
  );

  const swap = useCallback(
    async (params: SwapParams<SwapQuote>) => {
      if (isSolanaNetwork(activeNetwork)) {
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
    [activeNetwork, evmSwap, svmSwap],
  );

  const getRate = useCallback(
    async (params: GetRateParams) => {
      if (isSolanaNetwork(activeNetwork)) {
        return getSvmRate(params);
      }

      return getEvmRate(params);
    },
    [activeNetwork, getEvmRate, getSvmRate],
  );

  const checkUserBalance = useCallback(
    (balance: bigint, amount: string | undefined) => {
      if (balance && amount) {
        const hasEnough = balance >= BigInt(amount);
        if (!hasEnough) {
          setError({ message: t('Insufficient balance.') });
        }
      }
    },
    [t],
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
            // Set amountOut for sell side
            const amountOut = selected.metadata.amountOut;
            if (
              swapSide === SwapSide.SELL &&
              amountOut &&
              typeof amountOut === 'string'
            ) {
              setDestAmount(amountOut);
            }
            // Set amountIn for buy side
            const amountIn = selected.metadata.amountIn;
            if (
              swapSide === SwapSide.BUY &&
              amountIn &&
              typeof amountIn === 'string'
            ) {
              setSrcAmount(amountIn);
            }
          },
        })
          .then((result) => {
            if (result) {
              setManuallySelected(false);
              setQuotes(result);
              const selected = result.selected;
              // Set amountOut for sell side
              const amountOut = selected.metadata.amountOut;
              if (
                swapSide === SwapSide.SELL &&
                amountOut &&
                typeof amountOut === 'string'
              ) {
                setDestAmount(amountOut);
              }
              // Set amountIn for buy side
              const amountIn = selected.metadata.amountIn;
              if (
                swapSide === SwapSide.BUY &&
                amountIn &&
                typeof amountIn === 'string'
              ) {
                setSrcAmount(amountIn);
              }
              // Check balance here
              if (fromTokenBalance && swapSide === SwapSide.BUY) {
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
            setError({ message: t('An unknown error occurred') });
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
    [getRate, t, checkUserBalance],
  );

  useEffect(() => {
    let intervalId: NodeJS.Timeout | null = null;
    let lastFormValues: SwapFormValues | null = null;

    const subscription = swapFormValuesStream
      .pipe(debounceTime(500))
      .subscribe(
        ({
          amount,
          toTokenAddress,
          fromTokenAddress,
          toTokenDecimals,
          fromTokenDecimals,
          destinationInputField,
          fromTokenBalance,
          slippageTolerance,
        }) => {
          // Clear previous interval if exists
          if (intervalId) {
            clearInterval(intervalId);
            intervalId = null;
          }

          // Store form values for interval usage
          lastFormValues = {
            amount,
            toTokenAddress,
            fromTokenAddress,
            toTokenDecimals,
            fromTokenDecimals,
            destinationInputField,
            fromTokenBalance,
            slippageTolerance,
          };

          // Initial fetch
          fetchQuotes(lastFormValues);

          // Set up 30-second interval for automatic refresh
          intervalId = setInterval(() => {
            if (lastFormValues) {
              fetchQuotes(lastFormValues);
            }
          }, SWAP_REFRESH_INTERVAL);
        },
      );

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
      }}
    >
      {children}
    </SwapContext.Provider>
  );
}

export function useSwapContext() {
  return useContext(SwapContext);
}
