import { useCallback, useEffect, useState } from 'react';
import { useBridgeQuery, useNextUnifiedBridgeContext } from '../contexts';

export const useBridgeErrorHandler = () => {
  const { transactionId } = useBridgeQuery();
  const [error, setError] = useState<string>('');
  const { getErrorMessage, state } = useNextUnifiedBridgeContext();

  const clearError = useCallback(() => {
    setError('');
  }, []);

  useEffect(() => {
    if (transactionId) {
      const pendingTransfer = state.pendingTransfers[transactionId];
      if (pendingTransfer?.errorCode) {
        setError(getErrorMessage(pendingTransfer.errorCode));
      }
    }
  }, [transactionId, state.pendingTransfers, getErrorMessage]);

  const onBridgeError = useCallback((err: unknown, fallbackMessage: string) => {
    console.error('Bridge error:', err);

    if (err instanceof Error) {
      setError(err.message);
    } else if (typeof err === 'string') {
      setError(err);
    } else {
      setError(fallbackMessage);
    }
  }, []);

  return {
    error,
    setError,
    clearError,
    onBridgeError,
  };
};
