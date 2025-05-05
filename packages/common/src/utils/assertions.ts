import { ethErrors } from 'eth-rpc-errors';
import { CommonError, ErrorCode } from '@core/types';

export function assertPresent<T>(
  value: T,
  reason: ErrorCode,
  context?: string,
): asserts value is NonNullable<T> {
  const isNullish = typeof value === 'undefined' || value === null;
  const isEmptyBuffer = Buffer.isBuffer(value) && value.length === 0;

  if (isNullish || isEmptyBuffer || value === '') {
    throw ethErrors.rpc.internal({
      data: {
        reason: reason ?? CommonError.Unknown,
        context,
      },
    });
  }
}

export function assertPropDefined<T, K extends keyof T>(
  obj: T,
  prop: K,
  reason: ErrorCode,
): asserts obj is T & Record<K, NonNullable<T[K]>> {
  assertPresent(obj[prop], reason);
}

type NonEmptyString<T> = T extends '' ? never : T;

export function assertNonEmptyString<T>(
  value: T,
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
  reason?: ErrorCode,
): asserts value is NonNullable<unknown> {
  if (!value) {
    throw ethErrors.rpc.internal({
      data: { reason: reason ?? CommonError.Unknown },
    });
  }
}
