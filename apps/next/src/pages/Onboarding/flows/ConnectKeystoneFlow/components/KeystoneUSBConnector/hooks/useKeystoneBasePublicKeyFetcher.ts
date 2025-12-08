import { ChainIDAlias } from '@keystonehq/hw-app-avalanche';
import { Status, TransportError } from '@keystonehq/hw-transport-error';
import { getAddressPublicKeyFromXPub } from '@avalabs/core-wallets-sdk';
import { useCallback, useEffect, useState } from 'react';

import { useKeystoneUsbContext } from '@core/ui';
import { EVM_BASE_DERIVATION_PATH, ExtendedPublicKey } from '@core/types';
import { getAvalancheExtendedKeyPath } from '@core/common';

import { MAX_ACCOUNTS_TO_CREATE } from '@/config/onboarding';
import { useCheckAddressActivity } from '@/hooks/useCheckAddressActivity';

import {
  UsbDerivationStatus,
  ErrorType,
  PublicKey,
  UseKeystonePublicKeyFetcher,
} from '../../../types';
import { buildAddressPublicKey, buildExtendedPublicKey } from '../../../util';

export const useKeystoneBasePublicKeyFetcher: UseKeystonePublicKeyFetcher = (
  onActivePublicKeysDiscovered,
) => {
  const {
    getMasterFingerprint,
    hasKeystoneTransport,
    initKeystoneTransport,
    popDeviceSelection,
    wasTransportAttempted,
    getExtendedPublicKey,
  } = useKeystoneUsbContext();

  const [error, setError] = useState<ErrorType>();
  const [status, setStatus] = useState<UsbDerivationStatus>('waiting');
  const checkAddressActivity = useCheckAddressActivity();

  const retrieveXpKeys = useCallback(
    async (indexes: number[]) => {
      const addressPublicKeys: PublicKey[] = [];
      const extendedPublicKeys: ExtendedPublicKey[] = [];

      for (const index of indexes) {
        const extendedPublicKey = buildExtendedPublicKey(
          await getExtendedPublicKey(ChainIDAlias.P, index),
          getAvalancheExtendedKeyPath(index),
        );
        extendedPublicKeys.push(extendedPublicKey);
        addressPublicKeys.push({
          index,
          vm: 'AVM',
          key: buildAddressPublicKey(
            await getAddressPublicKeyFromXPub(extendedPublicKey.key, 0),
            index,
            'AVM',
          ),
        });
      }

      return {
        extendedPublicKeys,
        addressPublicKeys,
      };
    },
    [getExtendedPublicKey],
  );

  const getAddressPublicKeyFromXpub = useCallback(
    async (xpub: string, index: number): Promise<PublicKey> => {
      const evmKey = await getAddressPublicKeyFromXPub(xpub, index);

      return {
        index,
        vm: 'EVM',
        key: buildAddressPublicKey(evmKey, index, 'EVM'),
        hasActivity: await checkAddressActivity(evmKey).catch(() => false),
      };
    },
    [checkAddressActivity],
  );

  const shouldContinue = useCallback((evmPublicKeys: PublicKey[]) => {
    // Do not derive more than 10.
    if (evmPublicKeys.length >= MAX_ACCOUNTS_TO_CREATE) {
      return false;
    }

    // If one of the last two addresses has activity, we need to continue looking
    return evmPublicKeys.slice(-2).some(({ hasActivity }) => hasActivity);
  }, []);

  const retrieveEvmKeys = useCallback(
    async (startingIndexes: number[]) => {
      const minNumberOfKeys = startingIndexes.length;
      const evmXpub = await getExtendedPublicKey(ChainIDAlias.C, 0);
      const publicKeys: PublicKey[] = [];

      for (const index of startingIndexes) {
        const publicKey = await getAddressPublicKeyFromXpub(evmXpub, index);
        publicKeys.push(publicKey);
      }

      onActivePublicKeysDiscovered?.(publicKeys);

      let currentIndex = startingIndexes.at(-1)!;

      while (shouldContinue(publicKeys)) {
        const publicKey = await getAddressPublicKeyFromXpub(
          evmXpub,
          ++currentIndex,
        );
        publicKeys.push(publicKey);
        if (publicKey.hasActivity) {
          onActivePublicKeysDiscovered?.(publicKeys);
        }
      }

      // Remove trailing public keys if they do not have activity
      while (
        publicKeys.length > minNumberOfKeys &&
        !publicKeys.at(-1)?.hasActivity
      ) {
        publicKeys.pop();
      }

      return {
        extendedPublicKeys: [
          buildExtendedPublicKey(evmXpub, EVM_BASE_DERIVATION_PATH),
        ],
        addressPublicKeys: publicKeys,
      };
    },
    [
      getAddressPublicKeyFromXpub,
      shouldContinue,
      getExtendedPublicKey,
      onActivePublicKeysDiscovered,
    ],
  );

  const retrieveKeys = useCallback(
    async (minNumberOfKeys: number) => {
      if (minNumberOfKeys < 1) {
        throw new Error('Min number of keys must be greater than 0');
      }

      const startingIndexes = Array.from(
        { length: minNumberOfKeys },
        (_, i) => i,
      );

      try {
        const {
          addressPublicKeys: evmAddressPublicKeys,
          extendedPublicKeys: evmExtendedPublicKeys,
        } = await retrieveEvmKeys(startingIndexes);

        const xpIndexes = evmAddressPublicKeys.map(({ index }) => index);

        const {
          addressPublicKeys: xpAddressPublicKeys,
          extendedPublicKeys: xpExtendedPublicKeys,
        } = await retrieveXpKeys(xpIndexes);

        return {
          masterFingerprint: await getMasterFingerprint(),
          addressPublicKeys: [...evmAddressPublicKeys, ...xpAddressPublicKeys],
          extendedPublicKeys: [
            ...evmExtendedPublicKeys,
            ...xpExtendedPublicKeys,
          ],
        };
      } catch (err) {
        setStatus('error');

        if (isUserRejectedError(err)) {
          setError('user-rejected');
        } else {
          setError('unable-to-connect');
        }

        throw err;
      }
    },
    [
      setError,
      setStatus,
      getMasterFingerprint,
      retrieveEvmKeys,
      retrieveXpKeys,
    ],
  );

  useEffect(() => {
    // If the user previously rejected the request to connect,
    // do not attempt to connect again unless they retry manually.
    if (error == 'user-rejected') {
      return;
    }

    // Attempt to automatically connect as soon as we establish the transport.
    if (hasKeystoneTransport) {
      setStatus('ready');
      setError(undefined);
    } else if (!hasKeystoneTransport && !wasTransportAttempted) {
      popDeviceSelection().then(initKeystoneTransport);
    } else if (!hasKeystoneTransport) {
      const timer = setTimeout(() => {
        setStatus('error');
        setError('unable-to-connect');
      }, 5_000); // Wait 5 seconds to obtain the connection, then show an error message with some instructions

      return () => clearTimeout(timer);
    }
  }, [
    error,
    status,
    retrieveKeys,
    wasTransportAttempted,
    hasKeystoneTransport,
    initKeystoneTransport,
    popDeviceSelection,
  ]);

  const onRetry = useCallback(async () => {
    try {
      await popDeviceSelection();
      await initKeystoneTransport();
      setError(undefined);
      setStatus('waiting');
    } catch {
      setStatus('error');
      setError('unable-to-connect');
    }
  }, [popDeviceSelection, initKeystoneTransport]);

  return {
    status,
    error,
    retrieveKeys,
    onRetry,
  };
};

const isUserRejectedError = (err: unknown) => {
  return (
    !!err &&
    err instanceof TransportError &&
    err.transportErrorCode === Status.PRS_PARSING_REJECTED
  );
};
