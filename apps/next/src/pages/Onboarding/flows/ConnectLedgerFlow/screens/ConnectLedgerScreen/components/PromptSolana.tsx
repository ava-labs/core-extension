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

import SolanaGlow from '../images/SolanaGlow.png';

type SolanaPromptProps = StackProps & {
  onBack: () => void;
  onNext: () => void;
  onSkip: () => void;
};
export const PromptSolana: FC<SolanaPromptProps> = ({
  onBack,
  onNext,
  onSkip,
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
      <OnboardingStepTitle>
        {t(`Do you want to add Solana to your wallet?`)}
      </OnboardingStepTitle>
      <OnboardingStepDescription>
        {t(
          `To use Solana in Core you will need to add an account from your Ledger device. You can always add this later at any time`,
        )}
      </OnboardingStepDescription>
      <OnboardingStepContent>
        <Stack
          flexGrow={1}
          alignItems="center"
          justifyContent="center"
          height="100%"
        >
          <img src={SolanaGlow} alt="Solana Glowing Logo" height="270px" />
        </Stack>
      </OnboardingStepContent>
      <OnboardingStepActions>
        <Button
          sx={{ minWidth: 150, alignSelf: 'flex-end' }}
          variant="contained"
          color="secondary"
          onClick={onSkip}
        >
          {t('No thanks')}
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
    </Stack>
  );
};
