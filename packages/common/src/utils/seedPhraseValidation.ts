import { Mnemonic } from 'ethers';

export const wordPhraseLength = [12, 18, 24];

export const isPhraseCorrect = (phrase: string) => {
  const trimmed = phrase.trim().split(/\s+/g);

  return (
    wordPhraseLength.includes(trimmed.length) &&
    Mnemonic.isValidMnemonic(trimmed.join(' ').toLowerCase())
  );
};
