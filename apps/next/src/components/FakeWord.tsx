import { Typography } from '@avalabs/k2-alpine';
import { wordlists } from 'bip39';

export const FakeWord = () => (
  <Typography
    component="span"
    translate="no"
    sx={{
      position: 'absolute',
      left: 0,
      top: 0,
      zIndex: -1,
      opacity: 0,
    }}
  >
    {getRandomSeedphraseWord()}
  </Typography>
);

const getRandomSeedphraseWord = (wordList = 'english'): string => {
  const words = wordlists[wordList];

  if (!words) {
    throw new Error(`Unknown word list: ${wordList}`);
  }

  const rand = Math.floor(Math.random() * words.length);

  return words[rand] as string;
};
