import React from 'react';
import { Link } from 'react-router-dom';
import { observer } from 'mobx-react-lite';
import { useTranslation } from 'react-i18next';
import {
  VerticalFlex,
  Typography,
  PrimaryButton,
} from '@avalabs/react-components';
import { walletService, onboardingService } from '@src/background/services';
import { OnboardingPhase } from '@src/background/services/onboarding/models';

export const Welcome = observer(() => {
  const { t } = useTranslation();

  return (
    <VerticalFlex align={'center'} padding={'0 10px'}>
      <Typography>{t('home.desc')}</Typography>
      <Link
        to="/welcome/create"
        onClick={() => {
          onboardingService.setPhase(OnboardingPhase.MNEMONIC);
          walletService.createWithNewMnemonic();
        }}
      >
        <PrimaryButton>Create a new wallet</PrimaryButton>
      </Link>
      <Link to="/import">
        <PrimaryButton>import existing wallet</PrimaryButton>
      </Link>
    </VerticalFlex>
  );
});
