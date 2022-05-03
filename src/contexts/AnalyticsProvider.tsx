import {
  initPosthog,
  initFeatureFlags,
  FeatureGates,
  useCapturePageview,
} from '@avalabs/posthog-sdk';
import { ExtensionRequest } from '@src/background/connections/extensionConnection/models';
import { analyticsStateUpdatedEventListener } from '@src/background/services/analytics/events/listeners';
import { AnalyticsState } from '@src/background/services/analytics/models';
import { createContext, useContext, useEffect, useState } from 'react';
import { filter, map } from 'rxjs';
import { useConnectionContext } from './ConnectionProvider';
import { useSettingsContext } from './SettingsProvider';

const AnalyticsContext = createContext<{
  flags: Record<FeatureGates, boolean>;
  initAnalyticsIds: (storeInStorage: boolean) => Promise<void>;
  stopDataCollection: () => void;
  capture: (eventName: string, properties?: Record<string, any>) => void;
}>({} as any);

const DefaultFeatureFlagConfig = {
  [FeatureGates.EVERYTHING]: true,
  [FeatureGates.BRIDGE]: true,
  [FeatureGates.BRIDGE_BTC]: true,
  [FeatureGates.BRIDGE_ETH]: true,
  [FeatureGates.EVENTS]: true,
  [FeatureGates.SEND]: true,
  [FeatureGates.SWAP]: true,
};

export function AnalyticsContextProvider({ children }: { children: any }) {
  const [posthogInstance, setPosthogInstance] = useState<any>();

  const { request, events } = useConnectionContext();
  const [flags, setFlags] = useState<Record<FeatureGates, boolean>>(
    DefaultFeatureFlagConfig
  );
  const { analyticsConsent } = useSettingsContext();
  const [analyticsState, setAnalyticsState] = useState<AnalyticsState>();

  useEffect(() => {
    request({
      method: ExtensionRequest.ANALYTICS_GET_IDS,
    }).then((state) => {
      if (state) {
        setAnalyticsState(state);
      }
    });

    const subscription = events()
      .pipe(
        filter(analyticsStateUpdatedEventListener),
        map((evt) => evt.value)
      )
      .subscribe((val) => setAnalyticsState(val));

    return () => subscription.unsubscribe();
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
        api_host: 'https://data-posthog.avax.network',
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
          // we need to use feature flags even if we opt out analytics
          const { listen } = initFeatureFlags(hog);
          listen.add((flags: any) => {
            setFlags(flags);
          });
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
    if (!analyticsConsent || !flags[FeatureGates.EVENTS] || !posthogInstance) {
      return;
    }

    posthogInstance.capture(eventName, properties);
  };

  const initAnalyticsIds = (storeInStorage: boolean) => {
    return request({
      method: ExtensionRequest.ANALYTICS_INIT_IDS,
      params: [storeInStorage],
    });
  };

  const stopDataCollection = () => {
    if (posthogInstance) {
      posthogInstance.opt_out_capturing();
      posthogInstance.reset();
    }
    request({
      method: ExtensionRequest.ANALYTICS_CLEAR_IDS,
      params: [],
    });
  };

  useCapturePageview();

  return (
    <AnalyticsContext.Provider
      value={{
        flags,
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
