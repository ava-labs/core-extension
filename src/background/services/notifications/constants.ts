import {
  NotificationCategories,
  NotificationsState,
  NotificationTypes,
} from './models';

export const STORAGE_KEY = 'NOTIFICATIONS';

export const DEFAULT_STATE: NotificationsState = {
  clientId: undefined,
  subscriptions: {
    [NotificationTypes.BALANCE_CHANGES]: true,
    [NotificationTypes.PRICE_ALERTS]: true,
  },
};

export const NOTIFICATION_CATEGORIES: Record<
  NotificationCategories,
  NotificationTypes[]
> = {
  [NotificationCategories.BALANCE_CHANGES]: [NotificationTypes.BALANCE_CHANGES],
  [NotificationCategories.NEWS]: [NotificationTypes.PRICE_ALERTS],
};
