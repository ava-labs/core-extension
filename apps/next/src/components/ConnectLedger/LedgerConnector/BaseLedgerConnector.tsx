import { DerivationPath } from '@avalabs/core-wallets-sdk';
import { Stack } from '@avalabs/k2-alpine';
import {
  ComponentProps,
  FC,
  useCallback,
  useEffect,
  useRef,
  useState,
} from 'react';
import { useTranslation } from 'react-i18next';

import { DerivedAddresses } from '@/pages/Onboarding/components/DerivedAddresses';
import { sortBy } from 'lodash';
import * as Styled from '../Styled';
import {
  ConnectorCallbacks,
  DerivedAccountInfo,
  DerivedKeys,
  ErrorType,
  PublicKey,
  UseLedgerPublicKeyFetcher,
  WalletExistsError,
} from './types';
import { LedgerAppType } from '@core/ui';
import { DerivationStatus } from '@core/types';
import { Monitoring } from '@core/common';

type CommonProps = {
  onSuccess: (keys: DerivedKeys) => void;
  onStatusChange: (status: DerivationStatus) => void;
  onErrorChange?: (error?: ErrorType) => void;
  minNumberOfKeys: number;
  onTroubleshoot: () => void;
  deriveAddresses: (keys: PublicKey[]) => DerivedAccountInfo[];
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
    onErrorChange,
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
  // Identifier for the in-flight fetchKeys attempt. resetFetchState and each
  // new fetch bump this counter so the .then/.catch/.finally of an obsolete
  // attempt can detect it is stale and skip its state updates. Otherwise an
  // old promise can clobber freshly-reset state (e.g. selecting a new
  // derivation path while the previous fetch is still pending).
  const attemptIdRef = useRef(0);

  const resetFetchState = useCallback(() => {
    attemptIdRef.current += 1;
    setKeys(EMPTY_KEYS);
  }, []);

  const fetchKeys = useCallback(async () => {
    attemptIdRef.current += 1;
    const myAttemptId = attemptIdRef.current;
    const isCurrent = () => attemptIdRef.current === myAttemptId;
    setIsRetrieving(true);
    retrieveKeys(minNumberOfKeys)
      .then((retrievedKeys) => {
        if (!isCurrent()) return;
        setKeys(retrievedKeys.addressPublicKeys);
        onSuccess(retrievedKeys);
        callbacks?.onConnectionSuccess();
      })
      .catch((err: unknown) => {
        if (!isCurrent()) return;
        const normalizedError =
          err instanceof Error ? err : new Error(String(err));
        if (!(normalizedError instanceof WalletExistsError)) {
          Monitoring.sentryCaptureException(
            normalizedError,
            Monitoring.SentryExceptionTypes.LEDGER,
          );
        }
        console.error('Failed to derive keys', normalizedError);
        callbacks?.onConnectionFailed(normalizedError);
      })
      .finally(() => {
        if (!isCurrent()) return;
        setIsRetrieving(false);
      });
  }, [minNumberOfKeys, retrieveKeys, onSuccess, callbacks]);

  const handleManualRetry = useCallback(() => {
    resetFetchState();
    callbacks?.onConnectionRetry();
    onRetry();
  }, [resetFetchState, callbacks, onRetry]);

  // Attempt to automatically connect as soon as we establish the transport.
  // A retrieval failure flips status to 'error' inside the hook, so this
  // effect naturally stops firing. No extra connector-side gating needed
  // (CP-14241).
  useEffect(() => {
    if (status === 'ready' && !keys.length && !isRetrieving) {
      fetchKeys();
    } else if (status === 'error') {
      resetFetchState();
    }
  }, [fetchKeys, status, keys, isRetrieving, resetFetchState]);

  useEffect(() => {
    onStatusChange(status);
  }, [status, onStatusChange]);

  useEffect(() => {
    onErrorChange?.(error);
  }, [error, onErrorChange]);

  const accounts = deriveAddresses(activePublicKeys);

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
                  resetFetchState();
                  onStatusChange('waiting');
                }}
                labels={props.overrides?.PathSelector?.labels}
              />
            )}
            {isDuplicatedWalletError ? null : accounts.length === 0 ? (
              <Styled.ObtainedAddressesSkeleton count={minNumberOfKeys} />
            ) : (
              <DerivedAddresses
                accounts={accounts}
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
        <Styled.LedgerClickToConnectMessage onConnect={handleManualRetry} />
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
              onStatusChange('waiting');
            }

            handleManualRetry();
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
