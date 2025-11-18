import { FiAlertCircle } from 'react-icons/fi';
import { useTranslation } from 'react-i18next';
import { FC, useEffect, useState } from 'react';
import { Typography, Fade, Stack, Box } from '@avalabs/k2-alpine';

import { isPhraseCorrect } from '@core/common';
import { useKeyboardShortcuts } from '@core/ui';

import {
  FullscreenModalActions,
  FullscreenModalContent,
  FullscreenModalDescription,
  FullscreenModalNavigationProps,
  FullscreenModalTitle,
  useModalPageControl,
} from '@/components/FullscreenModal';
import { NavButton } from '@/pages/Onboarding/components/NavButton';

import { RecoveryPhraseForm } from '@/components/RecoveryPhraseForm/RecoveryPhraseForm';

type EnterRecoveryPhraseScreenProps = FullscreenModalNavigationProps & {
  onNext: (phrase: string) => void;
  isCalculating: boolean;
};

export const EnterRecoveryPhraseScreen: FC<EnterRecoveryPhraseScreenProps> = ({
  onNext,
  isCalculating,
  step,
  totalSteps,
}) => {
  const { t } = useTranslation();
  const { setCurrent, setTotal } = useModalPageControl();

  const [words, setWords] = useState<string[]>([]);
  const [phraseLength, setPhraseLength] = useState(24);

  const phrase = words.join(' ');
  const hasAllWords = words.length === phraseLength;
  const isValid = hasAllWords && isPhraseCorrect(phrase);

  const handleNextClick = () => {
    onNext(phrase);
  };

  const keyboardHandlers = useKeyboardShortcuts({
    Enter: isValid ? handleNextClick : undefined,
  });

  useEffect(() => {
    setCurrent(step);
    setTotal(totalSteps);
  }, [setCurrent, setTotal, step, totalSteps]);

  return (
    <>
      <FullscreenModalTitle>
        {t('Enter your recovery phrase')}
      </FullscreenModalTitle>
      <FullscreenModalDescription>
        {t(
          'Access an existing wallet with your recovery phrase. You can paste your entire phrase in the first field, or use the tab key to jump to the next field',
        )}
      </FullscreenModalDescription>
      <FullscreenModalContent>
        <RecoveryPhraseForm
          onClearAll={() => setWords([])}
          phraseLength={phraseLength}
          setPhraseLength={setPhraseLength}
          words={words}
          setWords={setWords}
          {...keyboardHandlers}
        />
      </FullscreenModalContent>
      <FullscreenModalActions
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
            data-testid="recovery-phrase-error-message"
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
        <NavButton
          disabled={!isValid || isCalculating}
          loading={isCalculating}
          color="primary"
          onClick={handleNextClick}
        >
          {t('Next')}
        </NavButton>
      </FullscreenModalActions>
    </>
  );
};
