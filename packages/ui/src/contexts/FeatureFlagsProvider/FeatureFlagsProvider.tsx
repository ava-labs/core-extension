import { DEFAULT_FLAGS } from '@core/common';
import { GetFeatureFlagsHandler } from '@core/service-worker';
import { ExtensionRequest, FeatureFlags } from '@core/types';
import { isEqual } from 'lodash';
import {
  createContext,
  PropsWithChildren,
  useContext,
  useEffect,
  useState,
} from 'react';
import { filter, map } from 'rxjs';
import { useConnectionContext } from '../ConnectionProvider';
import { isFeatureFlagsUpdatedEvent } from './isFeatureFlagsUpdatedEvent';

const FeatureFlagsContext = createContext<{
  featureFlags: FeatureFlags;
  isFlagEnabled: (flagName: string) => boolean;
  selectFeatureFlag: (flagName: string) => string;
}>({
  isFlagEnabled: () => false,
} as any);

export function FeatureFlagsContextProvider({ children }: PropsWithChildren) {
  const { events, request } = useConnectionContext();
  const [featureFlags, setFeatureFlags] = useState<FeatureFlags>(DEFAULT_FLAGS);

  useEffect(() => {
    request<GetFeatureFlagsHandler>({
      method: ExtensionRequest.FEATURE_FLAGS_GET,
    }).then((res) => {
      setFeatureFlags(res);
    });
    const subscription = events()
      .pipe(
        filter(isFeatureFlagsUpdatedEvent),
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
        selectFeatureFlag: (flagName) => featureFlags[flagName] as string,
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
