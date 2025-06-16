import { useTranslation } from 'react-i18next';
import { FC } from 'react';
import { Button, Stack } from '@avalabs/k2-alpine';

import { useKeyboardShortcuts, useOnboardingContext } from '@core/ui';

import {
  OnboardingStepActions,
  OnboardingStepContent,
  OnboardingStepDescription,
  OnboardingStepTitle,
} from '@/components/OnboardingModal';

type ConnectionStepProps = {
  onNext: () => void;
};
export const ConnectSolana: FC<ConnectionStepProps> = ({ onNext }) => {
  const { t } = useTranslation();

  return (
    <>
      <OnboardingStepTitle>{t('Connect your Ledger')}</OnboardingStepTitle>
      <OnboardingStepDescription>
        {t('Open the Solana app on your Ledger device')}
      </OnboardingStepDescription>
      <OnboardingStepContent>
        <Stack gap={2}>
          <Stack>Solana Key 1</Stack>
          <Stack>Solana Key 2</Stack>
        </Stack>
      </OnboardingStepContent>
      <OnboardingStepActions>
        <Button
          sx={{ minWidth: 150, alignSelf: 'flex-end' }}
          // disabled={!isValid}
          variant="contained"
          color="primary"
          onClick={onNext}
        >
          {t('Next')}
        </Button>
      </OnboardingStepActions>
    </>
  );
};
