import { useTranslation } from 'react-i18next';
import { useCallback, useEffect, useState } from 'react';
import { DerivationPath } from '@avalabs/core-wallets-sdk';
import {
  IconButton,
  OutboundIcon,
  Stack,
  truncateAddress,
  Typography,
} from '@avalabs/k2-alpine';

import { Section, SectionRow } from '@/pages/Onboarding/components/Section';

import {
  type PublicKey,
  PublicKeyEVM,
  useBasePublicKeys,
} from '../../../hooks/useBasePublicKeys';

import * as Styled from './Styled';

type LedgerConnectorProps = {
  onSuccess: (keys: PublicKey[]) => void;
  onStatusChange: (status: 'waiting' | 'ready' | 'error') => void;
  derivationPathSpec: DerivationPath;
  setDerivationPathSpec: (derivationPathSpec: DerivationPath) => void;
  numberOfKeys: number;
  onTroubleshoot: () => void;
};
export const LedgerConnector = ({
  onSuccess,
  onStatusChange,
  onTroubleshoot,
  numberOfKeys,
  derivationPathSpec,
  setDerivationPathSpec,
}: LedgerConnectorProps) => {
  const { t } = useTranslation();
  const { status, error, onRetry, retrieveKeys } =
    useBasePublicKeys(derivationPathSpec);
  const [keys, setKeys] = useState<PublicKey[]>([]);
  const [isRetrieving, setIsRetrieving] = useState(false);

  const fetchKeys = useCallback(async () => {
    const accountIndexes = Array.from({ length: numberOfKeys }, (_, i) => i);

    setIsRetrieving(true);
    retrieveKeys(accountIndexes)
      .then((retrievedKeys) => {
        setKeys(retrievedKeys);
        onSuccess(retrievedKeys);
      })
      .catch((err) => {
        console.error('Failed to derive keys', err);
      })
      .finally(() => {
        setIsRetrieving(false);
      });
  }, [numberOfKeys, retrieveKeys, onSuccess]);

  // Attempt to automatically connect as soon as we establish the transport.
  useEffect(() => {
    if (status === 'ready' && !keys.length && !isRetrieving) {
      fetchKeys();
    }
  }, [fetchKeys, status, keys, isRetrieving]);

  useEffect(() => {
    onStatusChange(status);
  }, [status, onStatusChange]);

  return (
    <>
      <Stack gap={3} width="100%">
        {status === 'ready' && (
          <>
            <Styled.DerivationPathSelector
              derivationPathSpec={derivationPathSpec}
              onSelect={(_derivationPathSpec) => {
                setDerivationPathSpec(_derivationPathSpec);
                setKeys([]);
                onStatusChange('waiting');
              }}
            />
            {keys.length === 0 ? (
              <Styled.ObtainedAddressesSkeleton count={numberOfKeys} />
            ) : (
              <Section>
                {keys
                  .filter((key): key is PublicKeyEVM => key.vm === 'EVM')
                  .map(({ key, address }, index) => (
                    <SectionRow
                      key={key.key}
                      sx={{
                        gap: 'unset',
                        alignItems: 'center',
                        justifyContent: 'space-between',
                        py: 0.25,
                      }}
                    >
                      <Stack direction="row" gap={1.5} alignItems="center">
                        <Typography variant="body2" color="text.secondary">
                          {index + 1}
                        </Typography>
                        <Typography variant="body2" color="text.primary">
                          {truncateAddress(address)}
                        </Typography>
                      </Stack>
                      <Stack direction="row" gap={1.5} alignItems="center">
                        <Typography variant="body2">$123,45.67</Typography>
                        <IconButton onClick={() => alert('lol')}>
                          <OutboundIcon />
                        </IconButton>
                      </Stack>
                    </SectionRow>
                  ))}
              </Section>
            )}
          </>
        )}
        {status === 'waiting' && (
          <>
            <Styled.DerivationPathSelectorSkeleton />
            <Styled.ObtainedAddressesSkeleton count={numberOfKeys} />
          </>
        )}
      </Stack>
      {status === 'error' && error && (
        <Styled.LedgerConnectionError
          errorType={error}
          onTroubleshoot={onTroubleshoot}
          onRetry={onRetry}
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
