import { isEqual } from 'lodash';
import {
  DEFAULT_FLAGS,
  FeatureGates,
} from '@src/background/services/featureFlags/models';
import { createContext, useContext, useEffect, useState } from 'react';
import { filter, map } from 'rxjs';
import { useConnectionContext } from './ConnectionProvider';
import { featureFlagsUpdatedEventListener } from '@src/background/services/featureFlags/events/featureFlagsUpdatedEventListener';
import { GetFeatureFlagsHandler } from '@src/background/services/featureFlags/handlers/getFeatureFlags';
import { ExtensionRequest } from '@src/background/connections/extensionConnection/models';

const FeatureFlagsContext = createContext<{
  featureFlags: Record<FeatureGates, boolean>;
  isFlagEnabled: (flagName: string) => boolean;
}>({
  isFlagEnabled: () => false,
} as any);

export function FeatureFlagsContextProvider({ children }: { children: any }) {
  const { events, request } = useConnectionContext();
  const [featureFlags, setFeatureFlags] =
    useState<Record<FeatureGates, boolean>>(DEFAULT_FLAGS);

  useEffect(() => {
    request<GetFeatureFlagsHandler>({
      method: ExtensionRequest.FEATURE_FLAGS_GET,
    }).then((res) => {
      setFeatureFlags(res);
    });
    const subscription = events()
      .pipe(
        filter(featureFlagsUpdatedEventListener),
        map((evt) => evt.value),
      )
      .subscribe((result) => {
        setFeatureFlags((prevFlags) => {
          if (isEqual(prevFlags, result)) {
            // Prevent re-renders when nothing changed
            return prevFlags;
          }
          return result;
        });
      });
    return () => {
      subscription.unsubscribe();
    };
  }, [events, request]);

  return (
    <FeatureFlagsContext.Provider
      value={{
        isFlagEnabled: (flagName) => featureFlags[flagName],
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
