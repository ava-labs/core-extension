import { FC, useEffect, useState } from 'react';
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
import {
  type DerivationStatus,
  SolanaLedgerConnector,
} from './LedgerConnector';
import { ConnectorCallbacks, DerivedKeys } from './LedgerConnector/types';

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
  const [derivedKeys, setDerivedKeys] = useState<DerivedKeys>({
    addressPublicKeys: [],
    extendedPublicKeys: [],
  });

  const isValid = derivedKeys.addressPublicKeys.length > 0;

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
        {t('Open the Solana app on your Ledger device')}
      </FullscreenModalDescription>
      <FullscreenModalContent sx={{ gap: 3, alignItems: 'center' }}>
        <SolanaLedgerConnector
          callbacks={connectorCallbacks}
          onSuccess={setDerivedKeys}
          onTroubleshoot={onTroubleshoot}
          onStatusChange={setStatus}
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
