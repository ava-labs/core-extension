import { TokenType } from '@avalabs/vm-module-types';
import { OptimalRate, SwapSide } from '@paraswap/sdk';
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
  JupiterQuote,
  OnTransactionReceiptCallback,
  SwapContextAPI,
  SwapError,
  SwapFormValues,
  SwapParams,
  isJupiterSwapParams,
  isParaswapSwapParams,
} from './models';
import { swapError } from './swap-utils';
import { useEvmSwap } from './useEvmSwap';
import { useSolanaSwap } from './useSolanaSwap';

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

  const [quote, setQuote] = useState<OptimalRate | JupiterQuote | null>(null);
  const [error, setError] = useState<SwapError>({ message: '' });
  const [destAmount, setDestAmount] = useState('');
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
      srcAmount,
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
      const srcAssetAmount = new Big(srcAmount)
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
    async (params: SwapParams<OptimalRate | JupiterQuote>) => {
      if (isSolanaNetwork(activeNetwork)) {
        if (!isJupiterSwapParams(params)) {
          throw swapError(SwapErrorCode.InvalidParams);
        }

        return svmSwap(params);
      }

      if (!isParaswapSwapParams(params)) {
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

  useEffect(() => {
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
          if (
            amount &&
            toTokenAddress &&
            fromTokenAddress &&
            fromTokenDecimals &&
            toTokenDecimals
          ) {
            const amountString = amount.toString();

            if (amountString === '0') {
              setQuote(null);
              setError({ message: t('Please enter an amount') });
              setDestAmount('');
              setIsSwapLoading(false);
              return;
            }

            const swapSide =
              destinationInputField === 'to' ? SwapSide.SELL : SwapSide.BUY;
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
            })
              .then((result) => {
                if (result.error) {
                  setError(result.error);
                  setQuote(null);
                } else {
                  setQuote(result.quote);
                  setError({ message: '' });
                }

                if (typeof result.destAmount === 'string') {
                  setDestAmount(result.destAmount);
                }
              })
              .catch((err) => {
                // If somehow the error was not caught by the adapter,
                // log the error & show a generic error message.
                Monitoring.sentryCaptureException(
                  err as Error,
                  Monitoring.SentryExceptionTypes.SWAP,
                );
                setQuote(null);
                setError({ message: t('An unknown error occurred') });
              })
              .finally(() => {
                setIsSwapLoading(false);
              });
          } else {
            setDestAmount('');
            setQuote(null);
          }
        },
      );

    return () => {
      subscription.unsubscribe();
    };
  }, [getRate, swapFormValuesStream, setIsSwapLoading, setError, t]);

  return (
    <SwapContext.Provider
      value={{
        getRate,
        swap,
        error,
        setError,
        isSwapLoading,
        setIsSwapLoading,
        quote,
        setQuote,
        swapFormValuesStream,
        destAmount,
        setDestAmount,
      }}
    >
      {children}
    </SwapContext.Provider>
  );
}

export function useSwapContext() {
  return useContext(SwapContext);
}
