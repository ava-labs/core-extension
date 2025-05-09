import { ErrorReason } from '@avalabs/bridge-unified';

export const isAddressBlockedError = (err?: unknown) => {
  return (
    !!err &&
    err instanceof Error &&
    err.message === ErrorReason.ADDRESS_IS_BLOCKED
  );
};
