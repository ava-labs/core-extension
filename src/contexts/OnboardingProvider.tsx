import { ExtensionRequest } from '@src/background/connections/extensionConnection/models';
import { onboardingUpdatedEventListener } from '@src/background/services/onboarding/events/listeners';
import { GetIsOnboardedHandler } from '@src/background/services/onboarding/handlers/getIsOnBoarded';
import { SubmitOnboardingHandler } from '@src/background/services/onboarding/handlers/submitOnboarding';
import {
  OnboardingPhase,
  OnboardingState,
} from '@src/background/services/onboarding/models';
import {
  PubKeyType,
  SeedlessAuthProvider,
} from '@src/background/services/wallet/models';
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
  Dispatch,
  SetStateAction,
  useCallback,
} from 'react';
import { concat, filter, from, map } from 'rxjs';
import browser from 'webextension-polyfill';
import { useConnectionContext } from './ConnectionProvider';
import { LoadingContent } from '@src/popup/LoadingContent';
import { toast } from '@avalabs/k2-components';
import { useTranslation } from 'react-i18next';
import { SignerSessionData } from '@cubist-labs/cubesigner-sdk';

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
  setAnalyticsConsent: Dispatch<SetStateAction<boolean | undefined>>;
  analyticsConsent: boolean | undefined;
  setPasswordAndName: (password: string, accountName: string) => void;
  submit(postSubmitHandler: () => void): void;
  setPublicKeys: Dispatch<SetStateAction<PubKeyType[] | undefined>>;
  publicKeys?: PubKeyType[];
  setMasterFingerprint: Dispatch<SetStateAction<string>>;
  mnemonic: string;
  onboardingPhase: OnboardingPhase | null;
  setOnboardingPhase: Dispatch<SetStateAction<OnboardingPhase | null>>;
  setOidcToken: Dispatch<SetStateAction<string>>;
  oidcToken?: string;
  setAuthProvider: Dispatch<SetStateAction<SeedlessAuthProvider | undefined>>;
  setSeedlessSignerToken: Dispatch<
    SetStateAction<SignerSessionData | undefined>
  >;
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

  const [analyticsConsent, setAnalyticsConsent] = useState<boolean | undefined>(
    undefined
  );

  const [submitInProgress, setSubmitInProgress] = useState(false);

  const [publicKeys, setPublicKeys] = useState<PubKeyType[]>();

  const [masterFingerprint, setMasterFingerprint] = useState<string>('');

  const [authProvider, setAuthProvider] = useState<SeedlessAuthProvider>();

  const { t } = useTranslation();

  const [oidcToken, setOidcToken] = useState<string>('');
  const [seedlessSignerToken, setSeedlessSignerToken] = useState<
    SignerSessionData | undefined
  >(undefined);

  const [onboardingPhase, setOnboardingPhase] =
    useState<OnboardingPhase | null>(null);

  function resetStates() {
    setMnemonic('');
    setXpub('');
    setXpubXP('');
    setPublicKeys(undefined);
    setPassword('');
    setAccountName('Account 1');
    setAnalyticsConsent(undefined);
    setMasterFingerprint('');
    setOidcToken('');
    setSeedlessSignerToken(undefined);
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

  const setPasswordAndName = useCallback((pass: string, name: string) => {
    setPassword(pass);
    setAccountName(name);
  }, []);

  const submit = useCallback(
    (postSubmitHandler: () => void) => {
      if (submitInProgress) {
        return;
      }

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
            analyticsConsent: !!analyticsConsent,
            pubKeys: publicKeys,
            masterFingerprint,
            seedlessSignerToken,
            authProvider,
          },
        ],
      })
        .then(() => {
          resetStates();
          postSubmitHandler();
        })
        .catch(() => {
          setNextPhase(OnboardingPhase.PASSWORD);
          toast.error(t('Something went wrong. Please try again.'), {
            duration: 3000,
          });
        })
        .finally(() => {
          setSubmitInProgress(false);
        });
    },
    [
      accountName,
      analyticsConsent,
      authProvider,
      masterFingerprint,
      mnemonic,
      password,
      publicKeys,
      request,
      seedlessSignerToken,
      t,
      xpub,
      xpubXP,
      submitInProgress,
    ]
  );

  if (!onboardingState) {
    return <LoadingContent />;
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
        setAnalyticsConsent,
        analyticsConsent,
        setPublicKeys,
        publicKeys,
        setMasterFingerprint,
        mnemonic,
        onboardingPhase,
        setOnboardingPhase,
        setOidcToken,
        oidcToken,
        setSeedlessSignerToken,
        setAuthProvider,
      }}
    >
      {/*
        Always show the onbording in full screen since the full screen mode is not supported.
        Change this to !onboardingState.isOnBoarded to re-activate full screen mode
      */}

      {isHome ? (
        <Suspense fallback={<LoadingContent />}>
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
