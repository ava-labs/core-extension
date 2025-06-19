import { useTranslation } from 'react-i18next';
import { FC, useEffect } from 'react';
import { Button, Stack, StackProps } from '@avalabs/k2-alpine';

import {
  OnboardingStepActions,
  OnboardingStepContent,
  OnboardingStepDescription,
  OnboardingStepTitle,
  useModalPageControl,
} from '@/components/OnboardingModal';

type ConnectionErrorProps = StackProps & {
  onRetry: () => void;
  onBack: () => void;
};
export const ConnectionError: FC<ConnectionErrorProps> = ({
  onBack,
  onRetry,
  ...stackProps
}) => {
  const { t } = useTranslation();
  const { setOnBackHandler } = useModalPageControl();

  useEffect(() => {
    setOnBackHandler(() => onBack);

    return () => {
      setOnBackHandler(undefined);
    };
  }, [onBack, setOnBackHandler]);

  return (
    <Stack height="100%" width="100%" {...stackProps}>
      <OnboardingStepTitle>{t('oopsies')}</OnboardingStepTitle>
      <OnboardingStepDescription>{t('big oopsies')}</OnboardingStepDescription>
      <OnboardingStepContent>
        <Stack gap={2}>
          <Stack>no Key 1</Stack>
          <Stack>no Key 2</Stack>
        </Stack>
      </OnboardingStepContent>
      <OnboardingStepActions>
        <Button
          sx={{ minWidth: 150, alignSelf: 'flex-end' }}
          // disabled={!isValid}
          variant="contained"
          color="primary"
          onClick={onRetry}
        >
          {t('Next')}
        </Button>
      </OnboardingStepActions>
    </Stack>
  );
};
