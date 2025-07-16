import { useTranslation } from 'react-i18next';
import { FC, useEffect, useMemo, useState } from 'react';
import { Button, Typography, Stack } from '@avalabs/k2-alpine';

import { useOnboardingContext } from '@core/ui';

import {
  FullscreenModalActions,
  FullscreenModalContent,
  FullscreenModalDescription,
  FullscreenModalTitle,
  useModalPageControl,
} from '@/components/FullscreenModal';
import { NavButton } from '@/pages/Onboarding/components/NavButton';
import { OnboardingScreenProps } from '@/pages/Onboarding/types';

import { getConfirmationWords } from '../lib/phraseConfirmation';
import { validateAnswers } from '../lib/phraseConfirmation';

const CONFIRMATION_WORDS_COUNT = 3;
const CONFIRMATION_OPTIONS_COUNT = 3;

type ConfirmSeedphraseScreenProps = OnboardingScreenProps & {
  onNext: VoidFunction;
};

export const ConfirmSeedphraseScreen: FC<ConfirmSeedphraseScreenProps> = ({
  step,
  totalSteps,
  onNext,
}) => {
  const { t } = useTranslation();
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

  const handleNextClick = () => {
    if (!isConfirmed) {
      return;
    }

    onNext();
  };

  return (
    <>
      <FullscreenModalTitle>
        {t(`Verify your recovery phrase`)}
      </FullscreenModalTitle>
      <FullscreenModalDescription>
        {t(`Select the words below to verify your recovery phrase`)}
      </FullscreenModalDescription>
      <FullscreenModalContent gap={4}>
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
      </FullscreenModalContent>
      <FullscreenModalActions gap={6} pt={2}>
        <NavButton
          color="primary"
          onClick={handleNextClick}
          disabled={!isConfirmed}
        >
          {t('Next')}
        </NavButton>
      </FullscreenModalActions>
    </>
  );
};
