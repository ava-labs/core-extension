import { DEFAULT_FLAGS } from '@core/common';
import {
  GetFeatureFlagsHandler,
  type UpdateCurrencyHandler,
} from '@core/service-worker';
import {
  CURRENCIES,
  ExtensionRequest,
  FeatureFlags,
  FeatureGates,
  FeatureVars,
} from '@core/types';
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

type GateFetcher = (gateName: FeatureGates) => boolean;
type VarFetcher = (varName: FeatureVars) => string;

const FeatureFlagsContext = createContext<{
  featureFlags: FeatureFlags;
  isFlagEnabled: GateFetcher;
  selectFeatureFlag: VarFetcher;
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
          // When the balance service integration is just turned off
          if (
            !result[FeatureGates.BALANCE_SERVICE_INTEGRATION] &&
            prevFlags[FeatureGates.BALANCE_SERVICE_INTEGRATION]
          ) {
            // The reason we need to do this here is because otherwise we need to rearrange the providers and that resulted in faulty behavior in many levels
            request<UpdateCurrencyHandler>({
              method: ExtensionRequest.SETTINGS_UPDATE_CURRENCY,
              params: [CURRENCIES.USD],
            });
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
        isFlagEnabled: (gateName) => featureFlags[gateName],
        selectFeatureFlag: (varName) => featureFlags[varName] as string,
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
