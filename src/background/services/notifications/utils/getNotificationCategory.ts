import { NOTIFICATION_CATEGORIES } from '../constants';
import { NotificationCategories, NotificationTypes } from '../models';

export const getNotificationCategory = (
  notificationType: NotificationTypes,
) => {
  const [category] =
    Object.entries(NOTIFICATION_CATEGORIES).find(([_, events]) =>
      events.includes(notificationType),
    ) ?? [];

  if (!category) {
    throw new Error(`Unknown notification type: ${notificationType}`);
  }

  return category as NotificationCategories;
};
