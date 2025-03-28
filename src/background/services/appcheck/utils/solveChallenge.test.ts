import { ChallengeTypes } from '../models';
import solveChallenge from './solveChallenge';
import solveBasicChallenge from './challenges/basic';
import solveReverseChallenge from './challenges/reverse';

jest.mock('./challenges/basic');
jest.mock('./challenges/reverse');

describe('solveChallenge', () => {
  const solution = 'solution';
  const challengeDetails = '{}';

  beforeEach(() => {
    jest.resetAllMocks();

    jest.mocked(solveBasicChallenge).mockReturnValueOnce(solution);
    jest.mocked(solveReverseChallenge).mockReturnValueOnce(solution);
  });

  it('solves basic challenges correctly', async () => {
    expect(
      solveChallenge({ type: ChallengeTypes.BASIC, challengeDetails }),
    ).resolves.toBe(solution);
    expect(solveBasicChallenge).toHaveBeenCalledWith(challengeDetails);
  });

  it('solves reverse challenges correctly', async () => {
    expect(
      solveChallenge({ type: ChallengeTypes.REVERSE, challengeDetails }),
    ).resolves.toBe(solution);
    expect(solveReverseChallenge).toHaveBeenCalledWith(challengeDetails);
  });
});
