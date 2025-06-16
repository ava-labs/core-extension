import { useTranslation } from 'react-i18next';
import { FC, useEffect } from 'react';
import { Button, Stack } from '@avalabs/k2-alpine';

import {
  OnboardingStepActions,
  OnboardingStepContent,
  OnboardingStepDescription,
  OnboardingStepTitle,
  useModalPageControl,
} from '@/components/OnboardingModal';

type SolanaPromptProps = {
  onBack: () => void;
  onNext: () => void;
  onSkip: () => void;
};
export const PromptSolana: FC<SolanaPromptProps> = ({
  onBack,
  onNext,
  onSkip,
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
    <>
      <OnboardingStepTitle>
        {t(`Do you want to add Solana to your wallet?`)}
      </OnboardingStepTitle>
      <OnboardingStepDescription>
        {t(
          `To use Solana in Core you will need to add an account from your Ledger device. You can always add this later at any time`,
        )}
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
          variant="contained"
          color="secondary"
          onClick={onSkip}
        >
          {t('No Thanks')}
        </Button>
        <Button
          sx={{ minWidth: 150, alignSelf: 'flex-end' }}
          // disabled={!isValid}
          variant="contained"
          color="primary"
          onClick={onNext}
        >
          {t('Add Solana')}
        </Button>
      </OnboardingStepActions>
    </>
  );
};
