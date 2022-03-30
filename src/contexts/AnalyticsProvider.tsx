import {
  initPosthog,
  initFeatureFlags,
  FeatureGates,
  useCapturePageview,
} from '@avalabs/posthog-sdk';
import { createContext, useContext, useEffect, useState } from 'react';
import { useSettingsContext } from './SettingsProvider';

const AnalyticsContext = createContext<{
  flags: Record<FeatureGates, boolean>;
}>({} as any);

const DefaultFeatureFlagConfig = {
  [FeatureGates.EVERYTHING]: true,
  [FeatureGates.BRIDGE]: true,
  [FeatureGates.BRIDGE]: true,
  [FeatureGates.EVENTS]: true,
  [FeatureGates.SEND]: true,
  [FeatureGates.SWAP]: true,
};

export function AnalyticsContextProvider({ children }: { children: any }) {
  const [flags, setFlags] = useState<Record<FeatureGates, boolean>>(
    DefaultFeatureFlagConfig
  );
  const [posthogInstance, setPosthogInstance] = useState<any>();
  const { analyticsConsent } = useSettingsContext();

  useEffect(() => {
    const hog = initPosthog(
      process.env.POSTHOG_KEY ?? '',
      {
        // track only if consent is given
        opt_out_capturing_by_default: !analyticsConsent,
        api_host: 'https://data-posthog.avax.network',
      },
      'browser-extension-posthog'
    );
    setPosthogInstance(hog);
  }, [analyticsConsent]);

  useEffect(() => {
    if (posthogInstance) {
      const { listen } = initFeatureFlags(posthogInstance) as any;
      listen.add((flags: any) => {
        setFlags(flags);
      });
    }
  }, [posthogInstance]);

  useCapturePageview();

  return (
    <AnalyticsContext.Provider
      value={{
        flags,
      }}
    >
      {children}
    </AnalyticsContext.Provider>
  );
}

export function useAnalyticsContext() {
  return useContext(AnalyticsContext);
}
