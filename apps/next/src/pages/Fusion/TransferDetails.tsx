import { FC } from 'react';
import { useParams } from 'react-router-dom';
import { useTranslation } from 'react-i18next';

import { useTransferTrackingContext } from '@core/ui';
import { isCompletedTransfer, isTransferInProgress } from '@core/types';

import { Page } from '@/components/Page';

import { IssuedSwapDetails } from './components/SwapInProgress/IssuedSwapDetails';
import { LoadingScreen } from '@/components/LoadingScreen';

export const TransferDetails: FC = () => {
  const { t } = useTranslation();
  const { id: transferId } = useParams<{ id: string }>();
  const { transfers } = useTransferTrackingContext();

  const trackedTransfer = transfers.find(
    ({ transfer: { id } }) => id === transferId,
  );

  const isLoading = !transferId || !transfers;

  const title = !trackedTransfer
    ? ''
    : isTransferInProgress(trackedTransfer.transfer)
      ? t('Swap in progress...')
      : isCompletedTransfer(trackedTransfer.transfer)
        ? t('Swap successful!')
        : t('Swap failed');

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
        'not found'
      )}
    </Page>
  );
};
