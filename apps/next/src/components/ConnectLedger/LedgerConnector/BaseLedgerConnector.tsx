import { DerivationPath } from '@avalabs/core-wallets-sdk';
import { Stack } from '@avalabs/k2-alpine';
import { ComponentProps, FC, useCallback, useEffect, useState } from 'react';
import { useTranslation } from 'react-i18next';

import { DerivedAddresses } from '@/pages/Onboarding/components/DerivedAddresses';
import { sortBy } from 'lodash';
import * as Styled from '../Styled';
import {
  ConnectorCallbacks,
  DerivedKeys,
  PublicKey,
  UseLedgerPublicKeyFetcher,
} from './types';
import { LedgerAppType } from '@core/ui';
import { DerivationStatus } from '@core/types';

type CommonProps = {
  onSuccess: (keys: DerivedKeys) => void;
  onStatusChange: (status: DerivationStatus) => void;
  minNumberOfKeys: number;
  onTroubleshoot: () => void;
  deriveAddresses: (keys: PublicKey[]) => string[];
  derivedAddressesChainCaipId: string;
  useLedgerPublicKeyFetcher: UseLedgerPublicKeyFetcher;
  callbacks?: ConnectorCallbacks;
  requiredApp: LedgerAppType;
};

type PropsWithDerivationPathSpec = CommonProps & {
  derivationPathSpec: DerivationPath;
  setDerivationPathSpec: (derivationPathSpec: DerivationPath) => void;
};

type PropsWithoutDerivationPathSpec = CommonProps & {
  derivationPathSpec?: never;
  setDerivationPathSpec?: never;
};

type Props = (PropsWithDerivationPathSpec | PropsWithoutDerivationPathSpec) &
  LedgerConnectorOverrides;

export type LedgerConnectorOverrides = {
  overrides?: {
    PathSelector?: Pick<
      ComponentProps<typeof Styled.DerivationPathSelector>,
      'labels'
    >;
  };
};

const isWithDerivationPathSpec = (
  props: Props,
): props is PropsWithDerivationPathSpec =>
  'derivationPathSpec' in props &&
  'setDerivationPathSpec' in props &&
  props.derivationPathSpec !== undefined &&
  props.setDerivationPathSpec !== undefined;

const EMPTY_KEYS: PublicKey[] = [];

export const BaseLedgerConnector: FC<Props & LedgerConnectorOverrides> = (
  props,
) => {
  const {
    onSuccess,
    onStatusChange,
    onTroubleshoot,
    minNumberOfKeys,
    useLedgerPublicKeyFetcher,
    deriveAddresses,
    derivedAddressesChainCaipId,
    callbacks,
    requiredApp,
  } = props;
  const { t } = useTranslation();
  const [activePublicKeys, setActivePublicKeys] = useState<PublicKey[]>([]);
  const withDerivationPathSpec = isWithDerivationPathSpec(props);
  const { status, error, onRetry, duplicatedWalletName, retrieveKeys } =
    useLedgerPublicKeyFetcher(
      withDerivationPathSpec ? props.derivationPathSpec : undefined,
      (publicKeys) => setActivePublicKeys(sortBy(publicKeys, 'index')),
    );
  const [keys, setKeys] = useState<PublicKey[]>(EMPTY_KEYS);
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
    } else if (status === 'error') {
      setKeys(EMPTY_KEYS);
    }
  }, [fetchKeys, status, keys, isRetrieving]);

  useEffect(() => {
    onStatusChange(status);
  }, [status, onStatusChange]);

  const addresses = deriveAddresses(activePublicKeys);

  const isDuplicatedWalletError =
    status === 'error' && error === 'duplicated-wallet';

  return (
    <>
      <Stack gap={3} width="100%">
        {(status === 'ready' || isDuplicatedWalletError) && (
          <>
            {withDerivationPathSpec && (
              <Styled.DerivationPathSelector
                derivationPathSpec={props.derivationPathSpec}
                onSelect={(_derivationPathSpec) => {
                  props.setDerivationPathSpec(_derivationPathSpec);
                  setKeys([]);
                  onStatusChange('waiting');
                }}
                labels={props.overrides?.PathSelector?.labels}
              />
            )}
            {isDuplicatedWalletError ? null : addresses.length === 0 ? (
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
          duplicatedWalletName={duplicatedWalletName}
          requiredApp={requiredApp}
          onTroubleshoot={onTroubleshoot}
          onRetry={() => {
            if (isDuplicatedWalletError) {
              props.setDerivationPathSpec?.(
                props.derivationPathSpec === DerivationPath.BIP44
                  ? DerivationPath.LedgerLive
                  : DerivationPath.BIP44,
              );
              setKeys([]);
              onStatusChange('waiting');
            }

            callbacks?.onConnectionRetry();
            onRetry();
          }}
          retryLabel={
            isDuplicatedWalletError
              ? t('Connect with {{spec}} derivation paths', {
                  spec:
                    props.derivationPathSpec === DerivationPath.BIP44
                      ? 'Ledger Live'
                      : 'BIP44',
                })
              : t('Retry')
          }
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
