import { FC, useEffect, useMemo, useState } from 'react';
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

  const errorMessages: Record<ErrorType, string> = useMemo(
    () => ({
      'incorrect-app': t(
        'Please switch to the Solana app on your Ledger device to continue.',
      ),
      'no-app': t('Please open the Solana app on your Ledger to continue.'),
      'device-locked': t(
        'Please unlock your Ledger and open the Solana app to continue.',
      ),
      'unable-to-connect': t('Open the Solana app on your Ledger device'),
      'unsupported-version': t('Open the Solana app on your Ledger device'),
      'duplicated-wallet': t('Open the Solana app on your Ledger device'),
    }),
    [t],
  );

  const defaultDescription = t('Open the Solana app on your Ledger device');
  const description =
    status === 'error' && error ? errorMessages[error] : defaultDescription;

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
      <FullscreenModalDescription>{description}</FullscreenModalDescription>
      <FullscreenModalContent sx={{ gap: 3, alignItems: 'center' }}>
        <SolanaLedgerConnector
          callbacks={connectorCallbacks}
          onSuccess={setDerivedKeys}
          onTroubleshoot={onTroubleshoot}
          onStatusChange={setStatus}
          onErrorChange={setError}
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
