import solveReverseChallenge from './reverse';

describe('reverse', () => {
  beforeEach(() => {
    jest.resetAllMocks();
  });

  it('throws when params are incorrect', () => {
    expect(() => solveReverseChallenge('{}')).toThrow(
      'invalid reverse challenge details',
    );
  });

  it('solves the challenge correctly', () => {
    const details = {
      token: 'abde8a8173a35ddb5aa34abc0d7efe7293d9f365732d6a109a6aa2add64bb0df',
    };

    expect(solveReverseChallenge(JSON.stringify(details))).toBe(
      'fd0bb46dda2aa6a901a6d237563f9d3927efe7d0cba43aa5bdd53a3718a8edba',
    );
  });
});
