import { FC, useState } from 'react';
import { Stack, StackProps } from '@avalabs/k2-alpine';
import { useTranslation } from 'react-i18next';
import { DerivationPath } from '@avalabs/core-wallets-sdk';

import {
  OnboardingStepActions,
  OnboardingStepContent,
  OnboardingStepDescription,
  OnboardingStepTitle,
} from '@/components/OnboardingModal';
import { NavButton } from '@/pages/Onboarding/components/NavButton';

import * as Styled from './Styled';
import {
  type DerivationStatus,
  type ConnectorCallbacks,
  AvalancheLedgerConnector,
} from './LedgerConnector';
import { DerivedKeys } from './LedgerConnector/types';

type ConnectionStepProps = StackProps & {
  onNext: (keys: DerivedKeys) => void;
  onTroubleshoot: () => void;
  connectorCallbacks?: ConnectorCallbacks;
};

export const ConnectAvalanche: FC<ConnectionStepProps> = ({
  onNext,
  onTroubleshoot,
  connectorCallbacks,
  ...stackProps
}) => {
  const { t } = useTranslation();

  const [status, setStatus] = useState<DerivationStatus>('waiting');
  const [derivationPathSpec, setDerivationPathSpec] = useState<DerivationPath>(
    DerivationPath.BIP44,
  );

  const [derivedKeys, setDerivedKeys] = useState<DerivedKeys>({
    addressPublicKeys: [],
    extendedPublicKeys: [],
  });

  const isValid =
    derivationPathSpec === DerivationPath.BIP44
      ? Boolean(
          derivedKeys.addressPublicKeys.length &&
            derivedKeys.extendedPublicKeys?.length,
        )
      : derivedKeys.addressPublicKeys.length > 0;

  return (
    <Stack height="100%" width="100%" {...stackProps}>
      <OnboardingStepTitle>{t('Connect your Ledger')}</OnboardingStepTitle>
      <OnboardingStepDescription>
        {status === 'error'
          ? t(
              'Please connect your device, open the Avalanche application, and connect the wallet with the Ledger option to continue.',
            )
          : t('Select the derivation path type to see your derived addresses.')}
      </OnboardingStepDescription>
      <OnboardingStepContent sx={{ gap: 3, alignItems: 'center' }}>
        <AvalancheLedgerConnector
          callbacks={connectorCallbacks}
          onSuccess={setDerivedKeys}
          onTroubleshoot={onTroubleshoot}
          onStatusChange={setStatus}
          setDerivationPathSpec={setDerivationPathSpec}
          derivationPathSpec={derivationPathSpec}
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
          <NavButton
            disabled={!isValid}
            color="primary"
            onClick={() => onNext(derivedKeys)}
          >
            {t('Next')}
          </NavButton>
        )}
      </OnboardingStepActions>
    </Stack>
  );
};
