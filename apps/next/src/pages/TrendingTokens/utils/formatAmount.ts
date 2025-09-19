import memoize from 'lodash/memoize';

// this file came from mobile to match formatting: See utils/FormatCurrency.ts in core-mobile
export type NotationTypes = Pick<
  Intl.NumberFormatOptions,
  'notation'
>['notation'];

interface FormatCurrencyProps {
  amount: number;
  currency: string;
  boostSmallNumberPrecision: boolean;
  notation?: NotationTypes;
  showLessThanThreshold?: boolean;
}

export function formatCurrency({
  amount,
  currency,
  boostSmallNumberPrecision,
  notation,
  showLessThanThreshold = false,
}: FormatCurrencyProps): string {
  const formatter = selectCurrencyFormat({
    amount,
    currency,
    boostSmallNumberPrecision,
    notation,
  });

  const absAmount = Math.abs(amount);
  const formatted =
    showLessThanThreshold && absAmount < 0.001
      ? `<${formatter.format(0.001)}`
      : formatter.format(amount);

  // Check if the currency appears at the beginning
  if (formatted.startsWith(currency)) {
    // Move the currency to the end
    return `${formatted.slice(currency.length).trim()} ${currency}`;
  }

  // Check if the currency appears after a sign (e.g., "-CHF 10")
  const [, sign, currencyMatch, number] = formatted.match(
    /^([-+])\s*([A-Z]{3})\s*(.*)/,
  ) ?? [undefined, undefined, undefined, ''];
  if (currencyMatch && currencyMatch === currency) {
    return `${sign}${number.trim()} ${currency}`;
  }

  // Default case: return the formatted string as is
  return formatted;
}

const selectCurrencyFormat = ({
  amount,
  currency,
  boostSmallNumberPrecision,
  notation,
}: FormatCurrencyProps): Intl.NumberFormat => {
  // Compact won't work without polyfills, so use formatLargeCurrency instead
  if (notation === 'compact') {
    return getCompactFormat(currency);
  }

  const absAmount = Math.abs(amount);

  if (boostSmallNumberPrecision && absAmount < 0.1) {
    return getHighPrecisionFormat(currency);
  }

  if (absAmount < 0.01) {
    return getTenthsOfCentsFormat(currency);
  }

  return getStandardFormat(currency);
};

// Purpose: The default formatter for amounts ≥ 1, using 2 decimal places (e.g., "$5.68").
// Acts as the "standard" currency formatter.
const getStandardFormat = memoize(
  (currency: string) =>
    new Intl.NumberFormat('en-US', {
      ...commonNumberFormat(currency),
      maximumFractionDigits: 2,
    }),
);

// Purpose: Formats amounts < 0.01 with 3 decimal places.
// For example "$0.005"
const getTenthsOfCentsFormat = memoize(
  (currency: string) =>
    new Intl.NumberFormat('en-US', {
      ...commonNumberFormat(currency),
      maximumFractionDigits: 3,
    }),
);

// Purpose: Formats small numbers (< 1) with high precision (up to 8 decimal places) when boostSmallNumberPrecision is true.
// Used for cases needing extra precision beyond the standard formatting.
const getHighPrecisionFormat = memoize(
  (currency: string) =>
    new Intl.NumberFormat('en-US', {
      ...commonNumberFormat(currency),
      maximumFractionDigits: 6,
      roundingMode: 'floor',
    }),
);

// Purpose: Formats numbers in compact notation (e.g., "$1.2K" instead of "$1200").
// Uses 2 decimal places, designed for large numbers in a shorthand format
const getCompactFormat = memoize(
  (currency: string) =>
    new Intl.NumberFormat('en-US', {
      ...commonNumberFormat(currency),
      minimumFractionDigits: 0,
      maximumFractionDigits: 2,
      notation: 'compact',
    }),
);

const commonNumberFormat = (
  currency: string,
): Partial<Intl.NumberFormatOptions> => {
  return {
    style: 'currency',
    currency,
    currencyDisplay: 'symbol', // the extension uses 'narrowSymbol'
    minimumFractionDigits: 2,
  };
};
