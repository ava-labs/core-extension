import { LoadingIcon } from '@avalabs/react-components';
import { onboardingUpdatedEventListener } from '@src/background/services/onboarding/handlers';
import { OnboardingState } from '@src/background/services/onboarding/models';
import { useIsPopup } from '@src/hooks/useIsPopup';
import React, { createContext, useContext, useEffect, useState } from 'react';
import { concat, filter, from, map } from 'rxjs';
import { browser } from 'webextension-polyfill-ts';
import { useConnectionContext } from './ConnectionProvider';

const OnboardingFlow = React.lazy(() => {
  return import('../pages/Onboarding/OnboardingFlow');
});

const OnboardingContext = createContext<OnboardingState>({} as any);

export function OnboardingContextProvider({ children }: { children: any }) {
  const { request, events } = useConnectionContext();
  const isPopup = useIsPopup();
  const [onboardingState, setOnboardingState] = useState<OnboardingState>();

  useEffect(() => {
    if (!request || !events) {
      return;
    }

    concat(
      from(
        request<OnboardingState>({
          method: 'onboarding_getIsOnBoarded',
        })
      ),
      events().pipe(
        filter(onboardingUpdatedEventListener),
        map((evt) => evt.value)
      )
    ).subscribe((result) => {
      setOnboardingState(result as any);
    });
  }, [request]);

  if (!onboardingState) {
    return <LoadingIcon />;
  }

  /**
   * If they are on the popup.html file then force onboarding to a tab. These files are created
   * in the webpack config and we decipher the environment by the .html file.
   */
  if (isPopup && !onboardingState.isOnBoarded) {
    browser.tabs.create({ url: '/home.html' });
  }

  return (
    <OnboardingContext.Provider value={onboardingState}>
      {!onboardingState.isOnBoarded ? (
        <React.Suspense fallback={<LoadingIcon />}>
          <OnboardingFlow />
        </React.Suspense>
      ) : (
        children
      )}
    </OnboardingContext.Provider>
  );
}

export function useOnboardingContext() {
  return useContext(OnboardingContext);
}
