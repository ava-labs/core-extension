import { CommonError } from '@core/types';
import {
  assert,
  assertNonEmptyString,
  assertPresent,
  assertPropDefined,
  assertTrue,
} from './assertions';

const expectRpcError = (fn: () => void, data: Record<string, unknown>) => {
  try {
    fn();
  } catch (err) {
    expect(err).toEqual(expect.objectContaining({ data }));
    return;
  }
  throw new Error('Expected the assertion to throw');
};

describe('utils/assertions', () => {
  describe('assertPresent', () => {
    it.each([undefined, null, '', Buffer.alloc(0)])(
      'throws for %p',
      (value) => {
        expectRpcError(() => assertPresent(value, CommonError.Unknown, 'ctx'), {
          reason: CommonError.Unknown,
          context: 'ctx',
        });
      },
    );

    it.each([0, false, 'value', Buffer.from([1]), {}])(
      'accepts %p',
      (value) => {
        expect(() => assertPresent(value, CommonError.Unknown)).not.toThrow();
      },
    );
  });

  describe('assertPropDefined', () => {
    it('throws when the property is missing', () => {
      expectRpcError(
        () =>
          assertPropDefined(
            { a: undefined } as { a?: string },
            'a',
            CommonError.Unknown,
          ),
        { reason: CommonError.Unknown },
      );
    });

    it('accepts a defined property', () => {
      expect(() =>
        assertPropDefined({ a: 'x' }, 'a', CommonError.Unknown),
      ).not.toThrow();
    });
  });

  describe('assertNonEmptyString', () => {
    it.each(['', 1, undefined])('throws for %p', (value) => {
      expectRpcError(() => assertNonEmptyString(value), {
        reason: 'Expected non-empty string',
        value,
      });
    });

    it('accepts a non-empty string', () => {
      expect(() => assertNonEmptyString('value')).not.toThrow();
    });
  });

  describe('assertTrue', () => {
    it.each([false, 1, 'true'])('throws for %p', (condition) => {
      expectRpcError(() => assertTrue(condition), {
        reason: 'Expected condition to evaluate as true',
        evaluationResult: condition,
      });
    });

    it('accepts true', () => {
      expect(() => assertTrue(true)).not.toThrow();
    });
  });

  describe('assert', () => {
    it('throws with the given reason for falsy values', () => {
      expectRpcError(() => assert(0, CommonError.NetworkError), {
        reason: CommonError.NetworkError,
      });
    });

    it('falls back to the unknown reason', () => {
      expectRpcError(() => assert(null), { reason: CommonError.Unknown });
    });
  });
});
