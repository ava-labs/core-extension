import { useTranslation } from 'react-i18next';
import { FC, useEffect, useState } from 'react';
import { Button, Stack, toast } from '@avalabs/k2-alpine';

import { createNewMnemonic } from '@core/common';

import {
  OnboardingStepActions,
  OnboardingStepContent,
  OnboardingStepDescription,
  OnboardingStepTitle,
  useModalPageControl,
} from '@/components/OnboardingModal';
import { NavButton } from '@/pages/Onboarding/components/NavButton';
import { OnboardingScreenProps } from '@/pages/Onboarding/types';

import { SeedphraseGrid } from './components/SeedphraseGrid';
import { LostPhraseLostFundsWarning } from './components/LostPhraseLostFundsWarning';

type NewSeedphraseScreenProps = OnboardingScreenProps & {
  onNext: (phrase: string) => void;
};

export const NewSeedphraseScreen: FC<NewSeedphraseScreenProps> = ({
  step,
  totalSteps,
  onNext,
}) => {
  const { t } = useTranslation();
  const { setCurrent, setTotal } = useModalPageControl();
  const [generatedSeedphrase] = useState<string>(createNewMnemonic());

  useEffect(() => {
    setCurrent(step);
    setTotal(totalSteps);
  }, [setCurrent, setTotal, step, totalSteps]);

  const handleNextClick = () => {
    onNext(generatedSeedphrase);
  };

  return (
    <>
      <OnboardingStepTitle>
        {t(`Here is your wallet's recovery phrase`)}
      </OnboardingStepTitle>
      <OnboardingStepDescription>
        {t(
          `This phrase is your access key to your wallet. Carefully write it down and store it in a safe location`,
        )}
      </OnboardingStepDescription>
      <OnboardingStepContent>
        <LostPhraseLostFundsWarning />
        <SeedphraseGrid phrase={generatedSeedphrase} />
        <Stack alignItems="center" mt={1.5}>
          <Button
            variant="contained"
            color="secondary"
            size="small"
            onClick={() => {
              navigator.clipboard.writeText(generatedSeedphrase);
              toast.success(t('Copied!'), {
                duration: 2000,
              });
            }}
          >
            {t('Copy phrase')}
          </Button>
        </Stack>
      </OnboardingStepContent>
      <OnboardingStepActions gap={6} pt={2}>
        <NavButton color="primary" onClick={handleNextClick}>
          {t('Next')}
        </NavButton>
      </OnboardingStepActions>
    </>
  );
};
