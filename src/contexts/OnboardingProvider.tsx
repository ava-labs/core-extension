import { ExtensionRequest } from '@src/background/connections/extensionConnection/models';
import { onboardingUpdatedEventListener } from '@src/background/services/onboarding/events/listeners';
import { GetIsOnboardedHandler } from '@src/background/services/onboarding/handlers/getIsOnBoarded';
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
import { toast } from '@avalabs/core-k2-components';
import { useTranslation } from 'react-i18next';
import { SignerSessionData } from '@cubist-labs/cubesigner-sdk';
import { useAnalyticsContext } from './AnalyticsProvider';
import { MnemonicOnboardingHandler } from '@src/background/services/onboarding/handlers/mnemonicOnboardingHandler';
import { SeedlessOnboardingHandler } from '@src/background/services/onboarding/handlers/seedlessOnboardingHandler';
import { KeystoneOnboardingHandler } from '@src/background/services/onboarding/handlers/keystoneOnboardingHandler';
import { LedgerOnboardingHandler } from '@src/background/services/onboarding/handlers/ledgerOnboardingHandler';
import { WalletType } from '@avalabs/types';
import { signUpForNewsletter } from '@src/utils/newsletter';
import sentryCaptureException, {
  SentryExceptionTypes,
} from '@src/monitoring/sentryCaptureException';

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
  setPasswordAndNames: (password: string, walletName?: string) => void;
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
  setUserId: Dispatch<SetStateAction<string | undefined>>;
  resetStates: () => void;
  isSeedlessMfaRequired: boolean;
  setIsSeedlessMfaRequired: Dispatch<SetStateAction<boolean>>;
  setOnboardingWalletType: Dispatch<SetStateAction<WalletType | undefined>>;
  newsletterEmail: string;
  setNewsletterEmail: Dispatch<SetStateAction<string>>;
  isNewsletterEnabled: boolean;
  setIsNewsletterEnabled: Dispatch<SetStateAction<boolean>>;
  onboardingWalletType: WalletType | undefined;
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

  const [newsletterEmail, setNewsletterEmail] = useState('');
  const [isNewsletterEnabled, setIsNewsletterEnabled] = useState(false);
  const [walletName, setWalletName] = useState<string>();

  const [analyticsConsent, setAnalyticsConsent] = useState<boolean | undefined>(
    undefined
  );

  const [submitInProgress, setSubmitInProgress] = useState(false);

  const [publicKeys, setPublicKeys] = useState<PubKeyType[]>();

  const [masterFingerprint, setMasterFingerprint] = useState<string>('');

  const [authProvider, setAuthProvider] = useState<SeedlessAuthProvider>();

  const [userId, setUserId] = useState<string>();

  const { t } = useTranslation();

  const [oidcToken, setOidcToken] = useState<string>('');

  const [seedlessSignerToken, setSeedlessSignerToken] = useState<
    SignerSessionData | undefined
  >(undefined);

  const [onboardingPhase, setOnboardingPhase] =
    useState<OnboardingPhase | null>(null);

  const [walletType, setWalletType] = useState<string>();

  const [isSeedlessMfaRequired, setIsSeedlessMfaRequired] = useState(false);

  const [onboardingWalletType, setOnboardingWalletType] = useState<
    WalletType | undefined
  >(undefined);

  const { capture } = useAnalyticsContext();

  const resetStates = useCallback(() => {
    setMnemonic('');
    setXpub('');
    setXpubXP('');
    setPublicKeys(undefined);
    setPassword('');
    setAnalyticsConsent(undefined);
    setMasterFingerprint('');
    setOidcToken('');
    setSeedlessSignerToken(undefined);
    setWalletType(undefined);
    setUserId(undefined);
    setWalletName(undefined);
    setIsSeedlessMfaRequired(false);
    setOnboardingWalletType(undefined);
    setIsNewsletterEnabled(false);
    setNewsletterEmail('');
  }, []);

  useEffect(() => {
    if (nextPhase === OnboardingPhase.RESTART) {
      resetStates();
    }
  }, [nextPhase, resetStates]);

  useEffect(() => {
    const walletTypeSelectingPhases = [
      OnboardingPhase.CREATE_WALLET,
      OnboardingPhase.IMPORT_WALLET,
      OnboardingPhase.LEDGER,
      OnboardingPhase.KEYSTONE,
      OnboardingPhase.SEEDLESS_GOOGLE,
      OnboardingPhase.SEEDLESS_APPLE,
    ];

    if (
      onboardingPhase &&
      walletTypeSelectingPhases.includes(onboardingPhase)
    ) {
      setWalletType(onboardingPhase);
    }
  }, [onboardingPhase]);

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

  const setPasswordAndNames = useCallback(
    (pass: string, newWalletName?: string) => {
      setPassword(pass);
      setWalletName(newWalletName);
    },
    []
  );

  const submitMnemonic = useCallback(() => {
    return request<MnemonicOnboardingHandler>({
      method: ExtensionRequest.MNEMONIC_ONBOARDING_SUBMIT,
      params: [
        {
          mnemonic,
          password,
          analyticsConsent: !!analyticsConsent,
          walletName: walletName,
        },
      ],
    });
  }, [analyticsConsent, mnemonic, password, request, walletName]);

  const submitSeedless = useCallback(() => {
    if (!seedlessSignerToken || !userId || !authProvider) {
      throw new Error('Seedless wallet initialization failed');
    }
    return request<SeedlessOnboardingHandler>({
      method: ExtensionRequest.SEEDLESS_ONBOARDING_SUBMIT,
      params: [
        {
          seedlessSignerToken,
          userId,
          authProvider,
          password,
          analyticsConsent: !!analyticsConsent,
          walletName: walletName,
        },
      ],
    });
  }, [
    analyticsConsent,
    authProvider,
    password,
    request,
    seedlessSignerToken,
    userId,
    walletName,
  ]);

  const submitLedger = useCallback(() => {
    return request<LedgerOnboardingHandler>({
      method: ExtensionRequest.LEDGER_ONBOARDING_SUBMIT,
      params: [
        {
          xpub,
          xpubXP,
          pubKeys: publicKeys,
          password,
          analyticsConsent: !!analyticsConsent,
          walletName: walletName,
        },
      ],
    });
  }, [
    analyticsConsent,
    password,
    publicKeys,
    request,
    walletName,
    xpub,
    xpubXP,
  ]);

  const submitKeystone = useCallback(() => {
    return request<KeystoneOnboardingHandler>({
      method: ExtensionRequest.KEYSTONE_ONBOARDING_SUBMIT,
      params: [
        {
          masterFingerprint,
          xpub,
          xpubXP,
          password,
          analyticsConsent: !!analyticsConsent,
          walletName: walletName,
        },
      ],
    });
  }, [
    analyticsConsent,
    masterFingerprint,
    password,
    request,
    walletName,
    xpub,
  ]);

  const submit = useCallback(
    (postSubmitHandler: () => void) => {
      if (submitInProgress) {
        return;
      }
      if (!mnemonic && !xpub && !password) {
        return;
      }

      let handler: (() => Promise<true>) | undefined = undefined;

      if (!handler && onboardingWalletType === WalletType.Mnemonic) {
        handler = submitMnemonic;
      }

      if (!handler && onboardingWalletType === WalletType.Seedless) {
        handler = submitSeedless;
      }

      if (!handler && onboardingWalletType === WalletType.Keystone) {
        handler = submitKeystone;
      }

      if (!handler && onboardingWalletType === WalletType.Ledger) {
        handler = submitLedger;
      }

      if (!handler) {
        return;
      }

      setSubmitInProgress(true);
      handler()
        .then(async () => {
          capture('OnboardingSubmitSucceeded', { walletType });

          if (isNewsletterEnabled) {
            try {
              await signUpForNewsletter({ email: newsletterEmail });
              capture('NewsletterSignupSuccess');
            } catch (ex: any) {
              const rawMessage = ex.message
                ? String(ex.message)
                : 'Failed to sign up for newsletter';
              const sanitizedMessage = rawMessage.replace(
                new RegExp(newsletterEmail, 'g'),
                '<user-email>'
              );

              sentryCaptureException(
                new Error(sanitizedMessage),
                SentryExceptionTypes.ONBOARDING
              );
              capture('NewsletterSignupFailure');
            }
          }

          resetStates();
          postSubmitHandler();
        })
        .catch(() => {
          capture('OnboardingSubmitFailed', { walletType });
          setNextPhase(OnboardingPhase.PASSWORD);
          toast.error(t('Something went wrong. Please try again.'), {
            duration: 3000,
          });
          setAnalyticsConsent(undefined);
        })
        .finally(() => {
          setSubmitInProgress(false);
        });
    },
    [
      capture,
      isNewsletterEnabled,
      mnemonic,
      newsletterEmail,
      onboardingWalletType,
      password,
      resetStates,
      submitInProgress,
      submitKeystone,
      submitLedger,
      submitMnemonic,
      submitSeedless,
      t,
      walletType,
      xpub,
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
        newsletterEmail,
        isNewsletterEnabled,
        setIsNewsletterEnabled,
        submitInProgress,
        setNextPhase,
        setNewsletterEmail,
        setMnemonic,
        setXpub,
        setXpubXP,
        setPasswordAndNames,
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
        setUserId,
        resetStates,
        isSeedlessMfaRequired,
        setIsSeedlessMfaRequired,
        setOnboardingWalletType,
        onboardingWalletType,
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
