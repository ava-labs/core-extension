import { useTranslation } from 'react-i18next';
import { FC, useCallback, useEffect, useMemo, useState } from 'react';
import { DerivationPath } from '@avalabs/core-wallets-sdk';
import { Stack } from '@avalabs/k2-alpine';

import * as Styled from '../Styled';
import { DerivedAddresses } from '../DerivedAddresses';
import {
  ConnectorCallbacks,
  DerivedKeys,
  PublicKey,
  UseLedgerPublicKeyFetcher,
} from './types';

type CommonProps = {
  onSuccess: (keys: DerivedKeys) => void;
  onStatusChange: (status: 'waiting' | 'ready' | 'error') => void;
  numberOfKeys: number;
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
    numberOfKeys,
    useLedgerPublicKeyFetcher,
    deriveAddresses,
    derivedAddressesChainCaipId,
    callbacks,
  } = props;
  const { t } = useTranslation();
  const withDerivationPathSpec = isWithDerivationPathSpec(props);
  const { status, error, onRetry, retrieveKeys } = useLedgerPublicKeyFetcher(
    withDerivationPathSpec ? props.derivationPathSpec : undefined,
  );
  const [keys, setKeys] = useState<PublicKey[]>([]);
  const [isRetrieving, setIsRetrieving] = useState(false);

  const fetchKeys = useCallback(async () => {
    const accountIndexes = Array.from({ length: numberOfKeys }, (_, i) => i);

    setIsRetrieving(true);
    retrieveKeys(accountIndexes)
      .then((retrievedKeys) => {
        setKeys(retrievedKeys.addressPublicKeys);
        onSuccess(retrievedKeys);
        callbacks?.onConnectionSuccess();
      })
      .catch((err) => {
        console.error('Failed to derive keys', err);
        callbacks?.onConnectionFailed();
      })
      .finally(() => {
        setIsRetrieving(false);
      });
  }, [numberOfKeys, retrieveKeys, onSuccess, callbacks]);

  // Attempt to automatically connect as soon as we establish the transport.
  useEffect(() => {
    if (status === 'ready' && !keys.length && !isRetrieving) {
      fetchKeys();
    }
  }, [fetchKeys, status, keys, isRetrieving]);

  useEffect(() => {
    onStatusChange(status);
  }, [status, onStatusChange]);

  const addresses = useMemo(
    () => deriveAddresses(keys),
    [deriveAddresses, keys],
  );

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
            {keys.length === 0 ? (
              <Styled.ObtainedAddressesSkeleton count={numberOfKeys} />
            ) : (
              <DerivedAddresses
                addresses={addresses}
                chainCaipId={derivedAddressesChainCaipId}
              />
            )}
          </>
        )}
        {status === 'waiting' && (
          <>
            {withDerivationPathSpec && (
              <Styled.DerivationPathSelectorSkeleton />
            )}
            <Styled.ObtainedAddressesSkeleton count={numberOfKeys} />
          </>
        )}
      </Stack>
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
