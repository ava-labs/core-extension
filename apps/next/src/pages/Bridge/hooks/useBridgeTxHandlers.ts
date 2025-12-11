import { handleTxOutcome, isAddressBlockedError } from '@core/common';
import { useCallback, useState } from 'react';
import { useTranslation } from 'react-i18next';
import { useBridgeQuery } from '../contexts';
import { toast } from '@avalabs/k2-alpine';
import { useErrorMessage } from '@core/ui';

export type TransferResult = Awaited<
  ReturnType<typeof handleTxOutcome<string>>
>;
const TOAST_ID = 'bridge-result';

export const useBridgeTxHandlers = () => {
  const [isAddressBlocked, setIsAddressBlocked] = useState(false);
  const getTranslatedError = useErrorMessage();

  const { updateQuery } = useBridgeQuery();
  const { t } = useTranslation();

  const onBridgeError = useCallback(
    (err: unknown) => {
      if (isAddressBlockedError(err)) {
        setIsAddressBlocked(true);
      } else {
        const { title, hint } = getTranslatedError(err);
        toast.error(title, {
          description: hint,
          id: TOAST_ID,
        });
      }
    },
    [getTranslatedError],
  );

  const onSuccess = useCallback(
    (result: Extract<TransferResult, { hasError: false }>) => {
      updateQuery({ transactionId: result.result });
    },
    [updateQuery],
  );

  const onRejected = useCallback(() => {
    toast.error(t('This transaction has been rejected'), { id: TOAST_ID });
  }, [t]);

  const onFailure = useCallback(
    (error: unknown) => {
      onBridgeError(error);
    },
    [onBridgeError],
  );

  return {
    isAddressBlocked,
    onSuccess,
    onRejected,
    onFailure,
  };
};
