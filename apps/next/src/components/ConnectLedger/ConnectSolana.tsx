import { FC, useCallback, useEffect, useState } from 'react';
import { Stack, StackProps } from '@avalabs/k2-alpine';
import { useTranslation } from 'react-i18next';

import {
  FullscreenModalActions,
  FullscreenModalContent,
  FullscreenModalDescription,
  FullscreenModalTitle,
} from '@/components/FullscreenModal';
import { NavButton } from '@/pages/Onboarding/components/NavButton';

import * as Styled from './Styled';
import { SolanaLedgerConnector } from './LedgerConnector';
import {
  ConnectorCallbacks,
  DerivedKeys,
  ErrorType,
} from './LedgerConnector/types';
import { DerivationStatus } from '@core/types';

type ConnectionStepProps = StackProps & {
  onNext: (keys: DerivedKeys) => void;
  onTroubleshoot: () => void;
  connectorCallbacks?: ConnectorCallbacks;
  numberOfKeys: number;
};

export const ConnectSolana: FC<ConnectionStepProps> = ({
  numberOfKeys,
  onNext,
  onTroubleshoot,
  connectorCallbacks,
  ...stackProps
}) => {
  const { t } = useTranslation();

  const [status, setStatus] = useState<DerivationStatus>('error');
  const [error, setError] = useState<ErrorType>();
  const [derivedKeys, setDerivedKeys] = useState<DerivedKeys>({
    addressPublicKeys: [],
    extendedPublicKeys: [],
  });

  const isValid = derivedKeys.addressPublicKeys.length > 0;
  const onErrorChange = useCallback((err?: ErrorType) => setError(err), []);

  useEffect(() => {
    if (status === 'error') {
      setDerivedKeys({
        addressPublicKeys: [],
        extendedPublicKeys: [],
      });
    }
  }, [status]);

  return (
    <Stack height="100%" width="100%" {...stackProps}>
      <FullscreenModalTitle>{t('Connect your Ledger')}</FullscreenModalTitle>
      <FullscreenModalDescription>
        {status === 'error' && error === 'incorrect-app'
          ? t(
              'Please switch to the Solana app on your Ledger device to continue.',
            )
          : status === 'error' && error === 'no-app'
            ? t('Please open the Solana app on your Ledger to continue.')
            : status === 'error' && error === 'device-locked'
              ? t(
                  'Please unlock your Ledger and open the Solana app to continue.',
                )
              : t('Open the Solana app on your Ledger device')}
      </FullscreenModalDescription>
      <FullscreenModalContent sx={{ gap: 3, alignItems: 'center' }}>
        <SolanaLedgerConnector
          callbacks={connectorCallbacks}
          onSuccess={setDerivedKeys}
          onTroubleshoot={onTroubleshoot}
          onStatusChange={setStatus}
          onErrorChange={onErrorChange}
          minNumberOfKeys={numberOfKeys}
        />
      </FullscreenModalContent>
      <FullscreenModalActions>
        {status === 'error' ? (
          <Stack width="100%" justifyContent="center" alignItems="center">
            <Styled.LedgerLiveButton>
              {t('Download Ledger Live to update')}
            </Styled.LedgerLiveButton>
          </Stack>
        ) : (
          <NavButton
            disabled={!isValid}
            color="primary"
            onClick={() => onNext(derivedKeys)}
          >
            {t('Next')}
          </NavButton>
        )}
      </FullscreenModalActions>
    </Stack>
  );
};
