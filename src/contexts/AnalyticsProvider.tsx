import { FeatureGates, useCapturePageview } from '@avalabs/posthog-sdk';
import { ExtensionRequest } from '@src/background/connections/extensionConnection/models';
import { CaptureAnalyticsEventHandler } from '@src/background/services/analytics/handlers/captureAnalyticsEvent';
import { ClearAnalyticsIdsHandler } from '@src/background/services/analytics/handlers/clearAnalyticsIds';
import { InitAnalyticsIdsHandler } from '@src/background/services/analytics/handlers/initAnalyticsIds';
import { createContext, useContext } from 'react';
import { useConnectionContext } from './ConnectionProvider';
import { useFeatureFlagContext } from './FeatureFlagsProvider';
import { useSettingsContext } from './SettingsProvider';

const AnalyticsContext = createContext<{
  initAnalyticsIds: (storeInStorage: boolean) => Promise<void>;
  stopDataCollection: () => void;
  capture: (eventName: string, properties?: Record<string, any>) => void;
}>({} as any);

const windowId = crypto.randomUUID();

export function AnalyticsContextProvider({ children }: { children: any }) {
  const { request } = useConnectionContext();
  const { analyticsConsent } = useSettingsContext();
  const { featureFlags } = useFeatureFlagContext();

  const captureEvent = (
    eventName: string,
    properties?: Record<string, any>
  ) => {
    if (!analyticsConsent || !featureFlags[FeatureGates.EVENTS]) {
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
  };

  const initAnalyticsIds = async (storeInStorage: boolean): Promise<void> => {
    await request<InitAnalyticsIdsHandler>({
      method: ExtensionRequest.ANALYTICS_INIT_IDS,
      params: [storeInStorage],
    });
  };

  const stopDataCollection = () => {
    request<ClearAnalyticsIdsHandler>({
      method: ExtensionRequest.ANALYTICS_CLEAR_IDS,
    });
  };

  useCapturePageview();

  return (
    <AnalyticsContext.Provider
      value={{
        capture: captureEvent,
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
