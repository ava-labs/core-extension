import {
  LEDGER_APP_NOT_INSTALLED_ERROR,
  LEDGER_APP_SWITCH_FAILED_ERROR,
} from '@core/types';

import { classifyLedgerOnboardingError } from './classifyLedgerOnboardingError';

describe('classifyLedgerOnboardingError', () => {
  it.each([
    [new Error(LEDGER_APP_NOT_INSTALLED_ERROR), 'app-not-installed'],
    [LEDGER_APP_NOT_INSTALLED_ERROR, 'app-not-installed'],
    [new Error(LEDGER_APP_SWITCH_FAILED_ERROR), 'no-app'],
    [LEDGER_APP_SWITCH_FAILED_ERROR, 'no-app'],
    [new Error('Ledger: no device detected'), 'unable-to-connect'],
    [new Error('Something else'), 'device-locked'],
  ])('classifies %p as %s', (err, expected) => {
    expect(classifyLedgerOnboardingError(err)).toBe(expected);
  });
});
