import { useCallback, useEffect, useState } from 'react';
import { useOnboardingContext } from '@src/contexts/OnboardingProvider';
import {
  ONBOARDING_EVENT_NAMES,
  OnboardingPhase,
  OnboardingURLs,
} from '@src/background/services/onboarding/models';
import { OnboardingStepHeader } from '../components/OnboardingStepHeader';
import { useAnalyticsContext } from '@src/contexts/AnalyticsProvider';
import { Mnemonic } from 'ethers';
import { Trans, useTranslation } from 'react-i18next';
import {
  Button,
  Stack,
  TextField,
  Typography,
  useTheme,
} from '@avalabs/k2-components';
import { PageNav } from '../components/PageNav';
import { useHistory } from 'react-router-dom';
import {
  WordsLengthSelector,
  wordPhraseLength,
} from '../components/WordsLengthSelector';
import splitSeedPhrase from '../utils/splitSeedPhrase';

const isPhraseCorrectLength = (phrase: string) =>
  wordPhraseLength.includes(splitSeedPhrase(phrase).length);

export const ImportWallet = () => {
  const { capture } = useAnalyticsContext();
  const { setMnemonic, setOnboardingPhase } = useOnboardingContext();
  const [recoveryPhrase, setRecoveryPhrase] = useState<string>('');
  const [error, setError] = useState<string>('');
  const { t } = useTranslation();
  const theme = useTheme();
  const [wordsLength, setWordsLength] = useState(24);
  const [words, setWords] = useState<string[]>([]);
  const history = useHistory();

  const onNext = useCallback(async () => {
    if (recoveryPhrase) {
      capture('OnboardingMnemonicImported');
      setMnemonic(recoveryPhrase);
      history.push(OnboardingURLs.CREATE_PASSWORD);
    }
  }, [capture, history, recoveryPhrase, setMnemonic]);

  useEffect(() => {
    setOnboardingPhase(OnboardingPhase.IMPORT_WALLET);
    capture(ONBOARDING_EVENT_NAMES.import_wallet);
  }, [capture, setOnboardingPhase]);

  const sliceWords = useCallback((selectedLength: number) => {
    setWordsLength(selectedLength);
    setWords((currentWords) => {
      const cutWords = [...currentWords];
      return [...currentWords.slice(0, selectedLength), ...cutWords].slice(
        0,
        selectedLength
      );
    });
  }, []);

  const isPhraseValid = useCallback((phrase: string) => {
    return (
      phrase &&
      isPhraseCorrectLength(phrase) &&
      Mnemonic.isValidMnemonic(phrase)
    );
  }, []);

  const onPhraseChanged = useCallback(() => {
    const phrase = [...words].join(' ');

    if (!isPhraseValid(phrase)) {
      setError(t('Invalid mnemonic phrase'));
    } else {
      setRecoveryPhrase(phrase);
      setError('');
      onNext();
    }
  }, [isPhraseValid, onNext, t, words]);

  useEffect(() => {
    onPhraseChanged();
  }, [onPhraseChanged, words]);

  const nextButtonDisabled = !isPhraseValid(recoveryPhrase) || !!error;

  const inputFields = useCallback(() => {
    const fields: JSX.Element[] = [];
    for (let i = 0; i < wordsLength; i++) {
      fields.push(
        <Stack sx={{ width: '135px' }} key={i}>
          <TextField
            size="small"
            autoFocus={i === 0}
            placeholder={`${i + 1}.`}
            onPaste={(e) => {
              const pastedText = splitSeedPhrase(
                e.clipboardData.getData('Text')
              );

              setWords(
                [...words.slice(0, i), ...pastedText].slice(0, wordsLength)
              );

              e.preventDefault();
            }}
            onChange={(e) => {
              const value = e.target.value;

              const newWords = [...words];
              newWords[i] = value;

              setWords(newWords);
            }}
            value={words[i] || ''}
          />
        </Stack>
      );
    }
    return fields;
  }, [words, wordsLength]);

  return (
    <Stack
      sx={{
        width: '432px',
        height: '100%',
      }}
    >
      <OnboardingStepHeader
        testId="enter-recovery-phrase"
        title={t('Enter Seed Phrase')}
      />
      <Stack
        sx={{
          flexGrow: 1,
          pt: 1,
          textAlign: 'center',
        }}
      >
        <Typography variant="body2" sx={{ color: theme.palette.grey[400] }}>
          <Trans i18nKey="Access an existing wallet with your seed phrase. You can paste your entire phrase in the first field." />
        </Typography>
        <Stack
          sx={{
            pt: 4,
            pb: 1,
            alignSelf: 'center',
            flexFlow: 'row wrap',
            justifyContent: 'space-between',
            gap: '8px 8px',
          }}
        >
          <Stack sx={{ width: '100%', justifyContent: 'flex-start' }}>
            <WordsLengthSelector
              wordsLength={wordsLength}
              setWordsLength={sliceWords}
            />
          </Stack>
          {inputFields()}
        </Stack>
        <Stack
          sx={{
            justifyContent: 'flex-end',
            width: '100%',
            flexDirection: 'row',
          }}
        >
          <Button
            onClick={() => setWords([])}
            sx={{ width: '73px', pr: 0 }}
            variant="text"
            color="secondary"
            disabled={!words.length}
          >
            <Typography variant="caption">{t('Clear All')}</Typography>
          </Button>
        </Stack>
      </Stack>
      <PageNav
        onBack={() => {
          capture('OnboardingCancelled', {
            step: OnboardingPhase.IMPORT_WALLET,
          });
          history.goBack();
        }}
        onNext={onNext}
        disableNext={nextButtonDisabled}
        expand={true}
        steps={3}
        activeStep={0}
      />
    </Stack>
  );
};
