import { bigToLocaleString, bigintToBig } from '@avalabs/core-utils-sdk';
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
    targetToken,
    query: { transactionId, amount },
    state: { pendingTransfers },
  } = useBridgeState();

  const clearError = useCallback(() => {
    setError('');
  }, []);

  useEffect(() => {
    if (transactionId) {
      const pendingTransfer = pendingTransfers[transactionId];
      if (pendingTransfer) {
        setError(
          t('Bridge error: {{error}}', { error: pendingTransfer.errorCode }),
        );
      }
    }
  }, [transactionId, pendingTransfers, t]);

  useEffect(() => {
    if (!amount || minTransferAmount == null || !targetToken) {
      clearError();
      return;
    }

    const bigIntAmount = stringToBigint(amount, targetToken.decimals);
    if (bigIntAmount < minTransferAmount) {
      setError(
        t('Minimum transfer amount is {{minAmount}}', {
          minAmount: bigToLocaleString(
            bigintToBig(minTransferAmount, targetToken.decimals),
          ),
        }),
      );
    } else {
      clearError();
    }
  }, [amount, clearError, minTransferAmount, targetToken, t]);

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
