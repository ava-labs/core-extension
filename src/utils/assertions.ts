import { ethErrors } from 'eth-rpc-errors';
import { CommonError, ErrorCode } from './errors';

export function assertPresent<T>(
  value: T,
  reason: ErrorCode
): asserts value is NonNullable<T> {
  if (typeof value === 'undefined' || value === null) {
    throw ethErrors.rpc.internal({
      data: {
        reason: reason ?? CommonError.Unknown,
      },
    });
  }
}

type NonEmptyString<T> = T extends '' ? never : T;

export function assertNonEmptyString<T>(
  value: T
): asserts value is NonEmptyString<T> {
  if (typeof value !== 'string' || value === '') {
    throw ethErrors.rpc.internal({
      data: {
        reason: 'Expected non-empty string',
        value,
      },
    });
  }
}

export function assertTrue(condition: unknown): asserts condition is true {
  if (condition !== true) {
    throw ethErrors.rpc.internal({
      data: {
        reason: 'Expected condition to evaluate as true',
        evaluationResult: condition,
      },
    });
  }
}

export function assert(
  value: unknown,
  reason?: ErrorCode
): asserts value is NonNullable<unknown> {
  if (!value) {
    throw ethErrors.rpc.internal({
      data: { reason: reason ?? CommonError.Unknown },
    });
  }
}
