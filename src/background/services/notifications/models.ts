export enum NotificationCategories {
  BALANCE_CHANGES = 'BALANCE_CHANGES',
  NEWS = 'NEWS',
}

export enum NotificationTypes {
  BALANCE_CHANGES = 'BALANCE_CHANGES',
  PRICE_ALERTS = 'PRICE_ALERTS',
}

export type NotificationsState = {
  clientId?: string;
  subscriptions: Record<NotificationTypes, boolean>;
};

export enum NotificationsEvents {
  CLIENT_REGISTERED = 'CLIENT_REGISTERED',
}
