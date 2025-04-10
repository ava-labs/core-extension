import { ExtensionRequest } from '@src/background/connections/extensionConnection/models';
import {
  createContext,
  useCallback,
  useContext,
  useEffect,
  useState,
} from 'react';
import { useConnectionContext } from './ConnectionProvider';
import {
  BalanceNotificationTypes,
  NewsNotificationTypes,
  NotificationTypes,
} from '@src/background/services/notifications/models';
import { SubscribeToNotification } from '@src/background/services/notifications/handlers/subscribe';
import { GetNotificationSubscriptions } from '@src/background/services/notifications/handlers/getSubscriptions';
import { UnsubscribeFromNotification } from '@src/background/services/notifications/handlers/unsubscribe';

const NotificationsContext = createContext<{
  subscriptions: Record<NotificationTypes, boolean>;
  subscribe(notificationType: NotificationTypes): Promise<void>;
  unsubscribe(notificationType: NotificationTypes): Promise<void>;
}>({
  subscriptions: {
    [BalanceNotificationTypes.BALANCE_CHANGES]: true,
    [NewsNotificationTypes.PRICE_ALERTS]: true,
  },
  async subscribe() {},
  async unsubscribe() {},
});

export function NotificationsContextProvider({ children }: { children: any }) {
  const { request } = useConnectionContext();

  const [subscriptions, setSubscriptions] = useState<
    Record<NotificationTypes, boolean>
  >({
    [BalanceNotificationTypes.BALANCE_CHANGES]: true,
    [NewsNotificationTypes.PRICE_ALERTS]: true,
  });

  const syncSubscriptions = useCallback(async () => {
    const result = await request<GetNotificationSubscriptions>({
      method: ExtensionRequest.NOTIFICATION_GET_SUBSCRIPTIONS,
      params: [],
    });

    setSubscriptions(result);
  }, [request]);

  const subscribe = useCallback(
    async (notificationType: NotificationTypes) => {
      await request<SubscribeToNotification>({
        method: ExtensionRequest.NOTIFICATION_SUBSCRIBE,
        params: notificationType,
      }).finally(() => syncSubscriptions());
    },
    [request, syncSubscriptions],
  );

  const unsubscribe = useCallback(
    async (notificationType: NotificationTypes) => {
      await request<UnsubscribeFromNotification>({
        method: ExtensionRequest.NOTIFICATION_UNSUBSCRIBE,
        params: notificationType,
      }).finally(() => syncSubscriptions());
    },
    [request, syncSubscriptions],
  );

  useEffect(() => {
    syncSubscriptions();
  }, [syncSubscriptions]);

  return (
    <NotificationsContext.Provider
      value={{
        subscriptions,
        subscribe,
        unsubscribe,
      }}
    >
      {children}
    </NotificationsContext.Provider>
  );
}

export function useNotificationsContext() {
  return useContext(NotificationsContext);
}
