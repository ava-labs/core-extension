import Big from 'big.js';

export function stringToBigint(value: string, decimals: number): bigint {
  const big = Big(value.replace(/,/gi, ''));
  const tens = Big(10).pow(decimals);
  const mult = big.times(tens);
  const rawStr = mult.toFixed(0, 0);
  return BigInt(rawStr);
}
