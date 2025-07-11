import { ChainIDAlias } from '@keystonehq/hw-app-avalanche';
import { Status, TransportError } from '@keystonehq/hw-transport-error';
import { getAddressPublicKeyFromXPub } from '@avalabs/core-wallets-sdk';
import { useCallback, useEffect, useState } from 'react';

import { useKeystoneUsbContext } from '@core/ui';
import {
  AVALANCHE_BASE_DERIVATION_PATH,
  EVM_BASE_DERIVATION_PATH,
} from '@core/types';

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

    const getKeysFromExtendedPublicKeys = useCallback(
      async (indexes: number[]) => {
        const evmExtendedPublicKey = await getExtendedPublicKey(ChainIDAlias.C);
        const xpExtendedPublicKey = await getExtendedPublicKey(ChainIDAlias.X);

        const keys: PublicKey[] = [];

        for (const index of indexes) {
          const evmKey = await getAddressPublicKeyFromXPub(
            evmExtendedPublicKey,
            index,
          );
          keys.push({
            index,
            vm: 'EVM',
            key: buildAddressPublicKey(evmKey, index, 'EVM'),
          });

          const xpKey = await getAddressPublicKeyFromXPub(
            xpExtendedPublicKey,
            index,
          );
          keys.push({
            index,
            vm: 'AVM',
            key: buildAddressPublicKey(xpKey, index, 'AVM'),
          });
        }

        return {
          masterFingerprint: await getMasterFingerprint(),
          extendedPublicKeys: [
            buildExtendedPublicKey(
              evmExtendedPublicKey,
              EVM_BASE_DERIVATION_PATH,
            ),
            buildExtendedPublicKey(
              xpExtendedPublicKey,
              AVALANCHE_BASE_DERIVATION_PATH,
            ),
          ],
          addressPublicKeys: keys,
        };
      },
      [getExtendedPublicKey, getMasterFingerprint],
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
        popDeviceSelection().then(initKeystoneTransport);
      } else if (!hasKeystoneTransport) {
        const timer = setTimeout(() => {
          setStatus('error');
          setError('unable-to-connect');
        }, 2_000); // Give the user 20 seconds to connect their keystone, then show an error message with some instructions

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
