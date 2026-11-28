import { copySecretToClipboard } from '@/lib/copySecretToClipboard';
import { ScheduleClipboardSecretClearHandler } from '@core/service-worker';
import { ExtensionRequest } from '@core/types';
import { toast, useConnectionContext } from '@core/ui';
import { useCallback } from 'react';
import { useTranslation } from 'react-i18next';

export type CopiedSecretType = 'recoveryPhrase' | 'privateKey';

const WARNING_TOAST_DURATION_MS = 8000;

/**
 * Returns a function that copies a recovery phrase or private key to the
 * clipboard, warns the user and clears it again after 60 seconds.
 * Use this instead of `navigator.clipboard.writeText` for any secret.
 */
export const useCopySecretToClipboard = () => {
  const { t } = useTranslation();
  const { request } = useConnectionContext();

  return useCallback(
    async (secret: string, secretType: CopiedSecretType) => {
      try {
        await copySecretToClipboard(secret, {
          notify: () =>
            toast.success(
              t('Copied. Clipboard will be cleared in 60 seconds.'),
              {
                id: `${secretType}-copied`,
                duration: WARNING_TOAST_DURATION_MS,
                description:
                  secretType === 'privateKey'
                    ? t('Never share your private key with anyone.')
                    : t('Never share your recovery phrase with anyone.'),
              },
            ),
          scheduleBackgroundClear: (hash) =>
            request<ScheduleClipboardSecretClearHandler>({
              method: ExtensionRequest.CLIPBOARD_SCHEDULE_SECRET_CLEAR,
              params: [hash],
            }),
        });
        return true;
      } catch {
        toast.error(t('Failed to copy to clipboard'));
        return false;
      }
    },
    [request, t],
  );
};
