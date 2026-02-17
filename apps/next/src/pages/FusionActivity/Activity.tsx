import { useCallback } from 'react';
import { StackProps } from '@avalabs/k2-alpine';
import { useTranslation } from 'react-i18next';
import { Transfer } from '@avalabs/unified-asset-transfer';

import {
  isTransferInProgress,
  isCompletedTransfer,
  isFailedTransfer,
} from '@core/types';
import { useTransferTrackingContext } from '@core/ui';

import { Page } from '@/components/Page';

import { ActivityItem } from './components';

const contentProps: StackProps = {
  justifyContent: 'flex-start',
  alignItems: 'stretch',
  width: 1,
  height: 1,
  gap: 1,
};

export const FusionActivity = () => {
  const { t } = useTranslation();
  const { transfers } = useTransferTrackingContext();

  const getTransferTitle = useCallback(
    (transfer: Transfer) => {
      if (isCompletedTransfer(transfer)) {
        return t('Swapped {{sourceToken}} to {{targetToken}}', {
          sourceToken: transfer.sourceAsset.symbol,
          targetToken: transfer.targetAsset.symbol,
        });
      }

      if (isFailedTransfer(transfer)) {
        return t('Swapping {{sourceToken}} to {{targetToken}} failed', {
          sourceToken: transfer.sourceAsset.symbol,
          targetToken: transfer.targetAsset.symbol,
        });
      }
      return t('Swapping {{sourceToken}} to {{targetToken}} in progress...', {
        sourceToken: transfer.sourceAsset.symbol,
        targetToken: transfer.targetAsset.symbol,
      });
    },
    [t],
  );

  return (
    <Page title={t('Activity')} withBackButton contentProps={contentProps}>
      {Object.values(transfers).map((transfer) => (
        <ActivityItem
          key={transfer.id}
          pending={isTransferInProgress(transfer)}
          title={getTransferTitle(transfer)}
          subtitle={t('Click for more details')}
          onClick={() => {
            alert('TODO: Implement transfer details page');
          }}
        />
      ))}
    </Page>
  );
};
