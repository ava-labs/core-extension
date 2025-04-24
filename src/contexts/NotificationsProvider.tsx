import { ExtensionRequest } from '@src/background/connections/extensionConnection/models';
import {
  createContext,
  useCallback,
  useContext,
  useEffect,
  useState,
} from 'react';
import { filter } from 'rxjs';
import { useConnectionContext } from './ConnectionProvider';
import {
  BalanceNotificationTypes,
  NewsNotificationTypes,
  NotificationTypes,
} from '@src/background/services/notifications/models';
import { SubscribeToNotification } from '@src/background/services/notifications/handlers/subscribe';
import { GetNotificationSubscriptions } from '@src/background/services/notifications/handlers/getSubscriptions';
import { UnsubscribeFromNotification } from '@src/background/services/notifications/handlers/unsubscribe';
import { subscriptionsChangedEventListener } from '@src/background/services/notifications/events/subscriptionsChangedEventListener';
import sentryCaptureException, {
  SentryExceptionTypes,
} from '@src/monitoring/sentryCaptureException';

const NotificationsContext = createContext<{
  subscriptions: Record<NotificationTypes, boolean>;
  syncSubscriptions(): Promise<void>;
  subscribe(notificationType: NotificationTypes): Promise<void>;
  unsubscribe(notificationType: NotificationTypes): Promise<void>;
}>({
  subscriptions: {
    [BalanceNotificationTypes.BALANCE_CHANGES]: false,
    [NewsNotificationTypes.PRODUCT_ANNOUNCEMENTS]: false,
    [NewsNotificationTypes.OFFERS_AND_PROMOTIONS]: false,
    [NewsNotificationTypes.MARKET_NEWS]: false,
    [NewsNotificationTypes.PRICE_ALERTS]: false,
  },
  async syncSubscriptions() {},
  async subscribe() {},
  async unsubscribe() {},
});

export function NotificationsContextProvider({ children }: { children: any }) {
  const { request, events } = useConnectionContext();
  const [subscriptions, setSubscriptions] = useState<
    Record<NotificationTypes, boolean>
  >({
    [BalanceNotificationTypes.BALANCE_CHANGES]: true,
    [NewsNotificationTypes.PRODUCT_ANNOUNCEMENTS]: true,
    [NewsNotificationTypes.OFFERS_AND_PROMOTIONS]: true,
    [NewsNotificationTypes.MARKET_NEWS]: true,
    [NewsNotificationTypes.PRICE_ALERTS]: true,
  });

  const syncSubscriptions = useCallback(async () => {
    try {
      const result = await request<GetNotificationSubscriptions>({
        method: ExtensionRequest.NOTIFICATION_GET_SUBSCRIPTIONS,
        params: [],
      });

      setSubscriptions(result);
    } catch (err) {
      sentryCaptureException(err as Error, SentryExceptionTypes.NOTIFICATIONS);
    }
  }, [request]);

  const subscribe = useCallback(
    async (notificationType: NotificationTypes) => {
      await request<SubscribeToNotification>({
        method: ExtensionRequest.NOTIFICATION_SUBSCRIBE,
        params: notificationType,
      })
        .catch((err) => {
          sentryCaptureException(err, SentryExceptionTypes.NOTIFICATIONS);
        })
        .finally(() => syncSubscriptions());
    },
    [request, syncSubscriptions],
  );

  const unsubscribe = useCallback(
    async (notificationType: NotificationTypes) => {
      await request<UnsubscribeFromNotification>({
        method: ExtensionRequest.NOTIFICATION_UNSUBSCRIBE,
        params: notificationType,
      })
        .catch((err) => {
          sentryCaptureException(err, SentryExceptionTypes.NOTIFICATIONS);
        })
        .finally(() => syncSubscriptions());
    },
    [request, syncSubscriptions],
  );

  useEffect(() => {
    syncSubscriptions();
  }, [syncSubscriptions]);

  useEffect(() => {
    const notificationChangesSubscription = events()
      .pipe(filter(subscriptionsChangedEventListener))
      .subscribe(() => {
        syncSubscriptions();
      });

    return () => {
      notificationChangesSubscription.unsubscribe();
    };
  }, [events, syncSubscriptions]);

  return (
    <NotificationsContext.Provider
      value={{
        subscriptions,
        syncSubscriptions,
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
