import {
  BalanceNotificationTypes,
  NewsNotificationTypes,
  NotificationCategories,
  NotificationsBalanceChangesSubscriptionStorage,
  NotificationsClientIdStorage,
  NotificationsNewsSubscriptionStorage,
  NotificationTypes,
} from './models';

export const NOTIFICATIONS_CLIENT_ID_STORAGE_KEY = 'NOTIFICATIONS_CLIENT_ID';
export const NOTIFICATIONS_BALANCE_CHANGES_SUBSCRIPTION_STORAGE_KEY =
  'NOTIFICATIONS_BALANCE_CHANGES_SUBSCRIPTION';
export const NOTIFICATIONS_NEWS_SUBSCRIPTION_STORAGE_KEY =
  'NOTIFICATIONS_NEWS_SUBSCRIPTION';

export const NOTIFICATIONS_CLIENT_ID_DEFAULT_STATE: NotificationsClientIdStorage =
  {
    clientId: undefined,
  };

export const NOTIFICATIONS_BALANCE_CHANGES_SUBSCRIPTION_DEFAULT_STATE: NotificationsBalanceChangesSubscriptionStorage =
  {
    isSubscribed: true,
    addresses: [],
    chainIds: [],
  };

export const NOTIFICATIONS_NEWS_SUBSCRIPTION_DEFAULT_STATE: NotificationsNewsSubscriptionStorage =
  {
    [NewsNotificationTypes.PRICE_ALERTS]: true,
  };

export const NOTIFICATION_CATEGORIES: Record<
  NotificationCategories,
  NotificationTypes[]
> = {
  [NotificationCategories.BALANCE_CHANGES]: Object.values(
    BalanceNotificationTypes,
  ),
  [NotificationCategories.NEWS]: Object.values(NewsNotificationTypes),
};
