import { useHistory } from 'react-router-dom';
import { FiAlertCircle } from 'react-icons/fi';
import { useTranslation } from 'react-i18next';
import { FC, useEffect, useState } from 'react';
import { Typography, Fade, Stack, Box } from '@avalabs/k2-alpine';

import { isPhraseCorrect } from '@core/common';
import { useKeyboardShortcuts, useOnboardingContext } from '@core/ui';

import {
  OnboardingStepActions,
  OnboardingStepContent,
  OnboardingStepDescription,
  OnboardingStepTitle,
  useModalPageControl,
} from '@/components/OnboardingModal';
import { NavButton } from '@/pages/Onboarding/components/NavButton';
import { OnboardingScreenProps } from '@/pages/Onboarding/types';

import { RecoveryPhraseForm } from '../components/RecoveryPhraseForm';

export const EnterRecoveryPhraseScreen: FC<OnboardingScreenProps> = ({
  step,
  totalSteps,
  nextScreenPath,
}) => {
  const { t } = useTranslation();
  const history = useHistory();
  const { setCurrent, setTotal } = useModalPageControl();
  const { setMnemonic } = useOnboardingContext();

  const [words, setWords] = useState<string[]>([]);
  const [phraseLength, setPhraseLength] = useState(24);

  const phrase = words.join(' ');
  const hasAllWords = words.length === phraseLength;
  const isValid = hasAllWords && isPhraseCorrect(phrase);

  useEffect(() => {
    setCurrent(step);
    setTotal(totalSteps);
  }, [setCurrent, setTotal, step, totalSteps]);

  const onNext = () => {
    if (!isValid) {
      return;
    }

    setMnemonic(phrase);
    history.push(nextScreenPath);
  };

  const keyboardHandlers = useKeyboardShortcuts({
    Enter: onNext,
  });

  return (
    <>
      <OnboardingStepTitle>{t('Import Recovery Phrase')}</OnboardingStepTitle>
      <OnboardingStepDescription>
        {t(
          'Access an existing wallet with your recovery phrase. You can paste your entire phrase in the first field, or use the tab key to jump to the next field',
        )}
      </OnboardingStepDescription>
      <OnboardingStepContent>
        <RecoveryPhraseForm
          onClearAll={() => setWords([])}
          phraseLength={phraseLength}
          setPhraseLength={setPhraseLength}
          words={words}
          setWords={setWords}
          {...keyboardHandlers}
        />
      </OnboardingStepContent>
      <OnboardingStepActions
        sx={{
          gap: 6,
          pt: 2,
        }}
      >
        <Fade in={hasAllWords && !isValid} mountOnEnter unmountOnExit>
          <Stack
            direction="row"
            gap={2}
            alignItems="center"
            color="error.light"
            width="70%"
          >
            <Box sx={{ width: 24, height: 24 }}>
              <FiAlertCircle size={24} />
            </Box>
            <Typography variant="body2">
              {t(
                'The recovery phrase your entered is invalid. Please double check for spelling mistakes or the order of each word',
              )}
            </Typography>
          </Stack>
        </Fade>
        <NavButton disabled={!isValid} color="primary" onClick={onNext}>
          {t('Next')}
        </NavButton>
      </OnboardingStepActions>
    </>
  );
};
