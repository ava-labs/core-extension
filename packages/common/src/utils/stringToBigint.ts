import Big from 'big.js';

const DECIMAL_NUMBER_REGEX = /^[+-]?(\d+\.?\d*|\.\d+)$/;

export function stringToBigint(value: string, decimals: number): bigint {
  if (!DECIMAL_NUMBER_REGEX.test(value)) {
    throw new Error(`stringToBigint: invalid numeric value "${value}"`);
  }
  const big = Big(value);
  const tens = Big(10).pow(decimals);
  const mult = big.times(tens);
  const rawStr = mult.toFixed(0, 0);
  return BigInt(rawStr);
}
