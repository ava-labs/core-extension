import { ChallengeTypes } from '../models';
import solveBasicChallenge from './challenges/basic';
import solveChallenge from './solveChallenge';

jest.mock('./challenges/basic');

describe('solveChallenge', () => {
  const solution = 'solution';
  const challengeDetails = '{}';

  beforeEach(() => {
    jest.resetAllMocks();

    jest.mocked(solveBasicChallenge).mockReturnValueOnce(solution);
  });

  it('solves basic challenges correctly', async () => {
    expect(
      solveChallenge({ type: ChallengeTypes.BASIC, challengeDetails }),
    ).resolves.toBe(solution);
    expect(solveBasicChallenge).toHaveBeenCalledWith(challengeDetails);
  });
});
