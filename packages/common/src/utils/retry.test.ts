import { RetryBackoffPolicy } from './retry';

describe('RetryBackoffPolicy', () => {
  describe('exponential()', () => {
    it('returns 2^i * 1000 (ms)', () => {
      const policy = RetryBackoffPolicy.exponential();
      expect(policy(0)).toBe(1000);
      expect(policy(1)).toBe(2000);
      expect(policy(2)).toBe(4000);
      expect(policy(3)).toBe(8000);
    });
  });

  describe('constant()', () => {
    it('returns secondsToDelay * 1000 (ms) regardless of index', () => {
      const policy = RetryBackoffPolicy.constant(1); // 1s
      expect(policy(0)).toBe(1000);
      expect(policy(3)).toBe(1000);
      expect(policy(10)).toBe(1000);
    });
  });

  describe('constantMs()', () => {
    it('returns the fixed ms regardless of index', () => {
      const policy = RetryBackoffPolicy.constantMs(250);
      expect(policy(0)).toBe(250);
      expect(policy(5)).toBe(250);
    });
  });

  describe('linearThenExponential()', () => {
    /**
     * Spec (from JSDoc):
     * - First `linearCount` retries increase linearly by `linearStepMs`
     * - After that, the *increment itself* grows exponentially based on `linearStepMs`
     *   Example for (linearCount=4, linearStepMs=1000):
     *     1s, 2s, 3s, 4s, 6s, 10s, 18s, 34s...
     *
     * Interpretation used in the test:
     * - Linear phase (i = 0..linearCount-1): delay = (i+1) * step
     * - Exponential-increment phase (i >= linearCount):
     *     start from cumulative = linearCount * step,
     *     start increment = 2 * step (not 1 * step),
     *     each next step doubles the increment.
     */
    it('matches the documented example sequence for (linearCount=4, step=1000)', () => {
      const linearCount = 4;
      const step = 1000;
      const policy = RetryBackoffPolicy.linearThenExponential(
        linearCount,
        step,
      );

      // Expected: 1s, 2s, 3s, 4s, 6s, 10s, 18s, 34s (in ms)
      const expected = [1000, 2000, 3000, 4000, 6000, 10000, 18000, 34000];

      const actual = expected.map((_, i) => policy(i));
      expect(actual).toEqual(expected);
    });

    it('works for different parameters (linearCount=2, step=500)', () => {
      const linearCount = 2;
      const step = 500;
      const policy = RetryBackoffPolicy.linearThenExponential(
        linearCount,
        step,
      );

      // Build expected iteratively using the same interpretation:
      // i=0..1: 500, 1000
      // then increments: +1000, +2000, +4000, ...
      const expected: number[] = [];
      let cumulative = 0;
      let inc = 2 * step; // first exponential increment after linear

      for (let i = 0; i < 7; i++) {
        if (i < linearCount) {
          expected.push((i + 1) * step);
        } else {
          if (i === linearCount) cumulative = linearCount * step;
          cumulative += inc;
          expected.push(cumulative);
          inc *= 2;
        }
      }

      const actual = expected.map((_, i) => policy(i));
      expect(actual).toEqual(expected);
    });

    it('is strictly increasing (monotonic)', () => {
      const policy = RetryBackoffPolicy.linearThenExponential(3, 750);

      const seq: number[] = Array.from({ length: 10 }, (_, i) => policy(i));
      for (let i = 1; i < seq.length; i++) {
        expect(seq[i]).toBeGreaterThan(seq[i - 1]!);
      }
    });
  });
});
