import React from 'react';
import { useTranslation } from 'react-i18next';
import {
  VerticalFlex,
  Typography,
  PrimaryButton,
} from '@avalabs/react-components';
import { createNewMnemonic } from '@src/background/services/wallet/utils/createMnemonicPhrase';
import { useOnboardingContext } from '@src/contexts/OnboardingProvider';
import { OnboardingPhase } from '@src/background/services/onboarding/models';

export function Welcome() {
  const { t } = useTranslation();
  const { setNextPhase } = useOnboardingContext();

  return (
    <VerticalFlex align={'center'} padding={'0 10px'}>
      <Typography>{t('home.desc')}</Typography>
      <PrimaryButton
        onClick={() => {
          setNextPhase(OnboardingPhase.CREATE_WALLET);
        }}
      >
        Create a new wallet
      </PrimaryButton>

      <PrimaryButton
        onClick={() => {
          setNextPhase(OnboardingPhase.IMPORT_WALLET);
        }}
      >
        import existing wallet
      </PrimaryButton>
    </VerticalFlex>
  );
}
