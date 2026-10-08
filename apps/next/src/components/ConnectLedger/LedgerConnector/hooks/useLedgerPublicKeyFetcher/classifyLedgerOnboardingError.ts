import {
  LEDGER_APP_NOT_INSTALLED_ERROR,
  LEDGER_APP_SWITCH_FAILED_ERROR,
} from '@core/types';

import { ErrorType } from '../../types';

/**
 * Maps an error thrown during Ledger app-switch (onboarding) into the
 * appropriate {@link ErrorType} so the UI can display a specific message.
 */
export function classifyLedgerOnboardingError(err: unknown): ErrorType {
  const message = err instanceof Error ? err.message : String(err);

  if (message.includes(LEDGER_APP_NOT_INSTALLED_ERROR)) {
    return 'app-not-installed';
  }
  if (message.includes(LEDGER_APP_SWITCH_FAILED_ERROR)) {
    return 'no-app';
  }
  if (message.includes('no device detected')) {
    return 'unable-to-connect';
  }

  return 'device-locked';
}
