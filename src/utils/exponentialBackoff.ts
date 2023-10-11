type ExponentialBackoffOptions = {
  attempt: number; // The current attempt number
  startsAfter?: number; // The attempt number after which the delay should start increasing.
};

/**
 * Returns the delay (in milliseconds) before another attempt should start.
 * Runs on power of 2.
 */
export const getExponentialBackoffDelay = ({
  attempt,
  startsAfter = 3,
}: ExponentialBackoffOptions) => {
  return 2 ** Math.max(1, attempt - startsAfter + 1) * 1000;
};
