import { FeatureGates } from '@avalabs/posthog-sdk';
import { DEFAULT_FLAGS } from '@src/background/services/featureFlags/models';
import { createContext, useContext, useEffect, useState } from 'react';
import { filter, map } from 'rxjs';
import { useConnectionContext } from './ConnectionProvider';
import { featureFlagsUpdatedEventListener } from '@src/background/services/featureFlags/events/featureFlagsUpdatedEventListener';

const FeatureFlagsContext = createContext<{
  featureFlags: Record<FeatureGates, boolean>;
}>({} as any);

export function FeatureFlagsContextProvider({ children }: { children: any }) {
  const { events } = useConnectionContext();
  const [featureFlags, setFeatureFlags] =
    useState<Record<FeatureGates, boolean>>(DEFAULT_FLAGS);

  useEffect(() => {
    const subscription = events()
      .pipe(
        filter(featureFlagsUpdatedEventListener),
        map((evt) => evt.value)
      )
      .subscribe((result) => {
        setFeatureFlags(result);
      });
    return () => {
      subscription.unsubscribe();
    };
  }, [events]);

  return (
    <FeatureFlagsContext.Provider
      value={{
        featureFlags,
      }}
    >
      {children}
    </FeatureFlagsContext.Provider>
  );
}

export function useFeatureFlagContext() {
  return useContext(FeatureFlagsContext);
}
