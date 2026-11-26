import { useRef } from 'react';
import { useTranslation } from 'react-i18next';
import { useHistory } from 'react-router-dom';

import {
  isMissingBtcWalletPolicyError,
  isUserRejectionError,
} from '@core/common';
import { NetworkWithCaipId } from '@core/types';
import { toast, useAnalyticsContext } from '@core/ui';

import { getSendPath, SEND_QUERY_TOKENS } from '@/config/routes';

const TOAST_ID = 'send-result';

const PRESERVED_SEND_QUERY_KEYS = [
  SEND_QUERY_TOKENS.fromQuery,
  SEND_QUERY_TOKENS.token,
  SEND_QUERY_TOKENS.tokenQuery,
];

const IGNORED_DRAFT_KEYS = [
  SEND_QUERY_TOKENS.fromQuery,
  SEND_QUERY_TOKENS.tokenQuery,
];

const getDraftSignature = (search: string) => {
  const params = new URLSearchParams(search);
  // In max mode the amount is re-synced on every fee refresh while approval is pending
  const isMaxMode = params.get(SEND_QUERY_TOKENS.isMax) === '1';
  const entries: string[] = [];

  params.forEach((value, key) => {
    if (
      !IGNORED_DRAFT_KEYS.includes(key) &&
      !(isMaxMode && key === SEND_QUERY_TOKENS.amount)
    ) {
      entries.push(`${key}=${value}`);
    }
  });

  return entries.sort().join('&');
};

export const useTransactionCallbacks = (
  network: NetworkWithCaipId,
  fromAddress?: string,
) => {
  const { t } = useTranslation();
  const { capture } = useAnalyticsContext();
  const history = useHistory();
  const submittedDraftRef = useRef<string | undefined>(undefined);

  return {
    onSendApproved: () => {
      submittedDraftRef.current = getDraftSignature(history.location.search);

      if (fromAddress) {
        capture('SendApproved', {
          address: fromAddress,
          chainId: network?.chainId,
        });
      }
    },
    // When transaction is successfully sent to the network
    onSendSuccess: (hash: string) => {
      if (fromAddress) {
        capture('SendSuccessful', {
          address: fromAddress,
          txHash: hash,
          chainId: network?.chainId,
        });
      }

      if (
        history.location.pathname === getSendPath() &&
        submittedDraftRef.current === getDraftSignature(history.location.search)
      ) {
        const current = new URLSearchParams(history.location.search);
        const preserved = new URLSearchParams();

        for (const key of PRESERVED_SEND_QUERY_KEYS) {
          const value = current.get(key);

          if (value) {
            preserved.set(key, value);
          }
        }

        history.replace({
          pathname: getSendPath(),
          search: preserved.toString(),
        });
      }
    },
    // When transaction could not be sent to the network or failed immediately
    onSendFailure: (err: unknown) => {
      console.error('Failed to send transaction:', err);

      if (isMissingBtcWalletPolicyError(err)) {
        toast.error(t('Missing Bitcoin wallet policy'), {
          id: TOAST_ID,
        });
      }

      if (!isUserRejectionError(err)) {
        toast.error(t('Failed to send the transaction'), {
          id: TOAST_ID,
        });
      }
    },
  };
};
