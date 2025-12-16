import {
  useState,
  useEffect,
  useCallback,
  useRef,
  createContext,
  PropsWithChildren,
  useContext,
} from 'react';

import {
  LedgerAppType,
  MAX_BITCOIN_APP_VERSION,
  useActiveLedgerAppInfo,
  useConnectionContext,
  useLedgerContext,
  useRegisterBtcWalletPolicy,
} from '@core/ui';
import { ExtensionRequest } from '@core/types';
import { type StoreBtcWalletPolicyDetails } from '@core/service-worker';
import { isLedgerVersionCompatible } from '@core/common';

type PublicKeyStatus = `pubkey:${GenericStatus}`;
type PolicyStatus = `policy:${GenericStatus | IncorrectDeviceStatus}`;

type IncorrectDeviceStatus = `incorrect-device`;
type GenericStatus = 'pending' | 'success' | 'error';

export type PhaseStatus = GenericStatus | IncorrectDeviceStatus;

export type Status = 'idle' | 'dismissed' | PublicKeyStatus | PolicyStatus;

export type PolicyRegistrationState = {
  policyName?: string;
  policyDerivationPath?: string;
  status: Status;
  dismiss: () => void;
  xpub?: string;
  retry: () => Promise<void>;
  shouldRegisterBtcWalletPolicy: boolean;
};

const defaultContextValue: PolicyRegistrationState = {
  policyName: undefined,
  policyDerivationPath: undefined,
  status: 'idle',
  dismiss: () => {},
  xpub: undefined,
  retry: () => Promise.resolve(),
  shouldRegisterBtcWalletPolicy: false,
};

const LedgerPolicyRegistrationStateContext =
  createContext<PolicyRegistrationState>(defaultContextValue);

export const LedgerPolicyRegistrationStateProvider = ({
  children,
}: PropsWithChildren) => {
  const { request } = useConnectionContext();
  const {
    getBtcExtendedPublicKey,
    getMasterFingerprint,
    registerBtcWalletPolicy,
    closeCurrentApp,
  } = useLedgerContext();
  const { appType, appVersion } = useActiveLedgerAppInfo();

  const {
    shouldRegisterBtcWalletPolicy,
    walletPolicyName,
    walletPolicyDerivationpath,
    check,
  } = useRegisterBtcWalletPolicy();

  const [xpub, setXpub] = useState<string | undefined>();
  const [status, setStatus] = useState<Status>('idle');

  const inProgress = useRef<boolean>(false);

  const retry = useCallback(async () => {
    await check();
    setStatus('idle');
  }, [check]);

  const dismiss = useCallback(async () => {
    const previousStatus = status;

    if (previousStatus.endsWith(':error')) {
      closeCurrentApp().finally(() => {
        // We don't want to set the idle status too early to avoid flickering
        setStatus('idle');
      });
    } else {
      setStatus('idle');
    }
  }, [status, closeCurrentApp]);

  const fetchExtendedPublicKey = useCallback(async () => {
    try {
      if (!walletPolicyDerivationpath) {
        throw new Error('Missing data');
      }

      inProgress.current = true;
      setStatus('pubkey:pending');
      setXpub(await getBtcExtendedPublicKey(walletPolicyDerivationpath));
      setStatus('pubkey:success');
    } catch (err) {
      console.error((err as Error).message);
      setStatus('pubkey:error');
    } finally {
      inProgress.current = false;
    }
  }, [getBtcExtendedPublicKey, walletPolicyDerivationpath]);

  const registerWalletPolicy = useCallback(async () => {
    setStatus('policy:pending');

    try {
      if (!xpub || !walletPolicyDerivationpath || !walletPolicyName) {
        throw new Error('Missing data');
      }

      inProgress.current = true;
      const masterFingerprint = await getMasterFingerprint();

      const [, hmac] = await registerBtcWalletPolicy(
        xpub,
        masterFingerprint,
        walletPolicyDerivationpath,
        walletPolicyName,
      );

      const { isCorrectDevice } = await request<StoreBtcWalletPolicyDetails>({
        method: ExtensionRequest.WALLET_STORE_BTC_WALLET_POLICY_DETAILS,
        params: [
          xpub,
          masterFingerprint,
          hmac.toString('hex'),
          walletPolicyName,
        ],
      });

      if (isCorrectDevice) {
        setStatus('policy:success');
      } else {
        setStatus('policy:incorrect-device');
      }
    } catch (err) {
      console.error((err as Error).message);
      setStatus('policy:error');
    } finally {
      inProgress.current = false;
    }
  }, [
    xpub,
    walletPolicyDerivationpath,
    walletPolicyName,
    getMasterFingerprint,
    registerBtcWalletPolicy,
    request,
  ]);

  useEffect(() => {
    const isCompatibleBitcoinApp =
      appType === LedgerAppType.BITCOIN_RECOVERY ||
      (appType === LedgerAppType.BITCOIN &&
        appVersion &&
        isLedgerVersionCompatible(
          appVersion,
          MAX_BITCOIN_APP_VERSION,
          'maximum',
        ));

    if (!isCompatibleBitcoinApp || inProgress.current) {
      return;
    }

    if (shouldRegisterBtcWalletPolicy && xpub && status === 'pubkey:success') {
      registerWalletPolicy();
    } else if (shouldRegisterBtcWalletPolicy && status === 'idle') {
      fetchExtendedPublicKey();
    }
  }, [
    appType,
    appVersion,
    shouldRegisterBtcWalletPolicy,
    fetchExtendedPublicKey,
    registerWalletPolicy,
    xpub,
    status,
  ]);

  return (
    <LedgerPolicyRegistrationStateContext.Provider
      value={{
        dismiss,
        retry,
        status,
        xpub,
        policyName: walletPolicyName,
        policyDerivationPath: walletPolicyDerivationpath,
        shouldRegisterBtcWalletPolicy,
      }}
    >
      {children}
    </LedgerPolicyRegistrationStateContext.Provider>
  );
};

export const useLedgerPolicyRegistrationState = () => {
  const context = useContext(LedgerPolicyRegistrationStateContext);
  // Return default value if context is not available (e.g., during initial render)
  return context;
};
