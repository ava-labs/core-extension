import { FC } from 'react';
import { isPriceAlertWithData } from '../lib/isPriceAlertWithData';
import { isBalanceChangeWithData } from '../lib/isBalanceChangeWithData';
import { PriceAlertItem } from './PriceAlertItem';
import { BalanceChangeItem } from './BalanceChangeItem';
import { GenericNotificationItem } from './GenericNotificationItem';
import { TransferItem } from './TransferItem';
import { CombinedActivityItem } from '../types';
import { LegacyTransferItem } from './LegacyTransferItem';

type NotificationItemProps = {
  showSeparator: boolean;
  item: CombinedActivityItem;
};

export const NotificationItem: FC<NotificationItemProps> = ({
  item,
  showSeparator,
}: NotificationItemProps) => {
  if (item.type === 'transfer') {
    return <TransferItem transfer={item.item} showSeparator={showSeparator} />;
  }

  if (item.type === 'legacy-transfer') {
    return (
      <LegacyTransferItem transfer={item.item} showSeparator={showSeparator} />
    );
  }

  if (isPriceAlertWithData(item.item)) {
    return (
      <PriceAlertItem notification={item.item} showSeparator={showSeparator} />
    );
  }

  if (isBalanceChangeWithData(item.item)) {
    return (
      <BalanceChangeItem
        notification={item.item}
        showSeparator={showSeparator}
      />
    );
  }

  return (
    <GenericNotificationItem
      notification={item.item}
      showSeparator={showSeparator}
    />
  );
};
