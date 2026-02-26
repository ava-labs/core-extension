import { useTranslation } from 'react-i18next';
import { Transfer } from '@avalabs/unified-asset-transfer';

import { isFailedTransfer } from '@core/types';

import { Side } from '../types';
import { isTransferSuccessfulForSide } from '../lib/isTransferSuccessfulForSide';

export const useTransferStatusForSide = (transfer: Transfer, side: Side) => {
  const { t } = useTranslation();

  // FIXME: This is temporary, we currently don't know if the transfer failed on the source or target side.
  if (isFailedTransfer(transfer)) {
    return t('Failed');
  }

  if (isTransferSuccessfulForSide(transfer, side)) {
    return t('Complete');
  }

  return t('Pending...');
};
