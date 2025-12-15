import { toast } from '@avalabs/k2-alpine';
import { useDeriveMissingKeysForSeedless } from '@core/ui';
import { useMemo, useRef } from 'react';
import { useTranslation } from 'react-i18next';

export const useSeedlessMissingKeysDerivation = () => {
  const { t } = useTranslation();

  const toastId = useRef<string | number>(undefined);
  const callbacks = useMemo(
    () => ({
      onLoading: () => {
        toastId.current = toast.info(t('Updating accounts...'));
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
          // TODO: The method actually works fine with both string and numbers,
          // but the typing exported from @avalabs/k2-alpine is not correct.
          toast.dismiss(toastId.current as string);
        }
        toastId.current = undefined;
      },
    }),
    [t],
  );

  useDeriveMissingKeysForSeedless(callbacks);
};
