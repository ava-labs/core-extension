import { useTranslation } from 'react-i18next';

import { FusionState } from '../../types';

import { safeParseUserAmount } from './lib/safeParseUserAmount';
import { validateSwapAmount } from './lib/validateSwapAmount';

type UseSwapFormErrorArgs = Pick<
  FusionState,
  | 'debouncedUserAmount'
  | 'quotes'
  | 'quotesStatus'
  | 'sourceToken'
  | 'minimumTransferAmount'
  | 'currentRequiredTokens'
  | 'recurringEligibility'
> & {
  isRecurring: boolean;
  recurringQuoteError: Error | null;
};

export const useSwapFormError = ({
  debouncedUserAmount,
  quotes,
  quotesStatus,
  sourceToken,
  minimumTransferAmount,
  currentRequiredTokens,
  isRecurring,
  recurringEligibility,
  recurringQuoteError,
}: UseSwapFormErrorArgs) => {
  const { t } = useTranslation();

  // 1. Parse the user amount
  const sourceAmountBigInt = safeParseUserAmount(
    debouncedUserAmount,
    sourceToken,
  );

  // 2. Do not validate if we don't have all the data.
  if (!sourceToken || !sourceAmountBigInt) {
    return '';
  }

  // The per-order minimum is enforced server-side at quote time now, so a
  // too-small (or otherwise un-quotable) recurring amount surfaces as a failed
  // recurring quote rather than a client-side eligibility flag.
  if (isRecurring && recurringEligibility.isEligible && recurringQuoteError) {
    return t("Couldn't get a recurring quote for this amount.");
  }

  if (currentRequiredTokens.state === 'loading') {
    return null;
  }

  // 3. Validate the amounts on the minimal quote.
  const userQuoteAmountError = validateSwapAmount(sourceAmountBigInt, t, {
    minimumTransferAmount,
    sourceToken,
    requiredTokens: currentRequiredTokens,
  });

  if (userQuoteAmountError) {
    return userQuoteAmountError;
  }

  // 4. Show message if no quotes are found.
  if (quotesStatus !== 'loading' && quotes.length === 0) {
    return t('No quotes found for selected token pair.');
  }

  return '';
};
