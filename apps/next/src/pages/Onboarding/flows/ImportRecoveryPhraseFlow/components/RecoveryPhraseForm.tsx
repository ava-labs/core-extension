import { FC } from 'react';
import { useTranslation } from 'react-i18next';
import { Button, Stack, StackProps } from '@avalabs/k2-alpine';

import { WordsGrid } from './WordsGrid';
import { RecoveryPhraseLengthSelector } from './RecoveryPhraseLengthSelector';

type RecoveryPhraseFormProps = StackProps & {
  onClearAll: () => void;
  phraseLength: number;
  setPhraseLength: (length: number) => void;
  words: string[];
  setWords: (words: string[]) => void;
};

export const RecoveryPhraseForm: FC<RecoveryPhraseFormProps> = ({
  onClearAll,
  phraseLength,
  setPhraseLength,
  words,
  setWords,
  ...props
}) => {
  const { t } = useTranslation();

  return (
    <Stack sx={{ gap: 1.5, width: 1, flex: '0 0 auto' }} {...props}>
      <Stack direction="row" justifyContent="space-between" alignItems="center">
        <RecoveryPhraseLengthSelector
          phraseLength={phraseLength}
          setPhraseLength={setPhraseLength}
        />
        <Button
          size="small"
          variant="contained"
          color="secondary"
          onClick={onClearAll}
        >
          {t('Clear all')}
        </Button>
      </Stack>
      <WordsGrid count={phraseLength} words={words} setWords={setWords} />
    </Stack>
  );
};
