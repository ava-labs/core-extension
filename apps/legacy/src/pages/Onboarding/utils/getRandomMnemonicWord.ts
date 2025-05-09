import { wordlists } from 'bip39';

export const getRandomMnemonicWord = (wordlist = 'english'): string => {
  const words = wordlists[wordlist];

  if (!words) {
    throw new Error(`Unknown wordlist: ${wordlist}`);
  }

  const rand = Math.floor(Math.random() * words.length);

  return words[rand] as string;
};
