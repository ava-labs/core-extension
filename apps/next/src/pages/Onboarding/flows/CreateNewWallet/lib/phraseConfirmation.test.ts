import { getConfirmationWords } from './phraseConfirmation';

describe('getConfirmationWords', () => {
  const words = [
    'apple',
    'banana',
    'cherry',
    'date',
    'elderberry',
    'fig',
    'grape',
    'honeydew',
    'kiwi',
    'lemon',
    'mango',
    'nectarine',
    'orange',
    'pear',
    'pineapple',
    'quince',
    'raspberry',
    'strawberry',
    'tangerine',
    'watermelon',
  ];
  const wordsCount = 3;
  const optionsCount = 3;
  const confirmationWords = getConfirmationWords(
    words,
    wordsCount,
    optionsCount,
  );
  it('should return a map of confirmation words', () => {
    expect(confirmationWords).toBeDefined();
    expect(confirmationWords.size).toBe(wordsCount);
  });

  it('should return a list of options for each random word with the correct index provided', () => {
    for (const [_, entry] of confirmationWords.entries()) {
      expect(entry.options).toHaveLength(optionsCount);
      expect(entry.options).toContain(entry.correctIndex);
    }
  });
});
