import { useHistory } from 'react-router-dom';
import { useTranslation } from 'react-i18next';
import { FC, useEffect, useMemo, useState } from 'react';
import { Button, Typography, Stack } from '@avalabs/k2-alpine';

import { useOnboardingContext } from '@core/ui';

import {
  OnboardingStepActions,
  OnboardingStepContent,
  OnboardingStepDescription,
  OnboardingStepTitle,
  useModalPageControl,
} from '@/components/OnboardingModal';
import { OnboardingScreenProps } from '@/pages/Onboarding/types';

import { getConfirmationWords } from '../lib/phraseConfirmation';
import { validateAnswers } from '../lib/phraseConfirmation';

const CONFIRMATION_WORDS_COUNT = 3;
const CONFIRMATION_OPTIONS_COUNT = 3;

export const ConfirmSeedphraseScreen: FC<OnboardingScreenProps> = ({
  step,
  totalSteps,
  nextScreenPath,
}) => {
  const { t } = useTranslation();
  const history = useHistory();
  const { setCurrent, setTotal } = useModalPageControl();
  const { mnemonic } = useOnboardingContext();

  const [selectedOptions, setSelectedOptions] = useState<number[]>([]);

  useEffect(() => {
    setCurrent(step);
    setTotal(totalSteps);
  }, [setCurrent, setTotal, step, totalSteps]);

  const words = useMemo(() => mnemonic.split(/\s+/), [mnemonic]);
  const confirmationWords = useMemo(
    () =>
      getConfirmationWords(
        words,
        CONFIRMATION_WORDS_COUNT,
        CONFIRMATION_OPTIONS_COUNT,
      ),
    [words],
  );

  const isConfirmed = validateAnswers(confirmationWords, selectedOptions);

  const onNext = () => {
    if (!isConfirmed) {
      return;
    }

    history.push(nextScreenPath);
  };

  return (
    <>
      <OnboardingStepTitle>
        {t(`Verify your recovery phrase`)}
      </OnboardingStepTitle>
      <OnboardingStepDescription>
        {t(`Select the words below to verify your recovery phrase`)}
      </OnboardingStepDescription>
      <OnboardingStepContent gap={4}>
        {Array.from(confirmationWords).map(
          ([wordIndex, { options }], rowIndex) => (
            <Stack key={wordIndex} gap={1.5}>
              <Typography variant="body2">
                {wordIndex === 0
                  ? t('Select the first word')
                  : wordIndex === words.length - 1
                    ? t('Select the last word')
                    : t('Select the word that comes after “{{word}}”', {
                        word: words[wordIndex],
                      })}
              </Typography>
              <Stack
                direction="row"
                alignItems="center"
                justifyContent="space-between"
                gap={2}
              >
                {options.map((option) => (
                  <Button
                    key={option}
                    fullWidth
                    variant="contained"
                    color={
                      selectedOptions[rowIndex] === option
                        ? 'primary'
                        : 'secondary'
                    }
                    size="small"
                    onClick={() => {
                      setSelectedOptions((prev) => {
                        const newOptions = [...prev];
                        newOptions[rowIndex] = option;
                        return newOptions;
                      });
                    }}
                  >
                    {words[option]}
                  </Button>
                ))}
              </Stack>
            </Stack>
          ),
        )}
      </OnboardingStepContent>
      <OnboardingStepActions gap={6} pt={2}>
        <Button
          sx={{ minWidth: 150, alignSelf: 'flex-end' }}
          variant="contained"
          color="primary"
          onClick={onNext}
          disabled={!isConfirmed}
        >
          {t('Next')}
        </Button>
      </OnboardingStepActions>
    </>
  );
};
