import { AnimatedSyncIcon } from '@/components/AnimatedSyncIcon';
import { useTheme } from '@avalabs/k2-alpine';
import { FC } from 'react';
import * as Styled from './Styled';
import { Transfer } from '@avalabs/fusion-sdk';
import {
  isCompletedTransfer,
  isFailedTransfer,
  isTransferInProgress,
} from '@core/types';
import { MdCheckCircle, MdError } from 'react-icons/md';
import { TFunction, useTranslation } from 'react-i18next';
import { getTransferTimestamp } from '../lib/getTransferTimestamp';
import { NotificationListItem } from './NotificationListItem';

type Props = {
  onClick?: VoidFunction;
  transfer: Transfer;
  showSeparator: boolean;
};

export const TransferItem: FC<Props> = ({
  transfer,
  onClick,
  showSeparator,
}) => {
  const theme = useTheme();
  const { t } = useTranslation();

  const title = getTransferTitle(transfer, t);
  const icon = (
    <Styled.Avatar>
      {isTransferInProgress(transfer) ? (
        <AnimatedSyncIcon size={20} data-active={true} />
      ) : isCompletedTransfer(transfer) ? (
        <MdCheckCircle size={20} color={theme.palette.success.main} />
      ) : (
        <MdError size={20} color={theme.palette.error.main} />
      )}
    </Styled.Avatar>
  );

  return (
    <NotificationListItem
      title={title}
      subtitle={t('Click for more details')}
      icon={icon}
      timestamp={getTransferTimestamp(transfer)}
      showSeparator={showSeparator}
      accessoryType="chevron"
      onClick={onClick}
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
