import { AppNotification, isBalanceChangeNotification } from '@core/types';

export const isBalanceChangeWithData = (
  notification: AppNotification,
): boolean => {
  if (!isBalanceChangeNotification(notification)) return false;
  const { transfers } = notification.data ?? {};
  return transfers !== undefined && transfers.length > 0;
};
