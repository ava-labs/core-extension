import { stringToBigint } from '@core/common';
import { FungibleTokenBalance } from '@core/types';

const DECIMAL_NUMBER_REGEX = /^\d*\.?\d*$/;

export const safeParseUserAmount = (
  userAmount: string,
  sourceToken?: FungibleTokenBalance,
) => {
  if (!sourceToken || !userAmount || !DECIMAL_NUMBER_REGEX.test(userAmount)) {
    return 0n;
  }

  try {
    return stringToBigint(userAmount, sourceToken.decimals);
  } catch {
    return 0n;
  }
};
