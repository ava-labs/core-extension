import { isUserRejectionError } from './errors';

/**
 * Use this util function to distinguish between the user rejecting the
 */
export async function handleTxOutcome<T>(txRequestPromise: Promise<T>): Promise<
  | {
      isApproved: true;
      result: T;
      error?: never;
      hasError: false;
    }
  | {
      isApproved: boolean;
      result?: never;
      error: unknown;
      hasError: true;
    }
> {
  try {
    const result = await txRequestPromise;

    return {
      isApproved: true,
      hasError: false,
      result,
    };
  } catch (error) {
    return {
      isApproved: !isUserRejectionError(error),
      hasError: true,
      error,
    };
  }
}
