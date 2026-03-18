import { FC } from 'react';
import { Redirect, useParams } from 'react-router-dom';
import { useTranslation } from 'react-i18next';
import { Transfer } from '@avalabs/fusion-sdk';
import { TFunction } from 'i18next';

import { useTransferTrackingContext } from '@core/ui';
import {
  isCompletedTransfer,
  isRefundedTransfer,
  isTransferInProgress,
} from '@core/types';

import { Page } from '@/components/Page';

import { IssuedSwapDetails } from './components/SwapInProgress/IssuedSwapDetails';
import { LoadingScreen } from '@/components/LoadingScreen';

function getTransferDetailsTitle(transfer: Transfer, t: TFunction): string {
  if (isTransferInProgress(transfer)) return t('Swap in progress...');
  if (isCompletedTransfer(transfer)) return t('Swap successful!');
  if (isRefundedTransfer(transfer)) return t('Swap refunded');
  return t('Swap failed');
}

export const TransferDetails: FC = () => {
  const { t } = useTranslation();
  const { id: transferId } = useParams<{ id: string }>();
  const { transfers } = useTransferTrackingContext();

  const trackedTransfer = transfers.find(
    ({ transfer: { id } }) => id === transferId,
  );

  const isLoading = !transferId || !transfers;

  const title = trackedTransfer
    ? getTransferDetailsTitle(trackedTransfer.transfer, t)
    : '';

  return (
    <Page
      title={title}
      withBackButton
      contentProps={{
        justifyContent: 'flex-start',
      }}
    >
      {isLoading ? (
        <LoadingScreen />
      ) : trackedTransfer ? (
        <IssuedSwapDetails
          transfer={trackedTransfer.transfer}
          isRead={trackedTransfer.isRead}
        />
      ) : (
        <Redirect to="/notifications" />
      )}
    </Page>
  );
};
