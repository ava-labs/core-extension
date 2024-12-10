import { isUserRejectionError } from './errors';

/**
 * Use this util function to distinguish between the user rejecting the
 */
export async function handleTxOutcome<T>(txRequestPromise: Promise<T>): Promise<
  | {
      isApproved: boolean;
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

    console.log('result', result);

    return {
      isApproved: true,
      hasError: false,
      result,
    };
  } catch (err) {
    return {
      isApproved: !isUserRejectionError(err),
      hasError: true,
      error: err,
    };
  }
}
