import { DerivationPath } from '@avalabs/core-wallets-sdk';
import { useCallback, useEffect, useRef, useState } from 'react';

import { AddressPublicKeyJson, DerivationStatus } from '@core/types';
import {
  LedgerAppType,
  useActiveLedgerAppInfo,
  useLedgerContext,
} from '@core/ui';

import { ErrorType, PublicKey, UseLedgerPublicKeyFetcher } from '../../types';
import { buildAddressPublicKey } from '../../util';
import { classifyLedgerOnboardingError } from './classifyLedgerOnboardingError';

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
    prepareTransportForOnboarding,
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
        // Surface 'retrieval-failed' on the hook so the connector stops
        // seeing status='ready' and the auto-fetch effect doesn't loop.
        // The dedicated error type lets the hook's auto-connect effect
        // distinguish a retrieval failure (must not auto-recover) from a
        // transport/app-switch error (which can).
        setStatus('error');
        setError('retrieval-failed');
        throw err;
      }
    },
    [popDeviceSelection, getPublicKeyFromLedger, onActivePublicKeysDiscovered],
  );

  // Attempt to automatically connect as soon as we establish the transport.
  useEffect(() => {
    // Same guard as the Avalanche fetcher: never re-flip status back to
    // 'ready' from the SOLANA branch below when a retrieval has failed.
    if (
      error === 'duplicated-wallet' ||
      error === 'retrieval-failed' ||
      status === 'needs-user-gesture'
    ) {
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
      const switchPromise = prepareTransportForOnboarding(
        LedgerAppType.SOLANA,
      ).finally(() => {
        solanaSwitchInFlightRef.current = null;
      });
      solanaSwitchInFlightRef.current = switchPromise;

      switchPromise.catch((err: unknown) => {
        if (cancelled) {
          return;
        }
        setStatus('error');
        setError(classifyLedgerOnboardingError(err, LedgerAppType.SOLANA));
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
    prepareTransportForOnboarding,
    status,
    wasTransportAttempted,
  ]);

  const onRetry = useCallback(async () => {
    try {
      await popDeviceSelection();
      await initLedgerTransport();
      setError(undefined);
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
