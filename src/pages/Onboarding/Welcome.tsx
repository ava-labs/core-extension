import React from 'react';
import { useTranslation } from 'react-i18next';
import {
  VerticalFlex,
  Typography,
  PrimaryButton,
} from '@avalabs/react-components';
import { onboardingService } from '@src/background/services';
import { createNewMnemonic } from '@src/background/services/wallet/utils/createMnemonicPhrase';

export function Welcome() {
  const { t } = useTranslation();

  return (
    <VerticalFlex align={'center'} padding={'0 10px'}>
      <Typography>{t('home.desc')}</Typography>
      <PrimaryButton
        onClick={() => {
          onboardingService.setCreateWallet(createNewMnemonic());
        }}
      >
        Create a new wallet
      </PrimaryButton>

      <PrimaryButton
        onClick={() => {
          onboardingService.setImportWallet();
        }}
      >
        import existing wallet
      </PrimaryButton>
    </VerticalFlex>
  );
}
