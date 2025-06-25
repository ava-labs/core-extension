import { FC, useState } from 'react';
import { Button, Stack, StackProps } from '@avalabs/k2-alpine';
import { useTranslation } from 'react-i18next';

import {
  OnboardingStepActions,
  OnboardingStepContent,
  OnboardingStepDescription,
  OnboardingStepTitle,
} from '@/components/OnboardingModal';

import * as Styled from './Styled';
import {
  type DerivationStatus,
  SolanaLedgerConnector,
} from './LedgerConnector';
import { DerivedKeys } from './LedgerConnector/types';

type ConnectionStepProps = StackProps & {
  onNext: (keys: DerivedKeys) => void;
  onTroubleshoot: () => void;
};

export const ConnectSolana: FC<ConnectionStepProps> = ({
  onNext,
  onTroubleshoot,
  ...stackProps
}) => {
  const { t } = useTranslation();

  const [status, setStatus] = useState<DerivationStatus>('error');
  const [derivedKeys, setDerivedKeys] = useState<DerivedKeys>({
    addressPublicKeys: [],
    extendedPublicKeys: [],
  });

  const isValid = derivedKeys.addressPublicKeys.length > 0;

  return (
    <Stack height="100%" width="100%" {...stackProps}>
      <OnboardingStepTitle>{t('Connect your Ledger')}</OnboardingStepTitle>
      <OnboardingStepDescription>
        {t('Open the Solana app on your Ledger device')}
      </OnboardingStepDescription>
      <OnboardingStepContent sx={{ gap: 3, alignItems: 'center' }}>
        <SolanaLedgerConnector
          onSuccess={setDerivedKeys}
          onTroubleshoot={onTroubleshoot}
          onStatusChange={setStatus}
          numberOfKeys={3}
        />
      </OnboardingStepContent>
      <OnboardingStepActions>
        {status === 'error' ? (
          <Stack width="100%" justifyContent="center" alignItems="center">
            <Styled.LedgerLiveButton>
              {t('Download Ledger Live to update')}
            </Styled.LedgerLiveButton>
          </Stack>
        ) : (
          <Button
            sx={{ minWidth: 150, alignSelf: 'flex-end' }}
            disabled={!isValid}
            variant="contained"
            color="primary"
            onClick={() => onNext(derivedKeys)}
          >
            {t('Next')}
          </Button>
        )}
      </OnboardingStepActions>
    </Stack>
  );
};
