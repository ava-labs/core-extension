import Big from 'big.js';
import { SwapProviders } from '../types';

interface NormalizeAmountForProviderParams {
  amount: string;
  decimal: number;
  provider: SwapProviders;
}

export const normalizeAmountForNotificationForProvider = ({
  provider,
  amount,
  decimal,
}: NormalizeAmountForProviderParams): string => {
  if (provider === SwapProviders.MARKR) {
    return new Big(amount).times(10 ** decimal).toString();
  }

  return amount;
};
