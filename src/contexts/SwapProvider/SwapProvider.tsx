import {
  createContext,
  useCallback,
  useContext,
  useEffect,
  useMemo,
  useState,
} from 'react';
import { useTranslation } from 'react-i18next';
import { debounceTime, BehaviorSubject } from 'rxjs';
import { OptimalRate, SwapSide } from '@paraswap/sdk';

import { isSolanaNetwork } from '@src/background/services/network/utils/isSolanaNetwork';

import { useWalletContext } from '../WalletProvider';
import { useNetworkContext } from '../NetworkProvider';
import { useAccountsContext } from '../AccountsProvider';
import { useNetworkFeeContext } from '../NetworkFeeProvider';

import {
  SwapContextAPI,
  SwapParams,
  GetRateParams,
  SwapError,
  JupiterQuote,
  SwapFormValues,
  isJupiterSwapParams,
  isParaswapSwapParams,
} from './models';
import { useEvmSwap } from './useEvmSwap';
import { useSolanaSwap } from './useSolanaSwap';
import sentryCaptureException, {
  SentryExceptionTypes,
} from '@src/monitoring/sentryCaptureException';

export const SwapContext = createContext<SwapContextAPI>({} as any);

export function SwapContextProvider({ children }: { children: any }) {
  const { network: activeNetwork } = useNetworkContext();
  const {
    accounts: { active: activeAccount },
  } = useAccountsContext();
  const { networkFee } = useNetworkFeeContext();
  const { walletDetails } = useWalletContext();
  const { t } = useTranslation();

  const [quote, setQuote] = useState<OptimalRate | JupiterQuote | null>(null);
  const [swapError, setSwapError] = useState<SwapError>({ message: '' });
  const [destAmount, setDestAmount] = useState('');
  const [isSwapLoading, setIsSwapLoading] = useState<boolean>(false);

  const swapFormValuesStream = useMemo(() => {
    return new BehaviorSubject<SwapFormValues>({});
  }, []);

  const { getRate: getEvmRate, swap: evmSwap } = useEvmSwap({
    account: activeAccount,
    network: activeNetwork,
    networkFee: networkFee,
    walletDetails: walletDetails,
  });
  const { getRate: getSvmRate, swap: svmSwap } = useSolanaSwap({
    network: activeNetwork,
  });

  const swap = useCallback(
    async (params: SwapParams<OptimalRate | JupiterQuote>) => {
      if (isSolanaNetwork(activeNetwork)) {
        if (!isJupiterSwapParams(params)) {
          throw new Error('Jupiter quote is required for Solana swaps');
        }

        return svmSwap(params);
      }

      if (!isParaswapSwapParams(params)) {
        throw new Error('Paraswap quote is required for EVM swaps');
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
              setSwapError({ message: t('Please enter an amount') });
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
            })
              .then((result) => {
                if (result.error) {
                  setSwapError(result.error);
                  setQuote(null);
                } else {
                  setQuote(result.quote);
                  setSwapError({ message: '' });
                }

                if (typeof result.destAmount === 'string') {
                  setDestAmount(result.destAmount);
                }
              })
              .catch((error) => {
                // If somehow the error was not caught by the adapter,
                // log the error & show a generic error message.
                sentryCaptureException(
                  error as Error,
                  SentryExceptionTypes.SWAP,
                );
                setQuote(null);
                setSwapError({ message: t('An unknown error occurred') });
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
  }, [getRate, swapFormValuesStream, setIsSwapLoading, setSwapError, t]);

  return (
    <SwapContext.Provider
      value={{
        getRate,
        swap,
        swapError,
        setSwapError,
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
