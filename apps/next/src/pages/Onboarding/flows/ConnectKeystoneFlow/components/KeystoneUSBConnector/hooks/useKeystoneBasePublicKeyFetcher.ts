import { ChainIDAlias } from '@keystonehq/hw-app-avalanche';
import { Status, TransportError } from '@keystonehq/hw-transport-error';
import { getAddressPublicKeyFromXPub } from '@avalabs/core-wallets-sdk';
import { useCallback, useEffect, useState } from 'react';

import { useKeystoneUsbContext } from '@core/ui';
import { EVM_BASE_DERIVATION_PATH } from '@core/types';
import { getAvalancheExtendedKeyPath } from '@core/common';

import {
  UsbDerivationStatus,
  ErrorType,
  PublicKey,
  UseKeystonePublicKeyFetcher,
} from '../../../types';
import { buildAddressPublicKey, buildExtendedPublicKey } from '../../../util';

export const useKeystoneBasePublicKeyFetcher: UseKeystonePublicKeyFetcher =
  () => {
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

    const getExtendedPublicKeys = useCallback(
      async (indexes: number[]) => {
        const xpExtendedPublicKeys: { index: number; key: string }[] = [];

        for (const index of indexes) {
          xpExtendedPublicKeys.push({
            index,
            key: await getExtendedPublicKey(ChainIDAlias.P, index),
          });
        }

        return {
          evm: await getExtendedPublicKey(ChainIDAlias.C, 0),
          xp: xpExtendedPublicKeys,
        };
      },
      [getExtendedPublicKey],
    );

    const getKeysFromExtendedPublicKeys = useCallback(
      async (indexes: number[]) => {
        const publicKeys: PublicKey[] = [];
        const { evm, xp: xpExtendedKeys } =
          await getExtendedPublicKeys(indexes);

        for (const index of indexes) {
          const evmKey = await getAddressPublicKeyFromXPub(evm, index);
          publicKeys.push({
            index,
            vm: 'EVM',
            key: buildAddressPublicKey(evmKey, index, 'EVM'),
          });
        }

        for (const { key: xpubXP, index } of xpExtendedKeys) {
          const addressPublicKey = await getAddressPublicKeyFromXPub(xpubXP, 0);

          publicKeys.push({
            index,
            vm: 'AVM',
            key: buildAddressPublicKey(addressPublicKey, index, 'AVM'),
          });
        }

        return {
          masterFingerprint: await getMasterFingerprint(),
          extendedPublicKeys: [
            buildExtendedPublicKey(evm, EVM_BASE_DERIVATION_PATH),
            ...xpExtendedKeys.map(({ key, index }) =>
              buildExtendedPublicKey(key, getAvalancheExtendedKeyPath(index)),
            ),
          ],
          addressPublicKeys: publicKeys,
        };
      },
      [getExtendedPublicKeys, getMasterFingerprint],
    );

    const retrieveKeys = useCallback(
      async (indexes: number[]) => {
        try {
          return await getKeysFromExtendedPublicKeys(indexes);
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
      [getKeysFromExtendedPublicKeys, setError, setStatus],
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
        popDeviceSelection();
        initKeystoneTransport();
      } else if (!hasKeystoneTransport) {
        const timer = setTimeout(() => {
          setStatus('error');
          setError('unable-to-connect');
        }, 20_000); // Give the user 20 seconds to connect their keystone, then show an error message with some instructions

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
