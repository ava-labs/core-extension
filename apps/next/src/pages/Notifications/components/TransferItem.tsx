import { AnimatedSyncIcon } from '@/components/AnimatedSyncIcon';
import { Box, useTheme } from '@avalabs/k2-alpine';
import { FC } from 'react';
import * as Styled from './Styled';
import { Transfer } from '@avalabs/fusion-sdk';
import {
  isCompletedTransfer,
  isConcludedTransfer,
  isFailedTransfer,
  isRefundedTransfer,
  isTransferInProgress,
} from '@core/types';
import { useTransferTrackingContext } from '@core/ui';
import { MdCheckCircle, MdError, MdReplay } from 'react-icons/md';
import { TFunction, useTranslation } from 'react-i18next';
import { getTransferTimestamp } from '../lib/getTransferTimestamp';
import { NotificationListItem } from './NotificationListItem';
import { useHistory } from 'react-router-dom';

type Props = {
  transfer: Transfer;
  showSeparator: boolean;
};

export const TransferItem: FC<Props> = ({ transfer, showSeparator }) => {
  const theme = useTheme();
  const { t } = useTranslation();
  const { push } = useHistory();
  const { transfers } = useTransferTrackingContext();
  const transferMeta = transfers.find(
    ({ transfer: { id } }) => id === transfer.id,
  );
  const isUnread = transferMeta
    ? !transferMeta.isRead && isConcludedTransfer(transfer)
    : false;

  const title = getTransferTitle(transfer, t);
  const icon = (
    <Styled.Avatar>
      {isTransferInProgress(transfer) ? (
        <Box display="flex" data-testid="notification-transfer-icon-syncing">
          <AnimatedSyncIcon size={20} data-active={true} />
        </Box>
      ) : isCompletedTransfer(transfer) ? (
        <Box display="flex" data-testid="notification-transfer-icon-completed">
          <MdCheckCircle size={20} color={theme.palette.success.main} />
        </Box>
      ) : isRefundedTransfer(transfer) ? (
        <Box display="flex" data-testid="notification-transfer-icon-refunded">
          <MdReplay size={20} color={theme.palette.error.main} />
        </Box>
      ) : (
        <Box display="flex" data-testid="notification-transfer-icon-failed">
          <MdError size={20} color={theme.palette.error.main} />
        </Box>
      )}
    </Styled.Avatar>
  );

  return (
    <NotificationListItem
      title={title}
      isUnread={isUnread}
      subtitle={t('Click for more details')}
      icon={icon}
      timestamp={
        isTransferInProgress(transfer)
          ? undefined
          : getTransferTimestamp(transfer)
      }
      showSeparator={showSeparator}
      accessoryType="chevron"
      onClick={() => push(`/fusion-transfer/${transfer.id}`)}
      data-testid={`notification-transfer-item-${transfer.id}`}
    />
  );
};

const getTransferTitle = (transfer: Transfer, t: TFunction) => {
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
};
