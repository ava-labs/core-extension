import { AnimatedSyncIcon } from '@/components/AnimatedSyncIcon';
import { getChainFilterName } from '@/components/TokenSelect/utils';
import { Box, useTheme } from '@avalabs/k2-alpine';
import { FC } from 'react';
import * as Styled from './Styled';
import { ServiceType, Transfer } from '@avalabs/fusion-sdk';
import {
  isCompletedTransfer,
  isConcludedTransfer,
  isFailedTransfer,
  isRefundedTransfer,
  isTransferInProgress,
} from '@core/types';
import { useTransferTrackingContext } from '@core/ui';
import { caipToChainId } from '@core/common';
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
  const sourceToken = getTransferTokenLabel(transfer, 'source');
  const targetToken = getTransferTokenLabel(transfer, 'target');

  if (isCompletedTransfer(transfer)) {
    return t('Swapped {{sourceToken}} to {{targetToken}}', {
      sourceToken,
      targetToken,
    });
  }

  if (isFailedTransfer(transfer)) {
    return t('Swapping {{sourceToken}} to {{targetToken}} failed', {
      sourceToken,
      targetToken,
    });
  }
  return t('Swapping {{sourceToken}} to {{targetToken}} in progress...', {
    sourceToken,
    targetToken,
  });
};

const getTransferTokenLabel = (
  transfer: Transfer,
  side: 'source' | 'target',
) => {
  const asset = side === 'source' ? transfer.sourceAsset : transfer.targetAsset;
  const chain = side === 'source' ? transfer.sourceChain : transfer.targetChain;

  if (transfer.type !== ServiceType.AVALANCHE_CCT) {
    return asset.symbol;
  }

  return `${asset.symbol} (${getChainFilterName(caipToChainId(chain.chainId))})`;
};
