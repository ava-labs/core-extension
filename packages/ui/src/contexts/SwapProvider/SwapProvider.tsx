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
  const [destAmount, setDestAmount] = useState('');
  const [srcAmount, setSrcAmount] = useState('');
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
              setQuotes(null);
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
              onUpdate: (update: NormalizedSwapQuoteResult) => {
                setManuallySelected(false);
                setQuotes(update);
                const selected = update.selected;
                // Set amountOut for sell side
                const amountOut = selected.metadata.amountOut;
                if (amountOut && typeof amountOut === 'string') {
                  setDestAmount(amountOut);
                }
                // Set amountIn for buy side
                const amountIn = selected.metadata.amountIn;
                if (amountIn && typeof amountIn === 'string') {
                  setSrcAmount(amountIn);
                }
              },
            })
              .then((result) => {
                if (result) {
                  setQuotes(result);
                  setError({ message: '' });
                  const selected = result.selected;
                  const amountOut = selected.metadata.amountOut;
                  if (amountOut && typeof amountOut === 'string') {
                    setDestAmount(amountOut);
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
            setDestAmount('');
            setQuotes(null);
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
