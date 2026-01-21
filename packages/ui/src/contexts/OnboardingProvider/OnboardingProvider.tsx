import { WalletType } from '@avalabs/types';
import { Monitoring, signUpForNewsletter } from '@core/common';
import type {
  GetIsOnboardedHandler,
  KeystoneOnboardingHandler,
  KeystoneOnboardingHandlerNew,
  LedgerOnboardingHandler,
  LedgerOnboardingHandlerNew,
  MnemonicOnboardingHandler,
  SeedlessOnboardingHandler,
} from '@core/service-worker';
import {
  AddressPublicKeyJson,
  ContextContainer,
  ExtendedPublicKey,
  ExtensionRequest,
  OnboardingPhase,
  OnboardingState,
  PubKeyType,
  SeedlessAuthProvider,
} from '@core/types';
import { SignerSessionData } from '@cubist-labs/cubesigner-sdk';
import { DerivationPath } from '@avalabs/core-wallets-sdk';
import {
  createContext,
  Dispatch,
  PropsWithChildren,
  ReactNode,
  SetStateAction,
  Suspense,
  useCallback,
  useContext,
  useEffect,
  useState,
} from 'react';
import { useTranslation } from 'react-i18next';
import { concat, filter, from, map } from 'rxjs';
import browser from 'webextension-polyfill';
import { isSpecificContextContainer } from '../../utils';
import { useAnalyticsContext } from '../AnalyticsProvider';
import { useConnectionContext } from '../ConnectionProvider';
import { onboardingUpdatedEventListener } from './listeners';

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
  password: string;
  setPassword: Dispatch<SetStateAction<string>>;
  derivationPathSpec: DerivationPath;
  setDerivationPathSpec: Dispatch<SetStateAction<DerivationPath>>;
  walletName: string;
  setWalletName: Dispatch<SetStateAction<string>>;
  setPasswordAndNames: (password: string, walletName: string) => void;
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
  numberOfAccountsToCreate: number;
  setNumberOfAccountsToCreate: Dispatch<SetStateAction<number>>;
  setAddressPublicKeys: Dispatch<SetStateAction<AddressPublicKeyJson[]>>;
  setExtendedPublicKeys: Dispatch<SetStateAction<ExtendedPublicKey[]>>;
  addressPublicKeys?: AddressPublicKeyJson[];
  extendedPublicKeys?: ExtendedPublicKey[];
}>({} as any);

export function OnboardingContextProvider({
  children,
  LoadingComponent,
  OnboardingScreen,
  onError,
}: PropsWithChildren<{
  children?: ReactNode;
  LoadingComponent: React.FC;
  OnboardingScreen: React.FC;
  onError: (message: string) => void;
}>) {
  const { request, events } = useConnectionContext();
  const isHome = isSpecificContextContainer(ContextContainer.HOME);
  const [onboardingState, setOnboardingState] = useState<OnboardingState>();

  const [nextPhase, setNextPhase] = useState<OnboardingPhase>();

  const [mnemonic, setMnemonic] = useState('');

  const [xpub, setXpub] = useState('');

  const [xpubXP, setXpubXP] = useState('');

  const [password, setPassword] = useState('');

  const [newsletterEmail, setNewsletterEmail] = useState('');
  const [isNewsletterEnabled, setIsNewsletterEnabled] = useState(false);
  const [walletName, setWalletName] = useState<string>('');

  const [analyticsConsent, setAnalyticsConsent] = useState<boolean | undefined>(
    undefined,
  );

  const [derivationPathSpec, setDerivationPathSpec] = useState<DerivationPath>(
    DerivationPath.BIP44,
  );

  const [submitInProgress, setSubmitInProgress] = useState(false);

  const [publicKeys, setPublicKeys] = useState<PubKeyType[]>();

  const [addressPublicKeys, setAddressPublicKeys] = useState<
    AddressPublicKeyJson[]
  >([]);

  const [extendedPublicKeys, setExtendedPublicKeys] = useState<
    ExtendedPublicKey[]
  >([]);

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
  const [numberOfAccountsToCreate, setNumberOfAccountsToCreate] = useState(0);

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
    setWalletName('');
    setIsSeedlessMfaRequired(false);
    setOnboardingWalletType(undefined);
    setIsNewsletterEnabled(false);
    setNewsletterEmail('');
    setNumberOfAccountsToCreate(0);
    setAddressPublicKeys([]);
    setExtendedPublicKeys([]);
    setDerivationPathSpec(DerivationPath.BIP44);
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
        }),
      ),
      events().pipe(
        filter(onboardingUpdatedEventListener),
        map((evt) => evt.value),
      ),
    ).subscribe((result) => {
      setOnboardingState(result as any);
    });
  }, [request, events]);

  /**
   * If they are on the popup.html file then force onboarding to a tab. These files are created
   * in the rsbuild config and we decipher the environment by the .html file.
   */
  useEffect(() => {
    if (!isHome && onboardingState && !onboardingState.isOnBoarded) {
      browser.tabs.create({ url: '/home.html' });
      window.close();
    }
  }, [isHome, onboardingState]);

  const setPasswordAndNames = useCallback(
    (pass: string, newWalletName: string) => {
      setPassword(pass);
      setWalletName(newWalletName);
    },
    [],
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

  const submitLedgerNew = useCallback(() => {
    if (!addressPublicKeys || !extendedPublicKeys) {
      throw new Error('Missing public keys');
    }

    return request<LedgerOnboardingHandlerNew>({
      method: ExtensionRequest.LEDGER_ONBOARDING_SUBMIT_NEW,
      params: [
        {
          addressPublicKeys,
          extendedPublicKeys,
          password,
          analyticsConsent: !!analyticsConsent,
          walletName: walletName,
          derivationPathSpec,
        },
      ],
    });
  }, [
    analyticsConsent,
    addressPublicKeys,
    extendedPublicKeys,
    password,
    request,
    walletName,
    derivationPathSpec,
  ]);

  /**
   * @deprecated Try to use submitLedgerNew() instead
   */
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
          numberOfAccountsToCreate,
        },
      ],
    });
  }, [
    analyticsConsent,
    numberOfAccountsToCreate,
    password,
    publicKeys,
    request,
    walletName,
    xpub,
    xpubXP,
  ]);

  const submitKeystoneNew = useCallback(() => {
    return request<KeystoneOnboardingHandlerNew>({
      method: ExtensionRequest.KEYSTONE_ONBOARDING_SUBMIT_NEW,
      params: [
        {
          masterFingerprint,
          addressPublicKeys,
          extendedPublicKeys,
          password,
          analyticsConsent: !!analyticsConsent,
          walletName: walletName,
        },
      ],
    });
  }, [
    analyticsConsent,
    addressPublicKeys,
    extendedPublicKeys,
    masterFingerprint,
    password,
    request,
    walletName,
  ]);

  /**
   * @deprecated Try to use submitKeystoneNew() instead
   */
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
    xpubXP,
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
        handler =
          addressPublicKeys.length > 0 ? submitKeystoneNew : submitKeystone;
      }

      if (!handler && onboardingWalletType === WalletType.Ledger) {
        handler = addressPublicKeys.length > 0 ? submitLedgerNew : submitLedger;
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
                '<user-email>',
              );

              Monitoring.sentryCaptureException(
                new Error(sanitizedMessage),
                Monitoring.SentryExceptionTypes.ONBOARDING,
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
          onError(t('Something went wrong. Please try again.'));
          setAnalyticsConsent(undefined);
        })
        .finally(() => {
          setSubmitInProgress(false);
        });
    },
    [
      submitInProgress,
      mnemonic,
      xpub,
      password,
      onboardingWalletType,
      addressPublicKeys,
      submitMnemonic,
      submitSeedless,
      submitKeystoneNew,
      submitKeystone,
      submitLedgerNew,
      submitLedger,
      capture,
      walletType,
      isNewsletterEnabled,
      resetStates,
      newsletterEmail,
      onError,
      t,
    ],
  );

  if (!onboardingState) {
    return <LoadingComponent />;
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
        password,
        setPassword,
        walletName,
        setWalletName,
        setPasswordAndNames,
        derivationPathSpec,
        setDerivationPathSpec,
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
        numberOfAccountsToCreate,
        setNumberOfAccountsToCreate,
        setAddressPublicKeys,
        setExtendedPublicKeys,
        extendedPublicKeys,
      }}
    >
      {/*
        Always show the onbording in full screen since the full screen mode is not supported.
        Change this to !onboardingState.isOnBoarded to re-activate full screen mode
      */}

      {isHome ? (
        <Suspense fallback={<LoadingComponent />}>
          <OnboardingScreen />
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
