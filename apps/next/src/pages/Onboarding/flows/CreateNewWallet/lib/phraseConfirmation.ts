import { shuffle } from 'lodash';

/**
 * When creating a new wallet, we need to confirm the user has written
 * down the seedphrase correctly.
 *
 * The way we do this is by choosing three random indices in the range from 0 to N
 * (where N is the number of words in the seedphrase) and then asking the user
 * to select either the word corresponding to that index or the word that comes after it.
 *
 * This function is used to generate a map of those random indices, list of 3 possible answers
 * (where only is correct) and the expected answer.
 */

type ConfirmationWords = Map<
  number,
  { options: number[]; correctIndex: number }
>;

export const getConfirmationWords = (
  words: string[],
  wordsCount: number,
  optionsCount: number,
): ConfirmationWords => {
  const chosenIndices = getRandomWordIndices(wordsCount);
  const dictionary: ConfirmationWords = new Map();

  for (const index of chosenIndices) {
    const correctIndex =
      index === 0 || index === words.length - 1 ? index : index + 1;
    const optionIndices = getRandomWordIndices(optionsCount - 1, correctIndex);
    const options = shuffle([correctIndex, ...optionIndices]);
    dictionary.set(index, { options, correctIndex });
  }

  return dictionary;
};

export const validateAnswers = (
  confirmationWords: ConfirmationWords,
  answers: number[],
) =>
  Array.from(confirmationWords.values()).every(
    ({ correctIndex }, index) => correctIndex === answers[index],
  );

const getRandomWordIndices = (count: number, forbiddenIndice?: number) => {
  const chosenIndices = new Set<number>();

  while (chosenIndices.size < count) {
    const randomIndex = Math.floor(Math.random() * 24); // We only generate 24-word seedphrases

    if (randomIndex === forbiddenIndice || chosenIndices.has(randomIndex)) {
      continue;
    }

    chosenIndices.add(randomIndex);
  }

  return chosenIndices;
};
