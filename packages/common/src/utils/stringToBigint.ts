import Big from 'big.js';

const DECIMAL_NUMBER_REGEX = /^[+-]?(?:\d+(?:\.\d*)?|\.\d+)$/;

/**
 * `.` and `,` swap roles between locales: `1.234,5` and `1,234.5` are both
 * 1234.5. Whichever comes last is the decimal point; the other groups
 * thousands.
 *
 * A single separator is therefore always the decimal point, so `1,500` is 1.5.
 * `core-utils-sdk` only groups an amount that already has a fractional part
 * (its `toLocaleString` returns the integer untouched), so a grouped machine
 * value always carries both separators and can never be mistaken for one.
 */
const normalizeSeparators = (value: string): string => {
  const lastComma = value.lastIndexOf(',');
  const lastDot = value.lastIndexOf('.');

  if (lastComma !== -1 && lastDot !== -1) {
    return lastComma > lastDot
      ? value.replace(/\./g, '').replace(',', '.')
      : value.replace(/,/g, '');
  }

  // A number has at most one decimal point, so a repeated separator groups.
  const separator = lastComma !== -1 ? ',' : '.';
  const occurrences = value.split(separator).length - 1;

  if (occurrences > 1) {
    return value.split(separator).join('');
  }

  return separator === ',' ? value.replace(',', '.') : value;
};

export function stringToBigint(value: string, decimals: number): bigint {
  const normalized = normalizeSeparators(value);

  if (!DECIMAL_NUMBER_REGEX.test(normalized)) {
    throw new Error(`stringToBigint: invalid numeric value "${value}"`);
  }
  const big = Big(normalized);
  const tens = Big(10).pow(decimals);
  const mult = big.times(tens);
  const rawStr = mult.toFixed(0, 0);
  return BigInt(rawStr);
}

export function safeStringToBigint(value: string, decimals: number): bigint {
  try {
    return stringToBigint(value, decimals);
  } catch {
    return 0n;
  }
}
