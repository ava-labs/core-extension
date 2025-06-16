import { FC, useState } from 'react';
import { Button } from '@avalabs/k2-alpine';
import { useTranslation } from 'react-i18next';
import { DerivationPath } from '@avalabs/core-wallets-sdk';

import {
  OnboardingStepActions,
  OnboardingStepContent,
  OnboardingStepDescription,
  OnboardingStepTitle,
} from '@/components/OnboardingModal';

import { type DerivationStatus } from '../../../hooks/useBasePublicKeys';

import * as Styled from './Styled';
import { LedgerConnector } from './LedgerConnector';

type ConnectionStepProps = {
  onNext: () => void;
  onTroubleshoot: () => void;
};
export const ConnectAvalanche: FC<ConnectionStepProps> = ({
  onNext,
  onTroubleshoot,
}) => {
  const { t } = useTranslation();

  const [status, setStatus] = useState<DerivationStatus>('error');
  const [derivationPathSpec, setDerivationPathSpec] = useState<DerivationPath>(
    DerivationPath.BIP44,
  );

  console.log('derivationPath', derivationPathSpec);
  return (
    <>
      <OnboardingStepTitle>{t('Connect your Ledger')}</OnboardingStepTitle>
      <OnboardingStepDescription>
        {t('Select the derivation path type to see your derived addresses')}
      </OnboardingStepDescription>
      <OnboardingStepContent sx={{ gap: 3, alignItems: 'center' }}>
        <LedgerConnector
          onSuccess={(keys) => console.log(keys)}
          onTroubleshoot={onTroubleshoot}
          onStatusChange={(_status) => setStatus(_status)}
          setDerivationPathSpec={setDerivationPathSpec}
          derivationPathSpec={derivationPathSpec}
          numberOfKeys={3}
        />
      </OnboardingStepContent>
      <OnboardingStepActions>
        {status === 'error' ? (
          <Styled.LedgerLiveButton>
            {t('Download Ledger Live to update')}
          </Styled.LedgerLiveButton>
        ) : (
          <Button
            sx={{ minWidth: 150, alignSelf: 'flex-end' }}
            // disabled={!isValid}
            variant="contained"
            color="primary"
            onClick={onNext}
          >
            {t('Next')}
          </Button>
        )}
      </OnboardingStepActions>
    </>
  );
};
