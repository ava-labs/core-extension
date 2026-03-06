import { FC } from 'react';
import { AppNotification, isBalanceChangeNotification } from '@core/types';
import { hasAtLeastOneElement } from '@core/common';
import { NotificationListItem } from './NotificationListItem';
import { NotificationIcon } from './NotificationIcon';

type BalanceChangeItemProps = {
  notification: AppNotification;
  showSeparator: boolean;
  accessoryType: 'chevron' | 'none';
  onClick?: () => void;
};

const getTitle = (notification: AppNotification): string => {
  if (!isBalanceChangeNotification(notification)) return notification.title;
  const { transfers = [], event } = notification.data ?? {};
  if (!hasAtLeastOneElement(transfers)) return notification.title;

  const isSent = event === 'BALANCES_SPENT' || event === 'BALANCES_TRANSFERRED';

  if (transfers.length === 1) {
    const [{ amount, tokenSymbol }] = transfers;
    if (event === 'ALLOWANCE_APPROVED') {
      if (amount === '0') {
        return `${tokenSymbol} revoked`;
      }
      return `${amount} ${tokenSymbol} approved`;
    }
    const action = isSent ? 'sent' : 'received';
    return `${amount} ${tokenSymbol} ${action}`;
  }

  const tokenList = transfers
    .map((t) => `${t.amount} ${t.tokenSymbol}`)
    .join(', ');
  const action = isSent ? 'sent' : 'received';
  return `${tokenList} ${action}`;
};

const getSubtitle = (notification: AppNotification): string => {
  if (!isBalanceChangeNotification(notification)) return notification.body;
  const { transfers = [], event } = notification.data ?? {};
  if (!hasAtLeastOneElement(transfers)) return notification.body;

  const [firstTransfer] = transfers;
  const { partnerAddress, amount, tokenSymbol } = firstTransfer;

  if (event === 'ALLOWANCE_APPROVED') {
    if (amount === '0') {
      return `${tokenSymbol} allowance revoked`;
    }
    return `${tokenSymbol} approved up to ${amount}`;
  }

  if (!partnerAddress) return notification.body;

  const isSent = event === 'BALANCES_SPENT' || event === 'BALANCES_TRANSFERRED';
  const prefix = isSent ? 'to' : 'from';
  return `${prefix} ${partnerAddress}`;
};

export const BalanceChangeItem: FC<BalanceChangeItemProps> = ({
  notification,
  showSeparator,
  accessoryType,
  onClick,
}) => {
  return (
    <NotificationListItem
      title={getTitle(notification)}
      subtitle={getSubtitle(notification)}
      icon={<NotificationIcon notification={notification} />}
      timestamp={notification.timestamp}
      showSeparator={showSeparator}
      accessoryType={accessoryType}
      onClick={onClick}
    />
  );
};
