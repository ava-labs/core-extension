import { useMemo, useRef } from 'react';
import { useTranslation } from 'react-i18next';
import { toast } from '@avalabs/core-k2-components';

export const useMissingKeysDerivationCallbacks = () => {
  const { t } = useTranslation();

  const toastId = useRef<string>(undefined);

  return useMemo(
    () => ({
      onLoading: () => {
        toastId.current = toast.loading(t('Updating accounts...'));
      },
      onSuccess: () => {
        // If we haven't managed to display the "Updating accounts..." message,
        // we don't show the "Accounts updated" message either.
        if (toastId.current) {
          toast.success(t('Accounts updated'), { id: toastId.current });
        }
        toastId.current = undefined;
      },
      onFailure: () => {
        // We don't show anything if it fails, as there is nothing the user can do.
        // This will be retried automatically on the next extension load (with an anti-spam delay).
        if (toastId.current) {
          toast.dismiss(toastId.current);
        }
        toastId.current = undefined;
      },
    }),
    [t],
  );
};
