import splitSeedPhrase from './splitSeedPhrase';

describe('src/pages/Onboarding/utils/splitSeedPhrase', () => {
  it('trims whitespaces', () => {
    expect(splitSeedPhrase(' \n  word word2  word3\n \n')).toStrictEqual([
      'word',
      'word2',
      'word3',
    ]);
  });

  it('splits by tabulators', () => {
    expect(splitSeedPhrase('word		word2 word3')).toStrictEqual([
      'word',
      'word2',
      'word3',
    ]);
  });

  it('splits by newline', () => {
    expect(splitSeedPhrase('word\n  word2  \nword3 ')).toStrictEqual([
      'word',
      'word2',
      'word3',
    ]);
  });
});
