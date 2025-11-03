import { handleTxOutcome } from '@core/common';
import { useMemo } from 'react';
import { useTranslation } from 'react-i18next';
import { useBridgeQuery } from '../contexts';
import { useBridgeErrorHandler } from './useBridgeErrorHandler';

export type TransferResult = Awaited<
  ReturnType<typeof handleTxOutcome<string>>
>;

export const useBridgeTxHandlers = ({
  clearError,
  onBridgeError,
}: ReturnType<typeof useBridgeErrorHandler>) => {
  const { updateQuery } = useBridgeQuery();
  const { t } = useTranslation();
  return useMemo(
    () => ({
      onSuccess: (result: Extract<TransferResult, { hasError: false }>) => {
        updateQuery({ transactionId: result.result });
        clearError();
      },
      onRejected: (result: Extract<TransferResult, { hasError: true }>) => {
        onBridgeError(result.error, t('This transaction has been rejected'));
      },
      onFailure: (error: unknown) => {
        onBridgeError(error, t('This transaction has failed'));
      },
    }),
    [clearError, onBridgeError, t, updateQuery],
  );
};
