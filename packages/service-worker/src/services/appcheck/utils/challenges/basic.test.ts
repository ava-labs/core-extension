import { Algorithm } from '@core/types';
import getHashByAlgorithm from '../getHashByAlgorithm';
import solveBasicChallenge from './basic';

jest.mock('../getHashByAlgorithm');

describe('basic', () => {
  beforeEach(() => {
    jest.resetAllMocks();
  });

  it('throws when params are incorrect', () => {
    expect(() => solveBasicChallenge('{}')).toThrow(
      'invalid basic challenge details',
    );
  });

  it('solves the challenge correctly', () => {
    jest
      .mocked(getHashByAlgorithm)
      .mockReturnValueOnce('0123')
      .mockReturnValueOnce('00123')
      .mockReturnValueOnce('000123');

    const details = {
      token: '123',
      difficulty: 3,
      algorithm: Algorithm.SHA256,
    };

    expect(solveBasicChallenge(JSON.stringify(details))).toBe('000123.3');
  });
});
