import { LoadingIcon } from '@avalabs/react-components';
import {
  onboardingUpdatedEventListener,
  onboardingPhaseUpdatedEventListener,
} from '@src/background/services/onboarding/handlers';
import {
  OnboardingPhase,
  OnboardingState,
} from '@src/background/services/onboarding/models';
import { useIsPopup } from '@src/hooks/useIsPopup';
import React, { createContext, useContext, useEffect, useState } from 'react';
import { concat, filter, from, map } from 'rxjs';
import { browser } from 'webextension-polyfill-ts';
import { useConnectionContext } from './ConnectionProvider';

const OnboardingFlow = React.lazy(() => {
  return import('../pages/Onboarding/OnboardingFlow');
});

const OnboardingContext = createContext<{
  onboardingState: OnboardingState;
  onboardingPhase?: OnboardingPhase;
  setNextPhase(phase: OnboardingPhase): Promise<any>;
  setMnemonic(mnemonic: string): Promise<any>;
  setPassword(password: string): Promise<any>;
  setFinalized(): Promise<any>;
}>({} as any);

export function OnboardingContextProvider({ children }: { children: any }) {
  const { request, events } = useConnectionContext();
  const isPopup = useIsPopup();
  const [onboardingState, setOnboardingState] = useState<OnboardingState>();
  const [onboardingPhase, setOnboardingPhase] = useState<OnboardingPhase>();

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

    events()
      .pipe(
        filter(onboardingPhaseUpdatedEventListener),
        map((evt) => evt.value)
      )
      .subscribe((phase) => setOnboardingPhase(phase));
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

  function setNextPhase(phase: OnboardingPhase) {
    return request!({
      method: 'onboarding_setCurrentPhase',
      params: [phase],
    });
  }

  function setMnemonic(mnemonic: string) {
    return request!({
      method: 'onboarding_setWalletMnemonic',
      params: [mnemonic],
    });
  }

  function setPassword(password: string) {
    return request!({
      method: 'onboarding_setWalletPassword',
      params: [password],
    });
  }

  function setFinalized() {
    return request!({
      method: 'onboarding_setOnboardingFinalized',
    });
  }

  return (
    <OnboardingContext.Provider
      value={{
        onboardingState,
        onboardingPhase,
        setNextPhase,
        setMnemonic,
        setPassword,
        setFinalized,
      }}
    >
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
