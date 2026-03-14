import { FC } from 'react';
import { AppNotification } from '@core/types';
import { isPriceAlertWithData } from '../lib/isPriceAlertWithData';
import { isBalanceChangeWithData } from '../lib/isBalanceChangeWithData';
import { PriceAlertItem } from './PriceAlertItem';
import { BalanceChangeItem } from './BalanceChangeItem';
import { GenericNotificationItem } from './GenericNotificationItem';

type NotificationItemProps = {
  notification: AppNotification;
  showSeparator: boolean;
  accessoryType: 'chevron' | 'none';
  onClick?: () => void;
};

export const NotificationItem: FC<NotificationItemProps> = ({
  notification,
  ...props
}) => {
  if (isPriceAlertWithData(notification)) {
    return <PriceAlertItem notification={notification} {...props} />;
  }

  if (isBalanceChangeWithData(notification)) {
    return <BalanceChangeItem notification={notification} {...props} />;
  }

  return <GenericNotificationItem notification={notification} {...props} />;
};
