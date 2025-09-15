import { MIN_SLIPPAGE } from '../swap-config';

export const isSlippageValid = (value: string) => {
  if (MIN_SLIPPAGE <= parseFloat(value) && parseFloat(value) <= 100) {
    return true;
  }
  return false;
};
