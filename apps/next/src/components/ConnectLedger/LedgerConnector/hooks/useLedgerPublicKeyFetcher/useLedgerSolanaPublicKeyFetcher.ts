import { DerivationPath } from '@avalabs/core-wallets-sdk';
import { useCallback, useEffect, useRef, useState } from 'react';

import { AddressPublicKeyJson, DerivationStatus } from '@core/types';
import {
  getLedgerAutoOpenAppFailedMessage,
  getLedgerQuitAppFailedMessage,
  SOLANA_LEDGER_APP_NAME,
} from '@core/common';
import {
  LedgerAppType,
  useActiveLedgerAppInfo,
  useLedgerContext,
} from '@core/ui';

import { ErrorType, PublicKey, UseLedgerPublicKeyFetcher } from '../../types';
import { buildAddressPublicKey } from '../../util';

export const useLedgerSolanaPublicKeyFetcher: UseLedgerPublicKeyFetcher = (
  __,
  onActivePublicKeysDiscovered,
) => {
  const {
    popDeviceSelection,
    hasLedgerTransport,
    wasTransportAttempted,
    initLedgerTransport,
    getPublicKey,
    prepareTransportForSolanaOnboarding,
  } = useLedgerContext();
  const { appType } = useActiveLedgerAppInfo(true);

  const [error, setError] = useState<ErrorType>();
  const [status, setStatus] = useState<DerivationStatus>('waiting');
  const solanaSwitchInFlightRef = useRef<Promise<void> | null>(null);

  const getPublicKeyFromLedger = useCallback(
    async (accountIndex: number): Promise<AddressPublicKeyJson> => {
      const publicKey = await getPublicKey(
        accountIndex,
        DerivationPath.LedgerLive,
        'SVM',
      );

      return buildAddressPublicKey(
        publicKey,
        'SVM',
        accountIndex,
        'ed25519',
        DerivationPath.LedgerLive,
      );
    },
    [getPublicKey],
  );

  // With Solana, we can only query for specific address' public key. No extended public keys are available.
  const retrieveKeys = useCallback(
    async (numberOfKeys: number) => {
      try {
        const indexes = Array.from({ length: numberOfKeys }, (_, i) => i);
        const keys: PublicKey[] = [];

        // We cannot send multiple requests to the ledger at once, so we need to do one at a time
        for (const index of indexes) {
          const key = await getPublicKeyFromLedger(index);
          keys.push({
            index,
            vm: 'SVM',
            key,
          });
          onActivePublicKeysDiscovered?.(keys);
        }

        return {
          addressPublicKeys: keys,
        };
      } catch (err) {
        console.error(err);
        popDeviceSelection();
        throw err;
      }
    },
    [popDeviceSelection, getPublicKeyFromLedger, onActivePublicKeysDiscovered],
  );

  // Attempt to automatically connect as soon as we establish the transport.
  useEffect(() => {
    if (error === 'duplicated-wallet' || status === 'needs-user-gesture') {
      return;
    }

    if (hasLedgerTransport) {
      if (appType === LedgerAppType.SOLANA) {
        solanaSwitchInFlightRef.current = null;
        setStatus('ready');
        setError(undefined);
        return;
      }

      if (status === 'error' && error) {
        return;
      }

      if (solanaSwitchInFlightRef.current) {
        return;
      }

      setStatus('waiting');
      setError(undefined);

      let cancelled = false;
      const switchPromise = prepareTransportForSolanaOnboarding().finally(
        () => {
          solanaSwitchInFlightRef.current = null;
        },
      );
      solanaSwitchInFlightRef.current = switchPromise;

      switchPromise.catch((err: unknown) => {
        if (cancelled) {
          return;
        }
        const message = err instanceof Error ? err.message : String(err);
        if (message.includes('not installed on this Ledger device')) {
          setStatus('error');
          setError('app-not-installed');
          return;
        }
        if (
          message === getLedgerAutoOpenAppFailedMessage(SOLANA_LEDGER_APP_NAME)
        ) {
          setStatus('error');
          setError('no-app');
          return;
        }
        if (message === getLedgerQuitAppFailedMessage()) {
          setStatus('error');
          setError('no-app');
          return;
        }
        if (message.includes('no device detected')) {
          setStatus('error');
          setError('unable-to-connect');
          return;
        }
        setStatus('error');
        setError('device-locked');
      });

      return () => {
        cancelled = true;
      };
    } else if (!hasLedgerTransport && !wasTransportAttempted) {
      initLedgerTransport();
    } else if (!hasLedgerTransport) {
      const timer = setTimeout(() => {
        setStatus('error');
        setError('unable-to-connect');
      }, 20_000);

      return () => clearTimeout(timer);
    }
  }, [
    appType,
    error,
    hasLedgerTransport,
    initLedgerTransport,
    prepareTransportForSolanaOnboarding,
    status,
    wasTransportAttempted,
  ]);

  const onRetry = useCallback(async () => {
    try {
      await popDeviceSelection();
      await initLedgerTransport();
      setStatus('waiting');
    } catch {
      setStatus('error');
      setError('unable-to-connect');
    }
  }, [popDeviceSelection, initLedgerTransport]);

  return {
    status,
    error,
    retrieveKeys,
    onRetry,
  };
};
