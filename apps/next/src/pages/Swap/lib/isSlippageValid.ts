import { MIN_SLIPPAGE, MAX_SLIPPAGE } from '../swap-config';

export const isSlippageValid = (value: string) => {
  const numValue = parseFloat(value);
  return numValue >= MIN_SLIPPAGE && numValue <= MAX_SLIPPAGE;
};
