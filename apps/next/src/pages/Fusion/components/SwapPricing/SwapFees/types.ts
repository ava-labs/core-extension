import { FungibleTokenBalance } from '@core/types';

export type TokenAmount = {
  token: FungibleTokenBalance;
  amount: bigint;
};

export type AggregatedFees = {
  amountInFiatCurrency: number;
  isFiatAmountPrecise: boolean;
  tokenAmounts: TokenAmount[];
};
