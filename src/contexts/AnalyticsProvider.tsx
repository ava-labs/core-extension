import {
  initPosthog,
  FeatureGates,
  useCapturePageview,
} from '@avalabs/posthog-sdk';
import { ExtensionRequest } from '@src/background/connections/extensionConnection/models';
import { analyticsStateUpdatedEventListener } from '@src/background/services/analytics/events/listeners';
import { ClearAnalyticsIdsHandler } from '@src/background/services/analytics/handlers/clearAnalyticsIds';
import { GetAnalyticsIdsHandler } from '@src/background/services/analytics/handlers/getAnalyticsIds';
import { InitAnalyticsIdsHandler } from '@src/background/services/analytics/handlers/initAnalyticsIds';
import { AnalyticsState } from '@src/background/services/analytics/models';
import { createContext, useContext, useEffect, useState } from 'react';
import { filter, map } from 'rxjs';
import { useConnectionContext } from './ConnectionProvider';
import { useFeatureFlagContext } from './FeatureFlagsProvider';
import { useSettingsContext } from './SettingsProvider';

const AnalyticsContext = createContext<{
  initAnalyticsIds: (storeInStorage: boolean) => Promise<void>;
  stopDataCollection: () => void;
  capture: (eventName: string, properties?: Record<string, any>) => void;
}>({} as any);

export function AnalyticsContextProvider({ children }: { children: any }) {
  const [posthogInstance, setPosthogInstance] = useState<any>();
  const { request, events } = useConnectionContext();
  const { featureFlags } = useFeatureFlagContext();
  const { analyticsConsent } = useSettingsContext();
  const [analyticsState, setAnalyticsState] = useState<AnalyticsState>();

  useEffect(() => {
    let isCancelled = false;
    request<GetAnalyticsIdsHandler>({
      method: ExtensionRequest.ANALYTICS_GET_IDS,
    }).then((state) => {
      if (state && !isCancelled) {
        setAnalyticsState(state);
      }
    });

    const subscription = events()
      .pipe(
        filter(analyticsStateUpdatedEventListener),
        map((evt) => evt.value)
      )
      .subscribe((val) => setAnalyticsState(val));

    return () => {
      subscription.unsubscribe();
      isCancelled = true;
    };
  }, [events, request]);

  useEffect(() => {
    if (
      posthogInstance ||
      // wait for consent state
      analyticsConsent === undefined ||
      // Analytics state is empty when there is no consent.
      // When users opt out we delete all of the tracking IDs
      (!analyticsState && analyticsConsent === true)
    ) {
      return;
    }
    initPosthog(
      process.env.POSTHOG_KEY ?? '',
      {
        opt_out_capturing_by_default: false,
        api_host:
          process.env.POSTHOG_URL || 'https://data-posthog.avax-test.network',
        ip: false,
        disable_persistence: true,
        disable_cookie: true,
        loaded: (hog) => {
          if (analyticsConsent === true && analyticsState) {
            // register_once does not work for $device_id
            hog.register({
              $ip: '',
              $device_id: analyticsState.deviceId,
            });
            hog.identify(analyticsState.userId);
          } else {
            hog.opt_out_capturing();
          }
          setPosthogInstance(hog);
        },
      },
      'browser-extension-posthog'
    );
  }, [analyticsConsent, analyticsState, posthogInstance]);

  useEffect(() => {
    if (!posthogInstance) {
      return;
    }
    if (analyticsConsent) {
      posthogInstance.opt_in_capturing();
    } else {
      posthogInstance.opt_out_capturing();
    }
  }, [analyticsConsent, posthogInstance]);

  const captureEvent = (
    eventName: string,
    properties?: Record<string, any>
  ) => {
    if (
      !analyticsConsent ||
      !featureFlags[FeatureGates.EVENTS] ||
      !posthogInstance
    ) {
      return;
    }

    posthogInstance.capture(eventName, properties);
  };

  const initAnalyticsIds = async (storeInStorage: boolean): Promise<void> => {
    await request<InitAnalyticsIdsHandler>({
      method: ExtensionRequest.ANALYTICS_INIT_IDS,
      params: [storeInStorage],
    });
  };

  const stopDataCollection = () => {
    if (posthogInstance) {
      posthogInstance.opt_out_capturing();
      posthogInstance.reset();
    }
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
