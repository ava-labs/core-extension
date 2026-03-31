import { stringToBigint } from '@core/common';
import { FungibleTokenBalance } from '@core/types';

export const safeParseUserAmount = (
  userAmount: string,
  sourceToken?: FungibleTokenBalance,
) => {
  if (!sourceToken || !userAmount) {
    return 0n;
  }

  try {
    return stringToBigint(userAmount, sourceToken.decimals);
  } catch {
    return 0n;
  }
};
