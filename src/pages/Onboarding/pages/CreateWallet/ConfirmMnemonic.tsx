import { Stack, Typography, styled, useTheme } from '@avalabs/k2-components';
import { useEffect, useMemo, useState } from 'react';
import { useTranslation } from 'react-i18next';
import { MnemonicProps } from './Mnemonic';

interface WordToConfirm {
  index: number;
  randomWords: string[];
  selected: string;
}

const BoldText = styled('span')`
  font-weight: bold;
`;

export function ConfirmMnemonic({
  phrase,
  wordCount = 24,
  confirmWordCount = 3,
  onConfirmedChange,
}: MnemonicProps) {
  const { t } = useTranslation();
  const theme = useTheme();

  const [wordsToConfirm, setWordsToConfirm] = useState<
    Record<number, WordToConfirm>
  >({});
  const words = useMemo(() => {
    return phrase.split(' ');
  }, [phrase]);
  const firstWordText = t('Select the first word');
  const nextWordText = t('Select the word that comes after');

  useEffect(() => {
    const getRandomWordsForIndex = (index: number): string[] => {
      const randomWords: string[] = [];
      while (randomWords.length < 2) {
        const randomIndex = Math.floor(Math.random() * wordCount);
        const randomWord = words[randomIndex];

        if (
          randomIndex === index ||
          words.length <= randomIndex ||
          !randomWord ||
          randomWords.includes(randomWord)
        ) {
          continue;
        }
        randomWords.push(randomWord);
      }
      return randomWords;
    };

    const toConfirm: Record<number, WordToConfirm> = {};
    while (Object.keys(toConfirm).length < confirmWordCount) {
      const randomIndex = Math.floor(Math.random() * wordCount);
      const randomWord = words[randomIndex];
      if (!toConfirm[randomIndex] && randomWord) {
        toConfirm[randomIndex] = {
          index: randomIndex,
          randomWords: [
            randomWord,
            ...getRandomWordsForIndex(randomIndex),
          ].sort(() => 0.5 - Math.random()),
          selected: '',
        };
      }
    }

    setWordsToConfirm(toConfirm);
  }, [confirmWordCount, wordCount, words]);

  const selectWordForIndex = (index: number, word: string) => {
    const selectedWord = wordsToConfirm[index];

    if (selectedWord) {
      const newState = {
        ...wordsToConfirm,
        [index]: {
          ...selectedWord,
          selected: word,
        },
      };
      setWordsToConfirm(newState);

      onConfirmedChange &&
        onConfirmedChange(
          Object.values(newState).every(
            (item) => item.index >= 0 && words[item.index] === item.selected
          )
        );
    }
  };

  return (
    <Stack>
      {Object.keys(wordsToConfirm)
        .map(Number)
        .map((i) => (
          <Stack key={i} sx={{ mb: 4, textAlign: 'left' }}>
            {i !== 0 ? (
              <>
                <Typography variant="body1" sx={{ mb: 2 }}>
                  {nextWordText} <BoldText>{`(${words[i - 1]})`}</BoldText>
                </Typography>
              </>
            ) : (
              <Typography
                variant="body1"
                sx={{ mb: 2, fontWeight: 'fontWeightBold' }}
              >{`${firstWordText}`}</Typography>
            )}
            <Stack sx={{ flexDirection: 'row' }}>
              {wordsToConfirm[i]?.randomWords.map((randomWord) => {
                const selected = wordsToConfirm[i]?.selected === randomWord;
                return (
                  <Stack
                    key={`${i}-${randomWord}`}
                    onClick={() => selectWordForIndex(i, randomWord)}
                    sx={{
                      flexDirection: 'row',
                      borderRadius: 12.5,
                      py: 1,
                      mx: 1,
                      justifyContent: 'center',
                      width: theme.spacing(13),
                      background: selected
                        ? theme.palette.primary.main
                        : theme.palette.grey[800],
                      color: selected
                        ? theme.palette.grey[800]
                        : theme.palette.primary.main,
                      cursor: 'pointer',
                      '&:first-of-type': {
                        ml: '0',
                      },
                      '&:last-of-type': {
                        mr: '0',
                      },
                      '&:hover': {
                        background: theme.palette.primary.main,
                        color: theme.palette.grey[800],
                      },
                    }}
                  >
                    <Typography
                      variant="caption"
                      sx={{
                        userSelect: 'none',
                        fontWeight: 'semibold',
                      }}
                    >
                      {randomWord}
                    </Typography>
                  </Stack>
                );
              })}
            </Stack>
          </Stack>
        ))}
    </Stack>
  );
}
