import { FC, useCallback, useEffect, useState } from 'react';

import { Monitoring } from '@core/common';

import { LoadingScreen } from '@/pages/Onboarding/components/LoadingScreen';

import * as Styled from '../Styled';
import { ConnectorCallbacks, PublicKey } from '../../types';
import { useKeystoneBasePublicKeyFetcher } from './hooks';
import { KeystoneClickToConnectMessage } from './components/KeystoneClickToConnectMessage';
import { KeystoneApproveDeviceConnection } from './components/KeystoneApproveDeviceConnection';

type Props = {
  minNumberOfKeys: number;
  callbacks?: ConnectorCallbacks;
};

export const KeystoneUSBConnector: FC<Props> = ({
  callbacks,
  minNumberOfKeys,
}) => {
  const { status, error, onRetry, retrieveKeys } =
    useKeystoneBasePublicKeyFetcher(callbacks?.onActivePublicKeysDiscovered);
  const [keys, setKeys] = useState<PublicKey[]>([]);
  const [isRetrieving, setIsRetrieving] = useState(false);

  const fetchKeys = useCallback(async () => {
    setIsRetrieving(true);
    retrieveKeys(minNumberOfKeys)
      .then((retrievedKeys) => {
        setKeys(retrievedKeys.addressPublicKeys);
        callbacks?.onConnectionSuccess(retrievedKeys);
      })
      .catch((err) => {
        console.error('Failed to derive keys', err);
        Monitoring.sentryCaptureException(
          err,
          Monitoring.SentryExceptionTypes.KEYSTONE,
        );
        callbacks?.onConnectionFailed();
      })
      .finally(() => {
        setIsRetrieving(false);
      });
  }, [minNumberOfKeys, retrieveKeys, callbacks]);

  // Attempt to automatically connect as soon as we establish the transport.
  useEffect(() => {
    if (status === 'ready' && !keys.length && !isRetrieving) {
      fetchKeys();
    }
  }, [fetchKeys, status, keys, isRetrieving]);

  return (
    <>
      {status === 'needs-user-gesture' && (
        <KeystoneClickToConnectMessage
          onConnect={() => {
            callbacks?.onConnectionRetry();
            onRetry();
          }}
        />
      )}
      {status === 'waiting' && <LoadingScreen />}
      {status === 'ready' && !keys.length && (
        <KeystoneApproveDeviceConnection />
      )}
      {status === 'error' && error && (
        <Styled.KeystoneConnectionError
          errorType={error}
          onRetry={() => {
            callbacks?.onConnectionRetry();
            onRetry();
          }}
        />
      )}
    </>
  );
};
