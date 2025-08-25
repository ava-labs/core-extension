import {
  isSolanaNativeToken,
  SolanaNativeTokenBalance,
  SolanaSplTokenBalance,
} from '@core/types';

const SOLANA_FIXED_BASE_FEE = 5000n;

export const getSolanaMaxAmount = (
  token: SolanaNativeTokenBalance | SolanaSplTokenBalance,
) => {
  return {
    maxAmount:
      token.balance - (isSolanaNativeToken(token) ? SOLANA_FIXED_BASE_FEE : 0n),
    estimatedFee: SOLANA_FIXED_BASE_FEE,
  };
};
