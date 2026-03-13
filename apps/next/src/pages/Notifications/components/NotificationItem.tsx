import { FC } from 'react';
import { isPriceAlertWithData } from '../lib/isPriceAlertWithData';
import { isBalanceChangeWithData } from '../lib/isBalanceChangeWithData';
import { PriceAlertItem } from './PriceAlertItem';
import { BalanceChangeItem } from './BalanceChangeItem';
import { GenericNotificationItem } from './GenericNotificationItem';
import { TransferItem } from './TransferItem';
import { CombinedActivityItem } from '../types';

type NotificationItemProps = {
  showSeparator: boolean;
  accessoryType: 'chevron' | 'none';
  onClick?: () => void;
  item: CombinedActivityItem;
};

export const NotificationItem: FC<NotificationItemProps> = ({
  item,
  ...props
}: NotificationItemProps) => {
  if (item.type === 'transfer') {
    return <TransferItem transfer={item.item} {...props} />;
  }

  if (isPriceAlertWithData(item.item)) {
    return <PriceAlertItem notification={item.item} {...props} />;
  }

  if (isBalanceChangeWithData(item.item)) {
    return <BalanceChangeItem notification={item.item} {...props} />;
  }

  return <GenericNotificationItem notification={item.item} {...props} />;
};
