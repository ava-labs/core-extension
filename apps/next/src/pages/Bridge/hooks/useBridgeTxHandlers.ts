import { handleTxOutcome, isAddressBlockedError } from '@core/common';
import { useCallback, useState } from 'react';
import { useTranslation } from 'react-i18next';
import { useBridgeQuery } from '../contexts';

export type TransferResult = Awaited<
  ReturnType<typeof handleTxOutcome<string>>
>;

export const useBridgeTxHandlers = () => {
  const [bridgeError, setBridgeError] = useState<string>('');
  const [isAddressBlocked, setIsAddressBlocked] = useState(false);

  const { updateQuery } = useBridgeQuery();
  const { t } = useTranslation();

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

  const onSuccess = useCallback(
    (result: Extract<TransferResult, { hasError: false }>) => {
      updateQuery({ transactionId: result.result });
      clearError();
    },
    [clearError, updateQuery],
  );

  const onRejected = useCallback(
    (result: Extract<TransferResult, { hasError: true }>) => {
      onBridgeError(result.error, t('This transaction has been rejected'));
    },
    [onBridgeError, t],
  );

  const onFailure = useCallback(
    (error: unknown) => {
      onBridgeError(error, t('This transaction has failed'));
    },
    [onBridgeError, t],
  );

  return {
    error: bridgeError,
    isAddressBlocked,
    onSuccess,
    onRejected,
    onFailure,
  };
};
