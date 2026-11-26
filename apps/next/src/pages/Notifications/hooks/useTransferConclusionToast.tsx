import { useEffect, useRef } from 'react';
import { TFunction, useTranslation } from 'react-i18next';
import { useHistory } from 'react-router-dom';
import { Transfer } from '@avalabs/fusion-sdk';

import {
  ContextContainer,
  isCompletedTransfer,
  isConcludedTransfer,
  isCrossChainTransfer,
  isRefundedTransfer,
} from '@core/types';
import {
  isSpecificContextContainer,
  toast,
  useTransferTrackingContext,
} from '@core/ui';

import { TransferProgressLink } from '@/pages/Fusion/components/TransferProgressLink';

import { getTransferTokenLabel } from '../lib/getTransferTokenLabel';

const TOAST_ID_PREFIX = 'transfer-concluded';

const TOAST_CONTEXTS = [ContextContainer.POPUP, ContextContainer.SIDE_PANEL];

const isToastContext = () => TOAST_CONTEXTS.some(isSpecificContextContainer);

const isConcludedCrossChainTransfer = (transfer: Transfer) =>
  isCrossChainTransfer(transfer) && isConcludedTransfer(transfer);

export const useTransferConclusionToast = () => {
  const { t } = useTranslation();
  const history = useHistory();
  const { transfers, isLoading } = useTransferTrackingContext();
  const concludedIdsRef = useRef<Set<string> | null>(null);
  const toastedIdsRef = useRef(new Set<string>());

  useEffect(() => {
    if (isLoading || !isToastContext()) {
      return;
    }

    const concludedIds = new Set(
      transfers
        .filter(({ transfer }) => isConcludedCrossChainTransfer(transfer))
        .map(({ transfer }) => transfer.id),
    );

    const previouslyConcluded = concludedIdsRef.current;
    concludedIdsRef.current = concludedIds;

    if (!previouslyConcluded) {
      return;
    }

    for (const { transfer } of transfers) {
      if (
        !isConcludedCrossChainTransfer(transfer) ||
        previouslyConcluded.has(transfer.id) ||
        toastedIdsRef.current.has(transfer.id)
      ) {
        continue;
      }

      toastedIdsRef.current.add(transfer.id);

      const toastId = `${TOAST_ID_PREFIX}-${transfer.id}`;
      const options = {
        id: toastId,
        action: (
          <TransferProgressLink
            transferId={transfer.id}
            onOpen={() => {
              toast.dismiss(toastId);
              history.push(`/fusion-transfer/${transfer.id}`);
            }}
          />
        ),
      };
      const copyArgs = {
        from: getTransferTokenLabel(transfer, 'source'),
        to: getTransferTokenLabel(transfer, 'target'),
      };

      if (isCompletedTransfer(transfer)) {
        toast.success(
          t('Swap from {{from}} to {{to}} completed', copyArgs),
          options,
        );
      } else {
        toast.error(getFailureTitle(transfer, copyArgs, t), options);
      }
    }
  }, [transfers, isLoading, history, t]);
};

const getFailureTitle = (
  transfer: Transfer,
  copyArgs: { from: string; to: string },
  t: TFunction,
) =>
  isRefundedTransfer(transfer)
    ? t('Swap from {{from}} to {{to}} refunded', copyArgs)
    : t('Swap from {{from}} to {{to}} failed', copyArgs);
