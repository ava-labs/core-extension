import { useCallback, useState } from 'react';
import { filter } from 'rxjs';

import { useConnectionContext } from '@src/contexts/ConnectionProvider';
import {
  isSessionPermissionsMismatchEvent,
  isUriGeneratedEvent,
  isWalletConnectEvent,
} from '@src/background/services/walletConnect/events/eventFilters';
import type { EstablishRequiredSession } from '@src/background/services/walletConnect/handlers/establishRequiredSession';
import { ExtensionRequest } from '@src/background/connections/extensionConnection/models';
import type {
  WalletConnectEventType,
  WalletConnectSessionInfo,
} from '@src/background/services/walletConnect/models';

export const useRequiredSession = () => {
  const { tabId, events, request } = useConnectionContext();

  const [isValidSession, setIsValidSession] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [activeSession, setActiveSession] =
    useState<WalletConnectSessionInfo | null>(null);
  const [isNewConnectionRequired, setIsNewConnectionRequired] = useState(false);

  const establishRequiredSession = useCallback(
    async (address: string, chainId: number) => {
      setIsNewConnectionRequired(false);
      setIsLoading(true);

      const sessionSubscription = events<WalletConnectEventType>()
        .pipe(filter(isWalletConnectEvent))
        .subscribe(async (event) => {
          if (event.value.tabId !== tabId) {
            return;
          }

          // If any of the events came already, loading state is over.
          setIsLoading(false);

          // If a QR code came, we know we need to establish a new connection.
          if (isUriGeneratedEvent(event)) {
            setIsNewConnectionRequired(true);
          }

          // If we have a session to the device, but it does not permit us to
          // send the request we need, we'll notify the user.
          if (isSessionPermissionsMismatchEvent(event)) {
            setActiveSession(event.value.activeSession);
            setIsValidSession(false);
          }
        });

      request<EstablishRequiredSession>({
        method: ExtensionRequest.WALLET_CONNECT_ESTABLISH_REQUIRED_SESSION,
        params: [address, chainId],
      })
        .then((session) => {
          setActiveSession(session);
          setIsValidSession(true);
        })
        .catch(() => {
          // This will be most likely triggered by the user rejecting our request
          // to switch the network automatically. If that happens, we'll fallback
          // to establishing a brand new connection.
          setActiveSession(null);
          setIsValidSession(false);
          setIsNewConnectionRequired(true);
        })
        .finally(() => {
          sessionSubscription.unsubscribe();
        });
    },
    [events, tabId, request],
  );

  return {
    isLoading,
    isValidSession,
    isNewConnectionRequired,
    establishRequiredSession,
    activeSession,
  };
};
