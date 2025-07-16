import { FC, useState } from 'react';
import { Grid2, Typography, useTheme } from '@avalabs/k2-alpine';

import { BorderlessTextField } from '@/components/BorderlessTextField';

type WordsGridProps = {
  count: number;
  words: string[];
  setWords: (words: string[]) => void;
};

export const WordsGrid: FC<WordsGridProps> = ({ count, words, setWords }) => {
  const theme = useTheme();
  const [focusedIndex, setFocusedIndex] = useState(0);

  return (
    <Grid2 container spacing={1.5}>
      {Array.from({ length: count }, (_, i) => (
        <Grid2 size={4} key={i}>
          <BorderlessTextField
            fullWidth
            size="small"
            autoFocus={focusedIndex === i}
            type={focusedIndex === i ? 'text' : 'password'}
            value={words[i] ?? ''}
            variant="outlined"
            autoComplete="off"
            slotProps={{
              root: {
                sx: {
                  borderRadius: theme.shape.borderRadius,
                },
              },
              input: {
                startAdornment: (
                  <Typography
                    variant="body2"
                    color="text.secondary"
                    sx={{ pr: 0.5 }}
                  >
                    {i + 1}.
                  </Typography>
                ),
                endAdornment: null,
                sx: {
                  backgroundColor: 'glass.light2',
                  border: 'none',
                },
              },
            }}
            onPaste={(ev) => {
              const pastedText = splitSeedPhrase(
                ev.clipboardData.getData('Text'),
              );

              setWords([...words.slice(0, i), ...pastedText].slice(0, count));

              ev.preventDefault();
            }}
            onChange={(e) => {
              const value = e.target.value;

              const newWords = [...words];
              newWords[i] = value;

              setWords(newWords);
            }}
            onFocus={() => {
              setFocusedIndex(i);
            }}
            onBlur={() => {
              setFocusedIndex(-1);
            }}
          />
        </Grid2>
      ))}
    </Grid2>
  );
};

function splitSeedPhrase(seedPhrase: string): string[] {
  return seedPhrase.trim().split(/\s+/g);
}
