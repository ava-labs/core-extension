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
import {
  createContext,
  useContext,
  Suspense,
  useEffect,
  lazy,
  useState,
  useCallback,
} from 'react';
import { concat, filter, from, map } from 'rxjs';
import { browser } from 'webextension-polyfill-ts';
import { useConnectionContext } from './ConnectionProvider';

const OnboardingFlow = lazy(() =>
  import('../pages/Onboarding/OnboardingFlow').then((m) => ({
    default: m.OnboardingFlow,
  }))
);

const OnboardingContext = createContext<{
  onboardingState: OnboardingState;
  onboardingPhase?: OnboardingPhase;
  setNextPhase(phase: OnboardingPhase): Promise<void>;
  setMnemonic(mnemonic: string): Promise<void>;
  setPasswordAndName(password: string, accountName: string): Promise<void>;
  setFinalized(): Promise<any>;
  updateInitialOpen(): void;
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
      .subscribe((phase) => {
        setOnboardingPhase(phase);
      });
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [request]);

  const updateInitialOpen = useCallback(
    () =>
      request({
        method: ExtensionRequest.ONBOARDING_INITIAL_WALLET_OPEN,
      }),
    [request]
  );

  /**
   * If they are on the popup.html file then force onboarding to a tab. These files are created
   * in the webpack config and we decipher the environment by the .html file.
   */
  useEffect(() => {
    if (!isHome && onboardingState && !onboardingState.isOnBoarded) {
      browser.tabs.create({ url: '/home.html' });
    }
  }, [isHome, onboardingState]);

  if (!onboardingState) {
    return <LoadingIcon />;
  }

  function setNextPhase(phase: OnboardingPhase) {
    return request({
      method: ExtensionRequest.ONBOARDING_SET_PHASE,
      params: [phase],
    });
  }

  function setMnemonic(mnemonic: string) {
    return request({
      method: ExtensionRequest.ONBOARDING_SET_MNEMONIC,
      params: [mnemonic],
    });
  }

  function setPasswordAndName(password: string, accountName: string) {
    return request({
      method: ExtensionRequest.ONBOARDING_SET_PASSWORD_AND_NAME,
      params: [password, accountName],
    });
  }

  function setFinalized() {
    return request({
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
        setPasswordAndName,
        setFinalized,
        updateInitialOpen,
      }}
    >
      {/* 
        Always show the onbording in full screen since the full screen mode is not supported. 
        Change this to !onboardingState.isOnBoarded to re-activate full screen mode
      */}

      {isHome ? (
        <Suspense fallback={<LoadingIcon />}>
          <OnboardingFlow />
        </Suspense>
      ) : (
        children
      )}
    </OnboardingContext.Provider>
  );
}

export function useOnboardingContext() {
  return useContext(OnboardingContext);
}
