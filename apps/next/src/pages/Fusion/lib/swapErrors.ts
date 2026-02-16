export const isGasEstimationError = (error: unknown) => {
  return (
    error instanceof Error &&
    error.message.includes('Error during gas estimation')
  );
};

export const isInvalidResponseError = (error: unknown) => {
  return (
    error instanceof Error &&
    (error.message.includes('Invalid response') ||
      error.message.includes('Response validation failed'))
  );
};

export const shouldRetryWithNextQuote = (error: unknown) =>
  [isGasEstimationError, isInvalidResponseError].some((checker) =>
    checker(error),
  );
