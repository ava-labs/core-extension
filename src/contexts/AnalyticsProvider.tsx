import { ExtensionRequest } from '@src/background/connections/extensionConnection/models';
import { analyticsStateUpdatedEventListener } from '@src/background/services/analytics/events/listeners';
import { CaptureAnalyticsEventHandler } from '@src/background/services/analytics/handlers/captureAnalyticsEvent';
import { ClearAnalyticsIdsHandler } from '@src/background/services/analytics/handlers/clearAnalyticsIds';
import { GetAnalyticsIdsHandler } from '@src/background/services/analytics/handlers/getAnalyticsIds';
import { InitAnalyticsIdsHandler } from '@src/background/services/analytics/handlers/initAnalyticsIds';
import { createContext, useCallback, useContext, useEffect } from 'react';
import { filter, first, from, merge } from 'rxjs';
import { useConnectionContext } from './ConnectionProvider';
import { useSettingsContext } from './SettingsProvider';

const AnalyticsContext = createContext<{
  initAnalyticsIds: (storeInStorage: boolean) => Promise<void>;
  stopDataCollection: () => void;
  capture: (eventName: string, properties?: Record<string, any>) => void;
}>({} as any);

const windowId = crypto.randomUUID();

export function AnalyticsContextProvider({ children }: { children: any }) {
  const { request, events } = useConnectionContext();
  const { analyticsConsent } = useSettingsContext();

  const capture = useCallback(
    (eventName: string, properties?: Record<string, any>) => {
      if (!analyticsConsent) {
        return;
      }

      request<CaptureAnalyticsEventHandler>({
        method: ExtensionRequest.ANALYTICS_CAPTURE_EVENT,
        params: [
          {
            name: eventName,
            windowId,
            properties: { ...properties },
          },
        ],
      });
    },
    [analyticsConsent, request]
  );

  const initAnalyticsIds = useCallback(
    async (storeInStorage: boolean): Promise<void> => {
      await request<InitAnalyticsIdsHandler>({
        method: ExtensionRequest.ANALYTICS_INIT_IDS,
        params: [storeInStorage],
      });
    },
    [request]
  );

  const stopDataCollection = useCallback(() => {
    request<ClearAnalyticsIdsHandler>({
      method: ExtensionRequest.ANALYTICS_CLEAR_IDS,
    });
  }, [request]);

  useEffect(() => {
    const subscription = merge(
      from(
        request<GetAnalyticsIdsHandler>({
          method: ExtensionRequest.ANALYTICS_GET_IDS,
        })
      ).pipe(filter((ids) => !!ids)),
      events().pipe(filter(analyticsStateUpdatedEventListener))
    )
      .pipe(first())
      .subscribe(() => {
        capture('WindowOpened', {
          path: window.location.pathname,
        });
      });

    return () => {
      subscription.unsubscribe();
    };
  }, [capture, events, request]);

  return (
    <AnalyticsContext.Provider
      value={{
        capture,
        initAnalyticsIds,
        stopDataCollection,
      }}
    >
      {children}
    </AnalyticsContext.Provider>
  );
}

export function useAnalyticsContext() {
  return useContext(AnalyticsContext);
}
