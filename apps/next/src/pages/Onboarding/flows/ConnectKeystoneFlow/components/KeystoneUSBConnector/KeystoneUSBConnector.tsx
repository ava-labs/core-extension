import { FC, useCallback, useEffect, useState } from 'react';

import { LoadingScreen } from '@/pages/Onboarding/components/LoadingScreen';

import * as Styled from '../Styled';
import { ConnectorCallbacks, PublicKey } from '../../types';
import { useKeystoneBasePublicKeyFetcher } from './hooks';

type Props = {
  accountIndexes: number[];
  callbacks?: ConnectorCallbacks;
};

export const KeystoneUSBConnector: FC<Props> = ({
  callbacks,
  accountIndexes,
}) => {
  const { status, error, onRetry, retrieveKeys } =
    useKeystoneBasePublicKeyFetcher();
  const [keys, setKeys] = useState<PublicKey[]>([]);
  const [isRetrieving, setIsRetrieving] = useState(false);

  const fetchKeys = useCallback(async () => {
    setIsRetrieving(true);
    retrieveKeys(accountIndexes)
      .then((retrievedKeys) => {
        setKeys(retrievedKeys.addressPublicKeys);
        callbacks?.onConnectionSuccess(retrievedKeys);
      })
      .catch((err) => {
        console.error('Failed to derive keys', err);
        callbacks?.onConnectionFailed();
      })
      .finally(() => {
        setIsRetrieving(false);
      });
  }, [accountIndexes, retrieveKeys, callbacks]);

  // Attempt to automatically connect as soon as we establish the transport.
  useEffect(() => {
    if (status === 'ready' && !keys.length && !isRetrieving) {
      fetchKeys();
    }
  }, [fetchKeys, status, keys, isRetrieving]);

  return (
    <>
      {status !== 'error' || !error ? (
        <LoadingScreen />
      ) : (
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
