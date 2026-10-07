import Big from 'big.js';

// A real amount stays under this: at most ~78 integer digits (uint256) plus up
// to 255 fractional (ERC-20 `decimals` is a uint8).
const MAX_EXPANDED_LENGTH = 512;

/**
 * Amounts sometimes arrive in scientific notation (`1.234567e+21`) because a
 * JS `Number` rounded them upstream. Expand to plain decimal digits so two
 * amounts that differ by many orders of magnitude cannot render identically.
 */
export const expandExponentialNotation = (amount: string): string => {
  if (!/[eE]/.test(amount)) {
    return amount;
  }

  const trimmed = amount.trim();
  const explicitPlus = trimmed.startsWith('+');

  let big: Big;
  try {
    big = new Big(explicitPlus ? trimmed.slice(1) : trimmed);
  } catch {
    return amount;
  }

  // Big#toFixed writes every digit. `1e+999999` is inside Big's exponent range
  // and would allocate a huge string during render.
  if (Math.abs(big.e) + big.c.length > MAX_EXPANDED_LENGTH) {
    return amount;
  }

  const expanded = big.toFixed();
  return explicitPlus && !expanded.startsWith('-') ? `+${expanded}` : expanded;
};
