import { useTranslation } from 'react-i18next';
import { FC, useCallback, useEffect, useState } from 'react';
import { DerivationPath } from '@avalabs/core-wallets-sdk';
import { Stack } from '@avalabs/k2-alpine';

import { DerivedAddresses } from '@/pages/Onboarding/components/DerivedAddresses';
import * as Styled from '../Styled';
import {
  ConnectorCallbacks,
  DerivedKeys,
  PublicKey,
  UseLedgerPublicKeyFetcher,
} from './types';
import { sortBy } from 'lodash';

type CommonProps = {
  onSuccess: (keys: DerivedKeys) => void;
  onStatusChange: (
    status: 'waiting' | 'ready' | 'error' | 'needs-user-gesture',
  ) => void;
  minNumberOfKeys: number;
  onTroubleshoot: () => void;
  deriveAddresses: (keys: PublicKey[]) => string[];
  derivedAddressesChainCaipId: string;
  useLedgerPublicKeyFetcher: UseLedgerPublicKeyFetcher;
  callbacks?: ConnectorCallbacks;
};

type PropsWithDerivationPathSpec = CommonProps & {
  derivationPathSpec: DerivationPath;
  setDerivationPathSpec: (derivationPathSpec: DerivationPath) => void;
};

type PropsWithoutDerivationPathSpec = CommonProps & {
  derivationPathSpec?: never;
  setDerivationPathSpec?: never;
};

type Props = PropsWithDerivationPathSpec | PropsWithoutDerivationPathSpec;

const isWithDerivationPathSpec = (
  props: Props,
): props is PropsWithDerivationPathSpec =>
  'derivationPathSpec' in props &&
  'setDerivationPathSpec' in props &&
  props.derivationPathSpec !== undefined &&
  props.setDerivationPathSpec !== undefined;

export const BaseLedgerConnector: FC<Props> = (props) => {
  const {
    onSuccess,
    onStatusChange,
    onTroubleshoot,
    minNumberOfKeys,
    useLedgerPublicKeyFetcher,
    deriveAddresses,
    derivedAddressesChainCaipId,
    callbacks,
  } = props;
  const { t } = useTranslation();
  const [activePublicKeys, setActivePublicKeys] = useState<PublicKey[]>([]);
  const withDerivationPathSpec = isWithDerivationPathSpec(props);
  const { status, error, onRetry, retrieveKeys } = useLedgerPublicKeyFetcher(
    withDerivationPathSpec ? props.derivationPathSpec : undefined,
    (publicKeys) => setActivePublicKeys(sortBy(publicKeys, 'index')),
  );
  const [keys, setKeys] = useState<PublicKey[]>([]);
  const [isRetrieving, setIsRetrieving] = useState(false);

  const fetchKeys = useCallback(async () => {
    setIsRetrieving(true);
    retrieveKeys(minNumberOfKeys)
      .then((retrievedKeys) => {
        setKeys(retrievedKeys.addressPublicKeys);
        onSuccess(retrievedKeys);
        callbacks?.onConnectionSuccess();
      })
      .catch((err) => {
        console.error('Failed to derive keys', err);
        callbacks?.onConnectionFailed(err);
      })
      .finally(() => {
        setIsRetrieving(false);
      });
  }, [minNumberOfKeys, retrieveKeys, onSuccess, callbacks]);

  // Attempt to automatically connect as soon as we establish the transport.
  useEffect(() => {
    if (status === 'ready' && !keys.length && !isRetrieving) {
      fetchKeys();
    }
  }, [fetchKeys, status, keys, isRetrieving]);

  useEffect(() => {
    onStatusChange(status);
  }, [status, onStatusChange]);

  const addresses = deriveAddresses(activePublicKeys);

  return (
    <>
      <Stack gap={3} width="100%">
        {status === 'ready' && (
          <>
            {withDerivationPathSpec && (
              <Styled.DerivationPathSelector
                derivationPathSpec={props.derivationPathSpec}
                onSelect={(_derivationPathSpec) => {
                  props.setDerivationPathSpec(_derivationPathSpec);
                  setKeys([]);
                  onStatusChange('waiting');
                }}
              />
            )}
            {addresses.length === 0 ? (
              <Styled.ObtainedAddressesSkeleton count={minNumberOfKeys} />
            ) : (
              <DerivedAddresses
                addresses={addresses}
                chainCaipId={derivedAddressesChainCaipId}
                addLoadingRow={isRetrieving}
              />
            )}
          </>
        )}
        {status === 'waiting' && (
          <>
            {withDerivationPathSpec && (
              <Styled.DerivationPathSelectorSkeleton />
            )}
            <Styled.ObtainedAddressesSkeleton count={minNumberOfKeys} />
          </>
        )}
      </Stack>
      {status === 'needs-user-gesture' && (
        <Styled.LedgerClickToConnectMessage
          onConnect={() => {
            callbacks?.onConnectionRetry();
            onRetry();
          }}
        />
      )}
      {status === 'error' && error && (
        <Styled.LedgerConnectionError
          errorType={error}
          onTroubleshoot={onTroubleshoot}
          onRetry={() => {
            callbacks?.onConnectionRetry();
            onRetry();
          }}
        />
      )}
      {status !== 'error' && (
        <Styled.LedgerLiveButton>
          {t('Ledger live support')}
        </Styled.LedgerLiveButton>
      )}
    </>
  );
};
