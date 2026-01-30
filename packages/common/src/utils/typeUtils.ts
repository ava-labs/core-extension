export const isFulfilled = <T>(
  x: PromiseSettledResult<T>,
): x is PromiseFulfilledResult<T> => x.status === 'fulfilled';

export const isRejected = <T>(
  x: PromiseSettledResult<T>,
): x is PromiseRejectedResult => x.status === 'rejected';

export const isNotNullish = <T>(x: T): x is NonNullable<T> => x != null;
