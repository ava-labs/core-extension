import { useState, useEffect, useCallback, useRef } from 'react';

import {
  LedgerAppType,
  useActiveLedgerAppInfo,
  useConnectionContext,
  useLedgerContext,
  useRegisterBtcWalletPolicy,
} from '@core/ui';
import { ExtensionRequest } from '@core/types';
import { type StoreBtcWalletPolicyDetails } from '@core/service-worker';

import { PolicyRegistrationState, Status } from '../types';

export const usePolicyRegistrationState = (): PolicyRegistrationState => {
  const { request } = useConnectionContext();
  const {
    getBtcExtendedPublicKey,
    getMasterFingerprint,
    registerBtcWalletPolicy,
    closeCurrentApp,
  } = useLedgerContext();
  const { appType } = useActiveLedgerAppInfo();

  const {
    shouldRegisterBtcWalletPolicy,
    walletPolicyName,
    walletPolicyDerivationpath,
    reset,
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

    setStatus('idle');
    reset();

    if (previousStatus.endsWith(':error')) {
      await closeCurrentApp();
    }
  }, [status, reset, closeCurrentApp]);

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
    if (appType !== LedgerAppType.BITCOIN || inProgress.current) {
      return;
    }

    if (shouldRegisterBtcWalletPolicy && xpub && status === 'pubkey:success') {
      registerWalletPolicy();
    } else if (shouldRegisterBtcWalletPolicy && status === 'idle') {
      fetchExtendedPublicKey();
    }
  }, [
    appType,
    shouldRegisterBtcWalletPolicy,
    fetchExtendedPublicKey,
    registerWalletPolicy,
    xpub,
    status,
  ]);

  return {
    dismiss,
    retry,
    status,
    xpub,
    policyName: walletPolicyName,
    policyDerivationPath: walletPolicyDerivationpath,
  };
};
