import { hex } from '@scure/base';
import { useCallback, useEffect, useState } from 'react';
import { DerivationPath } from '@avalabs/core-wallets-sdk';

import { LedgerAppType, useLedgerContext } from '../contexts';
import { DerivationStatus } from '@core/types';

export const useSolanaPublicKeys = () => {
  const {
    appType,
    popDeviceSelection,
    hasLedgerTransport,
    wasTransportAttempted,
    initLedgerTransport,
    getPublicKey,
  } = useLedgerContext();

  const [status, setStatus] = useState<DerivationStatus>('waiting');

  const getPublicKeyFromLedger = useCallback(
    async (accountIndex: number) => {
      const publicKey = await getPublicKey(
        accountIndex,
        DerivationPath.LedgerLive, // Irrelevant really, for Solana we're only supporting one derivation path spec
        'SVM',
      );

      return {
        index: accountIndex,
        key: hex.encode(Uint8Array.from(publicKey)),
      };
    },
    [getPublicKey],
  );

  useEffect(() => {
    initLedgerTransport();
  }, [initLedgerTransport]);

  const retrieveKeys = useCallback(
    async (indexes: number[]) => {
      try {
        const keys: { index: number; key: string }[] = [];

        for (const index of indexes) {
          const key = await getPublicKeyFromLedger(index);
          keys.push(key);
        }

        return keys;
      } catch (err) {
        console.error(err);
        popDeviceSelection();
        throw err;
      }
    },
    [popDeviceSelection, getPublicKeyFromLedger],
  );

  // Attempt to automatically connect as soon as we establish the transport.
  useEffect(() => {
    if (hasLedgerTransport && status === 'waiting') {
      setStatus(appType === LedgerAppType.SOLANA ? 'ready' : 'waiting');
    } else if (!hasLedgerTransport && !wasTransportAttempted) {
      initLedgerTransport();
    }
  }, [
    appType,
    hasLedgerTransport,
    initLedgerTransport,
    status,
    retrieveKeys,
    wasTransportAttempted,
  ]);

  return {
    status,
    retrieveKeys,
  };
};
