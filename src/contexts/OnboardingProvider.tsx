import { LoadingIcon } from '@avalabs/react-components';
import { ExtensionRequest } from '@src/background/connections/extensionConnection/models';
import { onboardingUpdatedEventListener } from '@src/background/services/onboarding/events/listeners';
import { GetIsOnboardedHandler } from '@src/background/services/onboarding/handlers/getIsOnBoarded';
import { SubmitOnboardingHandler } from '@src/background/services/onboarding/handlers/submitOnboarding';
import { UpdateInitialOpenHandler } from '@src/background/services/onboarding/handlers/updateInitialOpen';
import {
  OnboardingPhase,
  OnboardingState,
} from '@src/background/services/onboarding/models';
import { PubKeyType } from '@src/background/services/wallet/models';
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
import browser from 'webextension-polyfill';
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
  setXpub: Dispatch<SetStateAction<string>>;
  setXpubXP: Dispatch<SetStateAction<string>>;
  setAnalyticsConsent: Dispatch<SetStateAction<boolean>>;
  setPasswordAndName: (password: string, accountName: string) => void;
  submit(): void;
  updateInitialOpen(): void;
  setPublicKeys: Dispatch<SetStateAction<PubKeyType[] | undefined>>;
  publicKeys?: PubKeyType[];
  setMasterFingerprint: Dispatch<SetStateAction<string>>;
}>({} as any);

export function OnboardingContextProvider({ children }: { children: any }) {
  const { request, events } = useConnectionContext();
  const isHome = useIsSpecificContextContainer(ContextContainer.HOME);
  const [onboardingState, setOnboardingState] = useState<OnboardingState>();
  const [nextPhase, setNextPhase] = useState<OnboardingPhase>();
  const [mnemonic, setMnemonic] = useState('');
  const [xpub, setXpub] = useState('');
  const [xpubXP, setXpubXP] = useState('');
  const [password, setPassword] = useState('');
  const [accountName, setAccountName] = useState<string>('Account 1');
  const [analyticsConsent, setAnalyticsConsent] = useState(false);
  const [submitInProgress, setSubmitInProgress] = useState(false);
  const [publicKeys, setPublicKeys] = useState<PubKeyType[]>();
  const [masterFingerprint, setMasterFingerprint] = useState<string>('');

  function resetStates() {
    setMnemonic('');
    setXpub('');
    setXpubXP('');
    setPublicKeys([]);
    setPassword('');
    setAccountName('Account 1');
    setAnalyticsConsent(false);
    setMasterFingerprint('');
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
        request<GetIsOnboardedHandler>({
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
      request<UpdateInitialOpenHandler>({
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
      window.close();
    }
  }, [isHome, onboardingState]);

  if (!onboardingState) {
    return <LoadingIcon />;
  }

  function setPasswordAndName(pass: string, name: string) {
    setPassword(pass);
    setAccountName(name);
  }

  function submit() {
    if (!mnemonic && !xpub && !password) {
      return;
    }

    setSubmitInProgress(true);
    request<SubmitOnboardingHandler>({
      method: ExtensionRequest.ONBOARDING_SUBMIT,
      params: [
        {
          mnemonic,
          xpub,
          xpubXP,
          password,
          accountName,
          analyticsConsent,
          pubKeys: publicKeys,
          masterFingerprint,
        },
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
        setXpub,
        setXpubXP,
        setPasswordAndName,
        submit,
        updateInitialOpen,
        setAnalyticsConsent,
        setPublicKeys,
        publicKeys,
        setMasterFingerprint,
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
