import { bigIntToString } from '@avalabs/core-utils-sdk';
import { isAddressBlockedError, stringToBigint } from '@core/common';
import { useCallback, useEffect, useState } from 'react';
import { useTranslation } from 'react-i18next';
import { useBridgeState } from '../contexts';

export const useBridgeErrorHandler = () => {
  const { t } = useTranslation();
  const [error, setError] = useState<string>('');
  const [isAddressBlocked, setIsAddressBlocked] = useState(false);
  const {
    minTransferAmount,
    query: { amount },
    sourceToken,
    requiredGas,
  } = useBridgeState();

  const hasEnoughBalanceForTransfer =
    sourceToken && minTransferAmount
      ? sourceToken.balance >= minTransferAmount
      : true;

  const clearError = useCallback(() => {
    setError('');
  }, []);

  useEffect(() => {
    if (
      !amount ||
      minTransferAmount == null ||
      !sourceToken ||
      hasEnoughBalanceForTransfer
    ) {
      clearError();
      return;
    }

    const bigIntAmount = stringToBigint(amount, sourceToken.decimals);
    if (
      bigIntAmount < minTransferAmount ||
      minTransferAmount > sourceToken.balance
    ) {
      setError(
        t('Minimum transfer amount is {{limit}}', {
          limit: bigIntToString(minTransferAmount, sourceToken.decimals),
        }),
      );
    } else {
      clearError();
    }
  }, [
    amount,
    clearError,
    minTransferAmount,
    sourceToken,
    t,
    hasEnoughBalanceForTransfer,
  ]);

  useEffect(() => {
    if (
      !amount ||
      !sourceToken ||
      !requiredGas ||
      !minTransferAmount ||
      !hasEnoughBalanceForTransfer
    ) {
      return;
    }

    const amountBigInt = stringToBigint(amount, sourceToken.decimals);
    const maxAvailable = sourceToken.balance - requiredGas;
    if (maxAvailable > minTransferAmount && maxAvailable < amountBigInt) {
      setError(
        t('Maximum available after fees is {{balance}} {{symbol}}', {
          balance: bigIntToString(maxAvailable, sourceToken.decimals),
          symbol: sourceToken.symbol,
        }),
      );
    } else {
      clearError();
    }
  }, [
    requiredGas,
    sourceToken,
    amount,
    clearError,
    t,
    minTransferAmount,
    hasEnoughBalanceForTransfer,
  ]);

  const onBridgeError = useCallback((err: unknown, fallbackMessage: string) => {
    if (isAddressBlockedError(err)) {
      setIsAddressBlocked(true);
    } else if (err instanceof Error) {
      setError(err.message);
    } else if (typeof err === 'string') {
      setError(err);
    } else {
      setError(fallbackMessage);
    }
  }, []);

  return {
    error,
    clearError,
    onBridgeError,
    isAddressBlocked,
  };
};
