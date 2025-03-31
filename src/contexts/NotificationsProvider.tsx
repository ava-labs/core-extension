import { ExtensionRequest } from '@src/background/connections/extensionConnection/models';
import { SubscribeToBalanceNotifications } from '@src/background/services/notifications/notifications/balance/handlers/subscribeToBalanceNotifications';
import { UnsubscribeFromBalanceNotifications } from '@src/background/services/notifications/notifications/balance/handlers/unsubscribeFromBalanceNotifications';
import { createContext, useCallback, useContext, useState } from 'react';
import { useConnectionContext } from './ConnectionProvider';

const NotificationsContext = createContext<{
  isSubscribedToBalanceChanges: boolean;
  subscribeToBalanceChanges(): Promise<void>;
  unsubscribeFromBalanceChanges(): Promise<void>;
}>({
  isSubscribedToBalanceChanges: true,
  async subscribeToBalanceChanges() {},
  async unsubscribeFromBalanceChanges() {},
});

export function NotificationsContextProvider({ children }: { children: any }) {
  const { request } = useConnectionContext();

  // TODO: handle multiple notification types here
  // TODO: get subscription status from storage
  const [isSubscribedToBalanceChanges, setIsSubscribedToBalanceChanges] =
    useState(true);

  const subscribeToBalanceChanges = useCallback(async () => {
    if (isSubscribedToBalanceChanges) {
      return;
    }

    const result = await request<SubscribeToBalanceNotifications>({
      method: ExtensionRequest.BALANCE_NOTIFICATION_SUBSCRIBE,
      params: [],
    });

    if (result === true) {
      setIsSubscribedToBalanceChanges(true);
    }
  }, [isSubscribedToBalanceChanges, request]);

  const unsubscribeFromBalanceChanges = useCallback(async () => {
    if (!isSubscribedToBalanceChanges) {
      return;
    }

    const result = await request<UnsubscribeFromBalanceNotifications>({
      method: ExtensionRequest.BALANCE_NOTIFICATION_UNSUBSCRIBE,
      params: [],
    });

    if (result === true) {
      setIsSubscribedToBalanceChanges(false);
    }
  }, [isSubscribedToBalanceChanges, request]);

  return (
    <NotificationsContext.Provider
      value={{
        isSubscribedToBalanceChanges,
        subscribeToBalanceChanges,
        unsubscribeFromBalanceChanges,
      }}
    >
      {children}
    </NotificationsContext.Provider>
  );
}

export function useNotificationsContext() {
  return useContext(NotificationsContext);
}
