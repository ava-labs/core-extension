export const withTimeout = <T>(
  promise: Promise<T>,
  timeout: number,
): Promise<T> => Promise.race([promise, throwAfter(timeout)]);

const throwAfter = async (timeout: number): Promise<never> =>
  new Promise((_, reject) =>
    setTimeout(() => reject(new Error('Timeout')), timeout),
  );
