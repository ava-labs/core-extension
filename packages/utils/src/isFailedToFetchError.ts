export const isFailedToFetchError = (err: unknown): boolean => {
  return err instanceof Error && /Failed to fetch/.test(err.message);
};
