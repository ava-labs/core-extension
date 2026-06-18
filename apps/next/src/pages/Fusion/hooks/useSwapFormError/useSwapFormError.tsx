import { useTranslation } from 'react-i18next';
import { bigintToBig } from '@avalabs/core-utils-sdk';

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

  // Recurring swaps enforce a higher per-order minimum than one-shot swaps,
  // so surface that first when the toggle is on and the amount is too small.
  if (
    isRecurring &&
    recurringEligibility.isBelowMinimum &&
    recurringEligibility.minimumAmount !== undefined
  ) {
    return t(
      'Amount must be at least {{amount}} {{symbol}} for recurring swaps',
      {
        amount: bigintToBig(
          recurringEligibility.minimumAmount,
          sourceToken.decimals,
        ).toFixed(),
        symbol: sourceToken.symbol,
      },
    );
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
