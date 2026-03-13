import { FC } from 'react';
import { AppNotification, isBalanceChangeNotification } from '@core/types';
import { hasAtLeastOneElement } from '@core/common';
import { NotificationListItem } from './NotificationListItem';
import { NotificationIcon } from './NotificationIcon';
import { TFunction, useTranslation } from 'react-i18next';

type BalanceChangeItemProps = {
  notification: AppNotification;
  showSeparator: boolean;
  accessoryType: 'chevron' | 'none';
  onClick?: () => void;
};

const getTitle = (notification: AppNotification, t: TFunction): string => {
  if (!isBalanceChangeNotification(notification)) return notification.title;
  const { transfers = [], event } = notification.data ?? {};
  if (!hasAtLeastOneElement(transfers)) return notification.title;

  const isSent = event === 'BALANCES_SPENT';
  const isMoved = event === 'BALANCES_TRANSFERRED';
  const isApprovalEvent = event === 'ALLOWANCE_APPROVED';

  const [firstTransfer] = transfers;

  if (isApprovalEvent) {
    const { amount, tokenSymbol } = firstTransfer;

    if (amount === '0') {
      return t('Revoked allowance for {{tokenSymbol}}', { tokenSymbol });
    }

    return t('Approved {{tokenSymbol}} up to {{amount}}', {
      amount,
      tokenSymbol,
    });
  }

  const tokenList = transfers
    .map(({ amount, tokenSymbol }) => `${amount} ${tokenSymbol}`)
    .join(', ');

  if (isSent) {
    return t('Sent {{tokenList}}', { tokenList });
  }
  if (isMoved) {
    return t('Moved {{tokenList}}', { tokenList });
  }

  return t('Received {{tokenList}}', { tokenList });
};

const getSubtitle = (notification: AppNotification, t: TFunction): string => {
  if (!isBalanceChangeNotification(notification)) return notification.body;
  const { transfers = [], event } = notification.data ?? {};
  if (!hasAtLeastOneElement(transfers)) return notification.body;

  const [firstTransfer] = transfers;

  const isSent = event === 'BALANCES_SPENT';
  const isMoved = event === 'BALANCES_TRANSFERRED';
  const isApprovalEvent = event === 'ALLOWANCE_APPROVED';

  const { partnerAddress } = firstTransfer;

  if (!partnerAddress) return notification.body;

  if (isApprovalEvent) {
    return t('for {{spender}}', { spender: partnerAddress });
  }

  if (isMoved || isSent) {
    return t('to {{partnerAddress}}', { partnerAddress });
  }

  return t('from {{partnerAddress}}', { partnerAddress });
};

export const BalanceChangeItem: FC<BalanceChangeItemProps> = ({
  notification,
  showSeparator,
  accessoryType,
  onClick,
}) => {
  const { t } = useTranslation();

  return (
    <NotificationListItem
      title={getTitle(notification, t)}
      subtitle={getSubtitle(notification, t)}
      icon={<NotificationIcon notification={notification} />}
      timestamp={notification.timestamp}
      showSeparator={showSeparator}
      accessoryType={accessoryType}
      onClick={onClick}
    />
  );
};
