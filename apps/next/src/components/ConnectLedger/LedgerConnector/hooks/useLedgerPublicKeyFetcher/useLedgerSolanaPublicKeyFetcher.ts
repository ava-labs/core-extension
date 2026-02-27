import { DerivationPath } from '@avalabs/core-wallets-sdk';
import { useCallback, useEffect, useState } from 'react';

import { AddressPublicKeyJson, DerivationStatus } from '@core/types';
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
  } = useLedgerContext();
  const { appType } = useActiveLedgerAppInfo(true);

  const [error, setError] = useState<ErrorType>();
  const [status, setStatus] = useState<DerivationStatus>('waiting');

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
    if (hasLedgerTransport) {
      if (appType === LedgerAppType.SOLANA) {
        setStatus('ready');
        setError(undefined);
      } else if (appType === LedgerAppType.DASHBOARD) {
        // Device is unlocked but sitting on the dashboard with no app open.
        setStatus('error');
        setError('no-app');
      } else if (appType === LedgerAppType.UNKNOWN) {
        // Device is likely locked or unresponsive.
        setStatus('error');
        setError('device-locked');
      } else {
        // A known non-Solana app is open — prompt the user to switch.
        setStatus('error');
        setError('incorrect-app');
      }
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
    hasLedgerTransport,
    initLedgerTransport,
    status,
    retrieveKeys,
    wasTransportAttempted,
    popDeviceSelection,
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
