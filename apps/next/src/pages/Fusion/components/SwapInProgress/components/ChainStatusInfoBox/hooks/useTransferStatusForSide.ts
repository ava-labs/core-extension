import { useTranslation } from 'react-i18next';
import { Transfer } from '@avalabs/fusion-sdk';

import { isFailedTransfer, isRefundedTransfer } from '@core/types';

import { Side } from '../types';
import { isTransferSuccessfulForSide } from '../lib/isTransferSuccessfulForSide';

export const useTransferStatusForSide = (transfer: Transfer, side: Side) => {
  const { t } = useTranslation();

  if (isFailedTransfer(transfer)) {
    return t('Failed');
  }

  if (isRefundedTransfer(transfer)) {
    return side === 'source' ? t('Complete') : t('Refunded');
  }

  if (isTransferSuccessfulForSide(transfer, side)) {
    return t('Complete');
  }

  return t('Pending...');
};
