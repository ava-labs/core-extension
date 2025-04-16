import Joi from 'joi';
import {
  BalanceNotificationTypes,
  NewsNotificationTypes,
  NotificationCategories,
  NotificationPayload,
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
    isSubscribed: false,
    addresses: [],
    chainIds: [],
  };

export const NOTIFICATIONS_NEWS_SUBSCRIPTION_DEFAULT_STATE: NotificationsNewsSubscriptionStorage =
  {
    [NewsNotificationTypes.PRICE_ALERTS]: false,
    [NewsNotificationTypes.PRODUCT_ANNOUNCEMENTS]: false,
    [NewsNotificationTypes.OFFERS_AND_PROMOTIONS]: false,
    [NewsNotificationTypes.MARKET_NEWS]: false,
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

export const NOTIFICATION_PAYLOAD_SCHEMA = Joi.object<
  NotificationPayload,
  true
>({
  data: Joi.object({
    title: Joi.string().required(),
    body: Joi.string().required(),
    event: Joi.string().required(),
    type: Joi.string().required(),
  })
    .required()
    .unknown(true),
})
  .required()
  .unknown(true);
