import { LoadingIcon } from '@avalabs/react-components';
import { ExtensionRequest } from '@src/background/connections/models';
import { onboardingUpdatedEventListener } from '@src/background/services/onboarding/events/listeners';
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
  Dispatch,
  SetStateAction,
} from 'react';
import { concat, filter, from, map } from 'rxjs';
import { browser } from 'webextension-polyfill-ts';
import { useConnectionContext } from './ConnectionProvider';

const Onboarding = lazy(() =>
  import('../pages/Onboarding/Onboarding').then((m) => ({
    default: m.Onboarding,
  }))
);

const OnboardingContext = createContext<{
  onboardingState: OnboardingState;
  nextPhase?: OnboardingPhase;
  submitInProgress: boolean;
  setNextPhase: Dispatch<SetStateAction<OnboardingPhase | undefined>>;
  setMnemonic: Dispatch<SetStateAction<string>>;
  setPublicKey: Dispatch<SetStateAction<string>>;
  setAnalyticsConsent: Dispatch<SetStateAction<boolean>>;
  setPasswordAndName: (password: string, accountName: string) => void;
  submit(): void;
  updateInitialOpen(): void;
}>({} as any);

export function OnboardingContextProvider({ children }: { children: any }) {
  const { request, events } = useConnectionContext();
  const isHome = useIsSpecificContextContainer(ContextContainer.HOME);
  const [onboardingState, setOnboardingState] = useState<OnboardingState>();
  const [nextPhase, setNextPhase] = useState<OnboardingPhase>();
  const [mnemonic, setMnemonic] = useState('');
  const [publicKey, setPublicKey] = useState('');
  const [password, setPassword] = useState('');
  const [accountName, setAccountName] = useState<string>('Account 1');
  const [analyticsConsent, setAnalyticsConsent] = useState(false);
  const [submitInProgress, setSubmitInProgress] = useState(false);

  function resetStates() {
    setMnemonic('');
    setPublicKey('');
    setPassword('');
    setAccountName('Account 1');
    setAnalyticsConsent(false);
  }

  useEffect(() => {
    if (nextPhase === OnboardingPhase.RESTART) {
      resetStates();
    }
  }, [nextPhase]);

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
  }, [request, events]);

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

  function setPasswordAndName(password: string, accountName: string) {
    setPassword(password);
    setAccountName(accountName);
  }

  function submit() {
    if (!mnemonic && !publicKey && !password) {
      return;
    }

    setSubmitInProgress(true);
    request({
      method: ExtensionRequest.ONBOARDING_SUBMIT,
      params: [
        { mnemonic, publicKey, password, accountName, analyticsConsent },
      ],
    })
      .then(() => {
        resetStates();
      })
      .finally(() => setSubmitInProgress(false));
  }

  return (
    <OnboardingContext.Provider
      value={{
        onboardingState,
        nextPhase,
        submitInProgress,
        setNextPhase,
        setMnemonic,
        setPublicKey,
        setPasswordAndName,
        submit,
        updateInitialOpen,
        setAnalyticsConsent,
      }}
    >
      {/* 
        Always show the onbording in full screen since the full screen mode is not supported. 
        Change this to !onboardingState.isOnBoarded to re-activate full screen mode
      */}

      {isHome ? (
        <Suspense fallback={<LoadingIcon />}>
          <Onboarding />
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
