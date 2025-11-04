import { useState, useEffect, useCallback } from 'react';

import {
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

  const {
    shouldRegisterBtcWalletPolicy,
    walletPolicyName,
    walletPolicyDerivationpath,
    reset,
  } = useRegisterBtcWalletPolicy();

  const [xpub, setXpub] = useState<string | undefined>();
  const [status, setStatus] = useState<Status>('idle');

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

      setStatus('pubkey:pending');
      setXpub(await getBtcExtendedPublicKey(walletPolicyDerivationpath));
      setStatus('pubkey:success');
    } catch (err) {
      console.error((err as Error).message);
      setStatus('pubkey:error');
    }
  }, [getBtcExtendedPublicKey, walletPolicyDerivationpath]);

  const registerWalletPolicy = useCallback(async () => {
    setStatus('policy:pending');

    try {
      if (!xpub || !walletPolicyDerivationpath || !walletPolicyName) {
        throw new Error('Missing data');
      }

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
    if (shouldRegisterBtcWalletPolicy && xpub && status === 'pubkey:success') {
      registerWalletPolicy();
    } else if (shouldRegisterBtcWalletPolicy && status === 'idle') {
      fetchExtendedPublicKey();
    }
  }, [
    shouldRegisterBtcWalletPolicy,
    fetchExtendedPublicKey,
    registerWalletPolicy,
    xpub,
    status,
  ]);

  return {
    dismiss,
    status,
    xpub,
    policyName: walletPolicyName,
    policyDerivationPath: walletPolicyDerivationpath,
  };
};
