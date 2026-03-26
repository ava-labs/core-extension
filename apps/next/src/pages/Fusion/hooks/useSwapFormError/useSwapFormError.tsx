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
  | 'minimumRequiredTokens'
  | 'currentRequiredTokens'
>;

export const useSwapFormError = ({
  debouncedUserAmount,
  quotes,
  quotesStatus,
  sourceToken,
  minimumTransferAmount,
  currentRequiredTokens,
  minimumRequiredTokens,
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
  const tokenRequirements =
    currentRequiredTokens.state === 'complete'
      ? currentRequiredTokens
      : minimumRequiredTokens;

  if (tokenRequirements.state === 'loading') {
    return null;
  }

  // 3. Validate the amounts on the minimal quote.
  const userQuoteAmountError = validateSwapAmount(sourceAmountBigInt, t, {
    minimumTransferAmount,
    sourceToken,
    requiredTokens: tokenRequirements,
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
