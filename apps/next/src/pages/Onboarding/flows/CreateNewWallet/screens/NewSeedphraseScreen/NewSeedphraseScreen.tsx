import { useHistory } from 'react-router-dom';
import { useTranslation } from 'react-i18next';
import { FC, useEffect, useState } from 'react';
import { WalletType } from '@avalabs/types';
import { Button, Stack, toast } from '@avalabs/k2-alpine';

import { createNewMnemonic } from '@core/common';
import { useOnboardingContext } from '@core/ui';

import {
  OnboardingStepActions,
  OnboardingStepContent,
  OnboardingStepDescription,
  OnboardingStepTitle,
  useModalPageControl,
} from '@/components/OnboardingModal';
import { OnboardingScreenProps } from '@/pages/Onboarding/types';

import { SeedphraseGrid } from './components/SeedphraseGrid';
import { LostPhraseLostFundsWarning } from './components/LostPhraseLostFundsWarning';

export const NewSeedphraseScreen: FC<OnboardingScreenProps> = ({
  step,
  totalSteps,
  nextScreenPath,
}) => {
  const { t } = useTranslation();
  const history = useHistory();
  const { setCurrent, setTotal } = useModalPageControl();
  const { setMnemonic, setOnboardingWalletType } = useOnboardingContext();
  const [generatedSeedphrase] = useState<string>(createNewMnemonic());

  useEffect(() => {
    setCurrent(step);
    setTotal(totalSteps);
    setOnboardingWalletType(WalletType.Mnemonic);
  }, [setCurrent, setTotal, setOnboardingWalletType, step, totalSteps]);

  const onNext = () => {
    setMnemonic(generatedSeedphrase);
    history.push(nextScreenPath);
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
        <Button
          sx={{ minWidth: 150, alignSelf: 'flex-end' }}
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
