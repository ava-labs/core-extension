import { useTranslation } from 'react-i18next';
import { FC } from 'react';
import { Stack, StackProps } from '@avalabs/k2-alpine';

import {
  OnboardingStepActions,
  OnboardingStepContent,
  OnboardingStepDescription,
  OnboardingStepTitle,
} from '@/components/OnboardingModal';
import { NavButton } from '@/pages/Onboarding/components/NavButton';

import SolanaGlow from '../images/SolanaGlow.png';

type SolanaPromptProps = StackProps & {
  onNext: () => void;
  onSkip: () => void;
};
export const PromptSolana: FC<SolanaPromptProps> = ({
  onNext,
  onSkip,
  ...stackProps
}) => {
  const { t } = useTranslation();

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
        <NavButton color="secondary" onClick={onSkip}>
          {t('No thanks')}
        </NavButton>
        <NavButton color="primary" onClick={onNext}>
          {t('Add Solana')}
        </NavButton>
      </OnboardingStepActions>
    </Stack>
  );
};
