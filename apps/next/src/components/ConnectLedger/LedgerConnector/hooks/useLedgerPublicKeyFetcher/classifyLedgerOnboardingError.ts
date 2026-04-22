import {
  getLedgerAutoOpenAppFailedMessage,
  getLedgerQuitAppFailedMessage,
} from '@core/common';

import { ErrorType } from '../../types';

/**
 * Maps an error thrown during Ledger app-switch (onboarding) into the
 * appropriate {@link ErrorType} so the UI can display a specific message.
 */
export function classifyLedgerOnboardingError(
  err: unknown,
  appName: string,
): ErrorType {
  const message = err instanceof Error ? err.message : String(err);

  if (message.includes('not installed on this Ledger device')) {
    return 'app-not-installed';
  }
  if (message === getLedgerAutoOpenAppFailedMessage(appName)) {
    return 'no-app';
  }
  if (message === getLedgerQuitAppFailedMessage()) {
    return 'no-app';
  }
  if (message.includes('no device detected')) {
    return 'unable-to-connect';
  }

  return 'device-locked';
}
