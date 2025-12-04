import { useCallback } from 'react';
import { useTranslation } from 'react-i18next';
import { ChevronRightIcon, IconButton, toast } from '@avalabs/k2-alpine';

import { openNewTab } from '@core/common';
import { useConfettiContext } from '@/components/Confetti';

const PENDING_TOAST_ID = 'swap-pending';
const RESULT_TOAST_ID = 'swap-result';

type ShowToastWithLinkOptions = {
  title: string;
  url: string;
  label: string;
};

export const useSwapCallbacks = () => {
  const { t } = useTranslation();
  const { triggerConfetti } = useConfettiContext();

  const showPendingToast = useCallback(() => {
    toast.info(t('Transaction pending...'), {
      id: PENDING_TOAST_ID,
      duration: 60_000,
    });

    return PENDING_TOAST_ID;
  }, [t]);

  const showErrorToast = useCallback((message: string) => {
    toast.dismiss(PENDING_TOAST_ID);
    toast.error(message, { id: RESULT_TOAST_ID });

    return RESULT_TOAST_ID;
  }, []);

  const showToastWithLink = useCallback(
    ({ url }: ShowToastWithLinkOptions) => {
      toast.dismiss(PENDING_TOAST_ID);
      triggerConfetti();
      toast.success(t('Transaction successful'), {
        id: RESULT_TOAST_ID,
        duration: 10_000,
        action: (
          <IconButton
            size="small"
            sx={{ color: 'background.default', padding: 0 }}
            onClick={() => {
              toast.dismiss(RESULT_TOAST_ID);
              openNewTab({
                url,
              });
            }}
          >
            <ChevronRightIcon size={18} />
          </IconButton>
        ),
      });

      return RESULT_TOAST_ID;
    },
    [t, triggerConfetti],
  );

  return {
    removeToast: toast.dismiss,
    showErrorToast,
    showPendingToast,
    showToastWithLink,
  };
};
