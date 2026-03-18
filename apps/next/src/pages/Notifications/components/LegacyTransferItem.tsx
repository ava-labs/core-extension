import { AnimatedSyncIcon } from '@/components/AnimatedSyncIcon';
import { useTheme } from '@avalabs/k2-alpine';
import { FC } from 'react';
import * as Styled from './Styled';
import { MdCheckCircle, MdError } from 'react-icons/md';
import { useTranslation } from 'react-i18next';
import { NotificationListItem } from './NotificationListItem';
import { BridgeTransfer } from '@avalabs/bridge-unified';
import { getLegacyTransferTimestamp } from '../lib/getLegacyTransferTimestamp';
import { useHistory } from 'react-router-dom';
import { getBridgePath } from '@/config/routes';

type Props = {
  transfer: BridgeTransfer;
  showSeparator: boolean;
};

export const LegacyTransferItem: FC<Props> = ({ transfer, showSeparator }) => {
  const theme = useTheme();
  const { t } = useTranslation();
  const { push } = useHistory();

  const isSuccessful = transfer.completedAt && !transfer.errorCode;
  const isFailed = transfer.completedAt && transfer.errorCode;
  const isInProgress = !isSuccessful && !isFailed;
  const title = isSuccessful
    ? t('{{token}} bridge completed', {
        token: transfer.asset.symbol,
      })
    : isFailed
      ? t('{{token}} bridge failed', {
          token: transfer.asset.symbol,
        })
      : t('{{token}} bridge in progress...', {
          token: transfer.asset.symbol,
        });

  const icon = (
    <Styled.Avatar>
      {isInProgress ? (
        <AnimatedSyncIcon size={20} data-active={true} />
      ) : isSuccessful ? (
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
      timestamp={
        isInProgress ? undefined : getLegacyTransferTimestamp(transfer)
      }
      showSeparator={showSeparator}
      accessoryType="chevron"
      onClick={() =>
        push(
          getBridgePath({
            transactionId: transfer.sourceTxHash,
          }),
        )
      }
    />
  );
};
