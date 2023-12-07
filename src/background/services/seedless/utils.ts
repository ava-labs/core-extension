export const isTokenExpiredError = (
  err: unknown
): err is Error & { status: 403 } => {
  // When CubeSigner's refresh token (or the entire session) expires,
  // we get a 403 Forbidden error on attempted API calls.
  return err instanceof Error && 'status' in err && err.status === 403;
};

export const isFailedMfaError = (
  err: unknown
): err is Error & { status: 403 } => {
  // When CubeSigner's refresh token (or the entire session) expires,
  // we get a 403 Forbidden error on attempted API calls.
  return (
    err instanceof Error &&
    'status' in err &&
    err.status === 403 &&
    err.message.includes('Invalid')
  );
};
