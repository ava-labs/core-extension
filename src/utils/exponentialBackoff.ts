type ExponentialBackoffOptions = {
  attempt: number; // The current attempt number
  startsAfter?: number; // The attempt number after which the delay should start increasing.
  maxDelay?: number; // The maximum delay (in ms), to avoid waiting for ridiculously long time before next attempts.
};

/**
 * Returns the delay (in milliseconds) before another attempt should start.
 * Runs on power of 2.
 */
export const getExponentialBackoffDelay = ({
  attempt,
  startsAfter = 3,
  maxDelay = 30000,
}: ExponentialBackoffOptions) => {
  return Math.min(maxDelay, 2 ** Math.max(1, attempt - startsAfter + 1) * 1000);
};
