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

type CaptureFn = (
  eventName: string,
  properties?: Record<string, any>,
  forceRequestAttempt?: boolean,
  useEncryption?: boolean
) => Promise<void>;

const AnalyticsContext = createContext<{
  initAnalyticsIds: (storeInStorage: boolean) => Promise<void>;
  stopDataCollection: () => Promise<void>;
  capture: CaptureFn;
  captureEncrypted: CaptureFn;
}>({} as any);

const windowId = crypto.randomUUID();

export function AnalyticsContextProvider({ children }: { children: any }) {
  const { request, events } = useConnectionContext();
  const { analyticsConsent } = useSettingsContext();

  const capture: CaptureFn = useCallback(
    async (
      eventName: string,
      properties?: Record<string, any>,
      /**
       * Sends the request regardless of the analyticsConsent state's value
       * The service will still validate if the setting is properly enabled
       * Useful when you don't want to / can't wait for the changes to be reflected in the state (e.g: when disabling analytics)
       */
      forceRequestAttempt?: boolean,
      useEncryption = false
    ) => {
      if (!analyticsConsent && !forceRequestAttempt) {
        return;
      }

      try {
        await request<CaptureAnalyticsEventHandler>({
          method: ExtensionRequest.ANALYTICS_CAPTURE_EVENT,
          params: [
            {
              name: eventName,
              windowId,
              properties: { ...properties },
            },
            useEncryption,
          ],
        });
      } catch (err) {
        console.error(err);
      }
    },
    [analyticsConsent, request]
  );

  /** Same as capture(), but always sets useEncryption param to true */
  const captureEncrypted: CaptureFn = useCallback(
    async (eventName, properties, forceRequestAttempt) =>
      capture(eventName, properties, forceRequestAttempt, true),
    [capture]
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

  const stopDataCollection = useCallback(async () => {
    await request<ClearAnalyticsIdsHandler>({
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
        captureEncrypted,
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
