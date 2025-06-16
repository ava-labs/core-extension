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

type TroubleshootingProps = {
  onClose: () => void;
  appName: string;
};
export const Troubleshooting: FC<TroubleshootingProps> = ({
  appName,
  onClose,
}) => {
  const { t } = useTranslation();

  return (
    <>
      <OnboardingStepTitle>{t('Trouble connecting')}</OnboardingStepTitle>
      <OnboardingStepDescription>
        {t('We’re having trouble connecting to your device')}
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
          onClick={onClose}
        >
          {t('Close')}
        </Button>
      </OnboardingStepActions>
    </>
  );
};
