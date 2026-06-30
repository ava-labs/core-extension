export enum NotificationCategories {
  BALANCE_CHANGES = 'BALANCE_CHANGES',
  NEWS = 'NEWS',
}

export enum BalanceNotificationTypes {
  BALANCE_CHANGES = 'BALANCE_CHANGES',
}

export enum NewsNotificationTypes {
  PRODUCT_ANNOUNCEMENTS = 'PRODUCT_ANNOUNCEMENTS',
  OFFERS_AND_PROMOTIONS = 'OFFERS_AND_PROMOTIONS',
  MARKET_NEWS = 'MARKET_NEWS',
  PRICE_ALERTS = 'PRICE_ALERTS',
}

export enum SubscriptionEvents {
  SUBSCRIPTIONS_CHANGED_EVENT = 'SUBSCRIPTIONS_CHANGED_EVENT',
}

/** FCM `data.type` and notification-center `type` for recurring (DCA) swaps. */
export const RECURRING_SWAP_NOTIFICATION_TYPE = 'RECURRING_SWAP';

export type NotificationTypes =
  | BalanceNotificationTypes
  | NewsNotificationTypes;

export enum NotificationsEvents {
  /**
   * Extension UI port + Web3 `notificationCenterChanged` for Core Web when notification center should refetch.
   */
  NOTIFICATION_CENTER_CHANGED_EVENT = 'NOTIFICATION_CENTER_CHANGED_EVENT',
}

export type NotificationsClientIdStorage = {
  clientId?: string;
};

export type NotificationsBalanceChangesSubscriptionStorage = {
  isSubscribed: boolean;
  addresses: string[];
  chainIds: string[];
};

export type NotificationsNewsSubscriptionStorage = Record<
  NewsNotificationTypes,
  boolean
>;

export type NotificationsRecurringSwapSubscriptionStorage = {
  orderIds: string[];
};

export type NotificationsRecurringSwapDiscoveryStorage = {
  /** Epoch ms until which the SW keeps polling Markr for new orders. */
  watchUntil: number;
};

export type NotificationPayload = {
  data: {
    title: string;
    body: string;
    event: NotificationTypes;
    type: NotificationCategories;
  };
};

export type RegisterDeviceResponse = {
  deviceArn: string;
};
