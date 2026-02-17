import { useTranslation } from 'react-i18next';
import { toast } from '@avalabs/k2-alpine';

import {
  isMissingBtcWalletPolicyError,
  isUserRejectionError,
} from '@core/common';
import { NetworkWithCaipId } from '@core/types';
import { useAnalyticsContext } from '@core/ui';

const TOAST_ID = 'send-result';

export const useTransactionCallbacks = (
  network: NetworkWithCaipId,
  fromAddress?: string,
) => {
  const { t } = useTranslation();
  const { captureEncrypted } = useAnalyticsContext();

  return {
    onSendApproved: () => {
      if (fromAddress) {
        captureEncrypted('SendApproved', {
          address: fromAddress,
          chainId: network?.chainId,
        });
      }
    },
    // When transaction is successfully sent to the network
    onSendSuccess: (hash: string) => {
      if (fromAddress) {
        captureEncrypted('SendSuccessful', {
          address: fromAddress,
          txHash: hash,
          chainId: network?.chainId,
        });
      }
    },
    // When transaction could not be sent to the network or failed immediately
    onSendFailure: (err: unknown) => {
      console.error('Failed to send transaction:', err);

      if (isMissingBtcWalletPolicyError(err)) {
        toast.error(t('Missing Bitcoin wallet policy'), { id: TOAST_ID });
      }

      if (!isUserRejectionError(err)) {
        toast.error(t('Failed to send the transaction'), { id: TOAST_ID });
      }
    },
  };
};
