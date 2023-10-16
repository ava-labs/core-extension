import { getExponentialBackoffDelay } from './exponentialBackoff';

describe('src/utils/exponentialBackoff.ts', () => {
  describe('with default settings', () => {
    it.each([
      { attempt: 1, expectedDelay: 2000 },
      { attempt: 2, expectedDelay: 2000 },
      { attempt: 3, expectedDelay: 2000 },
      { attempt: 4, expectedDelay: 4000 },
      { attempt: 5, expectedDelay: 8000 },
    ])(
      'returns $expectedDelay for attempt $attempt',
      ({ attempt, expectedDelay }) => {
        expect(getExponentialBackoffDelay({ attempt })).toEqual(expectedDelay);
      }
    );

    it('maxes out on 30000ms', () => {
      expect(getExponentialBackoffDelay({ attempt: 10 })).toEqual(30000);
    });
  });

  describe('with "startsAfter: 1" setting', () => {
    it.each([
      { attempt: 1, expectedDelay: 2000 },
      { attempt: 2, expectedDelay: 4000 },
      { attempt: 3, expectedDelay: 8000 },
      { attempt: 4, expectedDelay: 16000 },
    ])(
      'returns $expectedDelay for attempt $attempt',
      ({ attempt, expectedDelay }) => {
        expect(getExponentialBackoffDelay({ attempt, startsAfter: 1 })).toEqual(
          expectedDelay
        );
      }
    );
  });

  describe('with custom "maxDelay" setting', () => {
    it('does not grow larger than said setting', () => {
      expect(
        getExponentialBackoffDelay({ attempt: 10, maxDelay: 1000 })
      ).toEqual(1000);

      expect(
        getExponentialBackoffDelay({ attempt: 100, maxDelay: 5000 })
      ).toEqual(5000);
    });
  });
});
