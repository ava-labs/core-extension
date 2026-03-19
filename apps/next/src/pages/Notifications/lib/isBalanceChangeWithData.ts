import {
  AppNotification,
  BalanceChangesMetadata,
  isBalanceChangeNotification,
} from '@core/types';

export const isBalanceChangeWithData = (
  notification: AppNotification,
): notification is Omit<
  Extract<AppNotification, { type: 'BALANCE_CHANGES' }>,
  'data'
> & {
  data: BalanceChangesMetadata;
} => {
  if (!isBalanceChangeNotification(notification)) return false;
  const { transfers } = notification.data ?? {};
  return transfers !== undefined && transfers.length > 0;
};
