import { useEffect, useMemo, useState } from 'react';
import { BehaviorSubject, debounceTime } from 'rxjs';
import { OptimalRate, SwapSide } from 'paraswap-core';
import { useSwapContext } from '@src/contexts/SwapProvider/SwapProvider';
import { DestinationInput, isAPIError } from '../utils';
import { useTranslation } from 'react-i18next';

export interface SwapError {
  message?: string;
  hasTryAgain?: boolean;
  errorInfo?: string;
  canSwap?: boolean;
}

export function useSwap() {
  const { getRate } = useSwapContext();

  const [swapError, setSwapError] = useState<SwapError>({ message: '' });
  const [isSwapLoading, setIsSwapLoading] = useState<boolean>(false);
  const [optimalRate, setOptimalRate] = useState<OptimalRate | null>();
  const [swapGasLimit, setSwapGasLimit] = useState<number>(0);
  const [destAmount, setDestAmount] = useState('');
  const [isCalculateAvaxMax, setIsCalculateAvaxMax] = useState(false);
  const { t } = useTranslation();

  const setValuesDebouncedSubject = useMemo(() => {
    return new BehaviorSubject<{
      amount?: bigint;
      toTokenAddress?: string;
      fromTokenAddress?: string;
      toTokenDecimals?: number;
      fromTokenDecimals?: number;
      destinationInputField?: DestinationInput;
      fromTokenBalance?: bigint;
    }>({});
  }, []);

  useEffect(() => {
    const subscription = setValuesDebouncedSubject
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
            })
              .then((result) => {
                /**
                 * This can be an error, the bacground tries 10x but if the
                 * server is still "busy" it sends the error
                 */
                if (isAPIError(result.optimalRate)) {
                  throw new Error(
                    t('paraswap error message while get rate: {{message}}', {
                      message: result.optimalRate.message,
                    }),
                  );
                }
                // Never modify the properies of the optimalRate since the swap API needs it unchanged
                setOptimalRate(result.optimalRate);
                setSwapGasLimit(Number(result.optimalRate?.gasCost || 0));
                const resultAmount =
                  destinationInputField === 'to'
                    ? result.optimalRate?.destAmount
                    : result.optimalRate?.srcAmount;
                setDestAmount(resultAmount ?? '');
                if (
                  fromTokenBalance &&
                  destinationInputField === 'from' &&
                  BigInt(resultAmount ?? '') > fromTokenBalance
                ) {
                  setSwapError({ message: t('Insufficient balance.') });
                  return;
                }
                if (
                  fromTokenBalance &&
                  destinationInputField === 'to' &&
                  amount > fromTokenBalance
                ) {
                  setSwapError({ message: t('Insufficient balance.') });
                  return;
                }
                setSwapError({ message: '' });
              })
              .catch((error) => {
                setOptimalRate(undefined);
                setDestAmount('');
                setSwapError({
                  message: t('Something went wrong, '),
                  hasTryAgain: true,
                  errorInfo: error,
                });
              })
              .finally(() => {
                if (!isCalculateAvaxMax) {
                  setIsSwapLoading(false);
                  return;
                }
                setIsCalculateAvaxMax(false);
              });
          } else {
            setDestAmount('');
            setOptimalRate(undefined);
          }
        },
      );

    return () => {
      subscription.unsubscribe();
    };
  }, [
    getRate,
    setValuesDebouncedSubject,
    isCalculateAvaxMax,
    setIsSwapLoading,
    setSwapError,
    setIsCalculateAvaxMax,
    t,
  ]);

  return {
    setValuesDebouncedSubject,
    swapError,
    isSwapLoading,
    optimalRate,
    swapGasLimit,
    destAmount,
  };
}
