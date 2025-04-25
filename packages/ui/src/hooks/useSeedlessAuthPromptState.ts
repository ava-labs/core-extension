import { Subscription, filter } from 'rxjs';
import { useEffect, useState } from 'react';

import { useConnectionContext } from '@/contexts/ConnectionProvider';
import { ExtensionRequest } from '@core/service-worker';
import { isSeedlessTokenEvent } from '@core/service-worker';
import { SeedlessEvents } from '@core/service-worker';
import { HasSignerTokenExpiredHandler } from '@core/service-worker';
import { useLocation } from 'react-router-dom';

export const useSeedlessAuthPromptState = () => {
  const { events, request } = useConnectionContext();
  const location = useLocation();
  const [isAuthPromptVisible, setIsAuthPromptVisible] = useState(false);

  const isAuthPopupPage = location.pathname.includes('seedless');

  useEffect(() => {
    // Deactivate state querying on in the auth popup itself
    if (isAuthPopupPage) {
      return;
    }

    let eventsSubscription: Subscription;

    request<HasSignerTokenExpiredHandler>({
      method: ExtensionRequest.SEEDLESS_HAS_TOKEN_EXPIRED,
    })
      .then((hasExpired) => {
        // This state is not known right after extension is unlocked,
        // so we only want to toggle the prompt on/off when we actually
        // know if we should.
        if (typeof hasExpired === 'boolean') {
          setIsAuthPromptVisible(hasExpired);
        }
      })
      .finally(() => {
        eventsSubscription = events()
          .pipe(filter(isSeedlessTokenEvent))
          .subscribe(async (event) => {
            if (event.name === SeedlessEvents.TokenExpired) {
              setIsAuthPromptVisible(true);
            } else if (event.name === SeedlessEvents.TokenRefreshed) {
              setIsAuthPromptVisible(false);
            }
          });
      });

    return () => {
      eventsSubscription?.unsubscribe();
    };
  }, [events, request, isAuthPopupPage]);

  return {
    isAuthPromptVisible,
  };
};
