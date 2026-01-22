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
  amount,
  overlineProps,
  regularProps,
  stackProps,
  showApproximationSign = true,
  showTooltip = true,
}: CollapsedTokenAmountProps) => {
  const finalOverlineProps = { ...defaultOverlineProps, ...overlineProps };
  const finalRegularProps = { ...defaultRegularProps, ...regularProps };

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
