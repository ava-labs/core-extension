import { useTranslation } from 'react-i18next';
import { Transfer } from '@avalabs/fusion-sdk';

import { isFailedTransfer, isRefundedTransfer } from '@core/types';

import { Side } from '../types';
import { isTransferSuccessfulForSide } from '../lib/isTransferSuccessfulForSide';

export const useTransferStatusForSide = (transfer: Transfer, side: Side) => {
  const { t } = useTranslation();

  if (isTransferSuccessfulForSide(transfer, side)) {
    return t('Complete');
  }

  if (isFailedTransfer(transfer)) {
    return t('Failed');
  }

  if (isRefundedTransfer(transfer)) {
    return t('Incomplete');
  }

  return t('Pending...');
};
