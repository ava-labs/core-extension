import { AppNotification, isPriceAlertNotification } from '@core/types';

export const isPriceAlertWithData = (
  notification: AppNotification,
): boolean => {
  if (!isPriceAlertNotification(notification)) return false;
  return notification.data?.priceChangePercent !== undefined;
};
