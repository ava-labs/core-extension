import { bigIntToString } from '@avalabs/core-utils-sdk';
import { isAddressBlockedError, stringToBigint } from '@core/common';
import { useCallback, useMemo, useState } from 'react';
import { useTranslation } from 'react-i18next';
import { useBridgeState } from '../contexts';

export const useBridgeErrorHandler = () => {
  const { t } = useTranslation();
  const [bridgeError, setBridgeError] = useState<string>('');
  const [isAddressBlocked, setIsAddressBlocked] = useState(false);
  const {
    minTransferAmount,
    query: { amount },
    sourceToken,
    requiredNetworkFee,
  } = useBridgeState();

  const amountBigInt =
    sourceToken && amount ? stringToBigint(amount, sourceToken.decimals) : 0n;

  const hasInsufficientBalance = sourceToken
    ? amountBigInt > sourceToken.balance
    : false;

  const hasEnoughBalanceForTransfer =
    sourceToken && minTransferAmount
      ? sourceToken.balance >= minTransferAmount
      : true;

  const minAmountError = useMemo(() => {
    if (
      !amountBigInt ||
      minTransferAmount == null ||
      !sourceToken ||
      hasInsufficientBalance
    ) {
      return '';
    }

    if (
      amountBigInt < minTransferAmount ||
      minTransferAmount > sourceToken.balance
    ) {
      return t('Minimum transfer amount is {{limit}}', {
        limit: bigIntToString(minTransferAmount, sourceToken.decimals),
      });
    }
    return '';
  }, [amountBigInt, hasInsufficientBalance, minTransferAmount, sourceToken, t]);

  const maxAmountError = useMemo(() => {
    if (
      !amountBigInt ||
      !sourceToken ||
      !requiredNetworkFee ||
      !minTransferAmount ||
      !hasEnoughBalanceForTransfer ||
      hasInsufficientBalance
    ) {
      return '';
    }

    const maxAvailable = sourceToken.balance - requiredNetworkFee;
    if (maxAvailable > minTransferAmount && maxAvailable < amountBigInt) {
      return t('Maximum available after fees is {{balance}} {{symbol}}', {
        balance: bigIntToString(maxAvailable, sourceToken.decimals),
        symbol: sourceToken.symbol,
      });
    }
    return '';
  }, [
    amountBigInt,
    sourceToken,
    requiredNetworkFee,
    minTransferAmount,
    hasEnoughBalanceForTransfer,
    hasInsufficientBalance,
    t,
  ]);

  const clearError = useCallback(() => {
    setBridgeError('');
  }, []);

  const onBridgeError = useCallback((err: unknown, fallbackMessage: string) => {
    if (isAddressBlockedError(err)) {
      setIsAddressBlocked(true);
    } else if (err instanceof Error) {
      setBridgeError(err.message);
    } else if (typeof err === 'string') {
      setBridgeError(err);
    } else {
      setBridgeError(fallbackMessage);
    }
  }, []);

  return {
    error: hasInsufficientBalance
      ? t('Insufficient balance')
      : minAmountError || maxAmountError || bridgeError,
    clearError,
    onBridgeError,
    isAddressBlocked,
  };
};
