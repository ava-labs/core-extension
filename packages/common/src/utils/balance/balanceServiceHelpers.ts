import { BalanceAggregatorServiceErrors } from '@core/types';
import browser from 'webextension-polyfill';

export const setErrorForRequestInSessionStorage = async (
  requestId: string,
  error: BalanceAggregatorServiceErrors,
) => {
  if (!requestId) {
    return;
  }
  await browser.storage.session.set({
    [requestId]: error,
  });
};

export const checkAndCleanupPossibleErrorForRequestInSessionStorage = async (
  requestId: string,
): Promise<boolean> => {
  const sessionStorage = browser?.storage?.session ?? null;

  if (!sessionStorage) {
    return false;
  }

  const possibleBalanceServiceError: { [key: string]: string } =
    await sessionStorage.get(requestId);
  if (
    !possibleBalanceServiceError ||
    possibleBalanceServiceError[requestId] !==
      BalanceAggregatorServiceErrors.ERROR_WHILE_CALLING_BALANCE__SERVICE
  ) {
    return false;
  }

  await sessionStorage.remove([requestId]);
  return true;
};
