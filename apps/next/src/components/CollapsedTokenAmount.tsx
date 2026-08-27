import {
  Stack,
  StackProps,
  Tooltip,
  Typography,
  TypographyProps,
} from '@avalabs/k2-alpine';
import { ReactElement } from 'react';

type CollapsedTokenAmountProps = {
  amount: string;
  overlineProps?: TypographyProps;
  regularProps?: TypographyProps;
  stackProps?: StackProps;
  showApproximationSign?: boolean;
  showTooltip?: boolean;
};

const defaultOverlineProps: TypographyProps = {
  variant: 'subtitle3',
  sx: {
    transform: 'translateY(40%)',
  },
} as const;

const defaultRegularProps: TypographyProps = {
  variant: 'h2',
  fontWeight: 500,
} as const;

const EXPONENTIAL_NOTATION = /^([+-]?)(\d+)(?:\.(\d+))?[eE]([+-]?\d+)$/;

/**
 * SECURITY: amounts reach us as strings, and some of them arrive in scientific
 * notation (large ERC-1155 values are converted through a JS `Number` upstream,
 * so `1234567000000000000000` becomes `"1.234567e+21"`). The collapsing logic
 * below splits on `"."` and truncates the fraction, which silently drops the
 * exponent: both `1.234567e+21` and `1.234567e+28` would render as `1.23456`,
 * making transfers that differ by 10,000,000x look identical.
 *
 * Expand the notation into plain decimal digits first, using string arithmetic
 * so no precision is lost.
 */
export const expandExponentialNotation = (amount: string): string => {
  const match = amount.trim().match(EXPONENTIAL_NOTATION);

  if (!match) {
    return amount;
  }

  const [, sign = '', integerDigits = '', fractionDigits = '', exponent = '0'] =
    match;
  const digits = `${integerDigits}${fractionDigits}`;
  // Where the decimal point lands within `digits` once the exponent is applied.
  const pointIndex = integerDigits.length + Number(exponent);

  let expanded: string;

  if (pointIndex <= 0) {
    expanded = `0.${'0'.repeat(-pointIndex)}${digits}`;
  } else if (pointIndex >= digits.length) {
    expanded = `${digits}${'0'.repeat(pointIndex - digits.length)}`;
  } else {
    expanded = `${digits.slice(0, pointIndex)}.${digits.slice(pointIndex)}`;
  }

  if (expanded.includes('.')) {
    expanded = expanded.replace(/0+$/, '').replace(/\.$/, '');
  }

  return `${sign}${expanded}`;
};

const CONSECUTIVE_ZEROES_THRESHOLD = 4;
const MAX_FRACTION_SIZE = 5;
const MAX_DIGITS_AFTER_CONSECUTIVE_ZEROES = 2;
const TOOLTIP_MIN_INTEGER_LENGTH = 10;

/**
 * When dealing with super small numbers, like 0.0000000000001, we want to
 * collapse the number of zeroes to a more readable format.
 *
 * For example, 0.0000001 becomes 0.0₆1, representing 0.(six zeroes)1.
 *
 * Any digits following the consecutive zeroes will be limited
 * to MAX_DIGITS_AFTER_CONSECUTIVE_ZEROES.
 *
 * For example: 0.0000001000005 becomes 0.0₆10, not 0.0₆1000005.
 */
export const CollapsedTokenAmount = ({
  amount: rawAmount,
  overlineProps,
  regularProps,
  stackProps,
  showApproximationSign = true,
  showTooltip = true,
}: CollapsedTokenAmountProps) => {
  const finalOverlineProps = { ...defaultOverlineProps, ...overlineProps };
  const finalRegularProps = { ...defaultRegularProps, ...regularProps };

  const amount = expandExponentialNotation(rawAmount);

  const [integer, fraction] = amount.split('.');

  const possibleIntegerOverflow = Boolean(
    integer && integer.length > TOOLTIP_MIN_INTEGER_LENGTH,
  );

  if (!fraction || (fraction && fraction.length <= MAX_FRACTION_SIZE)) {
    return withTooltip(
      showTooltip && possibleIntegerOverflow,
      amount,
      <Typography {...finalRegularProps}>{amount}</Typography>,
    );
  }

  const indexOfNonZero = fraction?.search(/[1-9]/);

  if (indexOfNonZero === -1) {
    return withTooltip(
      showTooltip && possibleIntegerOverflow,
      amount,
      <Typography {...finalRegularProps}>{integer}</Typography>,
    );
  }

  const zeroCount = fraction.slice(0, indexOfNonZero).length;

  if (fraction && indexOfNonZero >= CONSECUTIVE_ZEROES_THRESHOLD) {
    return withTooltip(
      showTooltip,
      amount,
      <Stack
        alignItems="center"
        direction="row"
        width="100%"
        justifyContent="flex-end"
        {...stackProps}
      >
        <Typography {...finalRegularProps}>{integer}</Typography>
        <Typography {...finalRegularProps} flexShrink={0}>
          .0
        </Typography>
        <Typography {...finalOverlineProps} flexShrink={0}>
          {zeroCount}
        </Typography>
        <Typography {...finalRegularProps} flexShrink={0}>
          {fraction.slice(
            indexOfNonZero,
            indexOfNonZero + MAX_DIGITS_AFTER_CONSECUTIVE_ZEROES,
          )}
        </Typography>
      </Stack>,
    );
  }

  // If the fraction is longer than the max fraction size, but we can't collapse
  // the zeroes, let's truncate the amount and show an approximation with the
  // exact amount in a tooltip.
  if (fraction && fraction.length > MAX_FRACTION_SIZE) {
    const approximationSign = showApproximationSign ? '~' : '';

    return withTooltip(
      showTooltip,
      amount,
      <Typography {...finalRegularProps}>
        {approximationSign}
        {integer}.{fraction.substring(0, MAX_FRACTION_SIZE)}
      </Typography>,
    );
  }

  return <Typography {...finalRegularProps}>{amount}</Typography>;
};

const withTooltip = (
  showTooltip: boolean,
  title: string,
  children: ReactElement,
) => {
  return showTooltip ? <Tooltip title={title}>{children}</Tooltip> : children;
};
