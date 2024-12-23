export const isFulfilled = <T>(
  x: PromiseSettledResult<T>,
): x is PromiseFulfilledResult<T> => x.status === 'fulfilled';
