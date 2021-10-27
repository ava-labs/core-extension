import { LoadingIcon } from '@avalabs/react-components';
import { ExtensionRequest } from '@src/background/connections/models';
import {
  onboardingPhaseUpdatedEventListener,
  onboardingUpdatedEventListener,
} from '@src/background/services/onboarding/events/listeners';
import {
  OnboardingPhase,
  OnboardingState,
} from '@src/background/services/onboarding/models';
import {
  useIsSpecificContextContainer,
  ContextContainer,
} from '@src/hooks/useIsSpecificContextContainer';
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
  const isHome = useIsSpecificContextContainer(ContextContainer.HOME);
  const [onboardingState, setOnboardingState] = useState<OnboardingState>();
  const [onboardingPhase, setOnboardingPhase] = useState<OnboardingPhase>();

  useEffect(() => {
    if (!request || !events) {
      return;
    }

    concat(
      from(
        request<OnboardingState>({
          method: ExtensionRequest.ONBOARDING_GET_STATE,
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
  if (!isHome && !onboardingState.isOnBoarded) {
    browser.tabs.create({ url: '/home.html' });
  }

  function setNextPhase(phase: OnboardingPhase) {
    return request!({
      method: ExtensionRequest.ONBOARDING_SET_PHASE,
      params: [phase],
    });
  }

  function setMnemonic(mnemonic: string) {
    return request!({
      method: ExtensionRequest.ONBOARDING_SET_MNEMONIC,
      params: [mnemonic],
    });
  }

  function setPassword(password: string) {
    return request!({
      method: ExtensionRequest.ONBOARDING_SET_PASSWORD,
      params: [password],
    });
  }

  function setFinalized() {
    return request!({
      method: ExtensionRequest.ONBOARDING_SET_FINALIZED,
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
      {/* 
        Always show the onbording in full screen since the full screen mode is not supported. 
        Change this to !onboardingState.isOnBoarded to re-activate full screen mode
      */}
      {isHome ? (
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
