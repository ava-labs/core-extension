import React from 'react';
import { Link } from 'react-router-dom';
import { observer } from 'mobx-react-lite';
import { useTranslation } from 'react-i18next';
import {
  VerticalFlex,
  Typography,
  PrimaryButton,
} from '@avalabs/react-components';
import { useStore } from '@src/store/store';
import { OnboardStepPhase } from '@src/store/onboard/onboardStore';
import { walletService } from '@src/background/services';

export const Welcome = observer(() => {
  const { t } = useTranslation();
  const { onboardStore } = useStore();
  return (
    <VerticalFlex align={'center'} padding={'0 10px'}>
      <Typography>{t('home.desc')}</Typography>
      <Link
        to="/welcome/create"
        onClick={() => {
          onboardStore.setPosition(OnboardStepPhase.MNEMONIC);
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
