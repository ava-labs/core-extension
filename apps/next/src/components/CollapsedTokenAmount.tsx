import {
  Stack,
  StackProps,
  Tooltip,
  Typography,
  TypographyProps,
} from '@avalabs/k2-alpine';

type CollapsedTokenAmountProps = {
  amount: string;
  overlineProps?: TypographyProps;
  regularProps?: TypographyProps;
  stackProps?: StackProps;
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

/**
 * When dealing with super small numbers, like 0.0000000000001, we want to
 * collapse the number of zeroes to a more readable format.
 *
 * For example, 0.0000001 becomes 0.0₆1, representing 0.(six zeroes)1.
 *
 * Any digits following the consecutive zeroes will be limited
 * to MAX_DIGITS_AFTER_CONSECUTIVE_ZEROES.
 *
 * For rexample: 0.0000001000005 becomes 0.0₆10, not 0.0₆1000005.
 */
export const CollapsedTokenAmount = ({
  amount,
  overlineProps,
  regularProps,
  stackProps,
}: CollapsedTokenAmountProps) => {
  const finalOverlineProps = { ...defaultOverlineProps, ...overlineProps };
  const finalRegularProps = { ...defaultRegularProps, ...regularProps };

  const [integer, fraction] = amount.split('.');

  if (!fraction || (fraction && fraction.length <= MAX_FRACTION_SIZE)) {
    return <Typography {...finalRegularProps}>{amount}</Typography>;
  }

  const indexOfNonZero = fraction?.search(/[1-9]/);

  if (indexOfNonZero === -1) {
    return <Typography {...finalRegularProps}>{integer}</Typography>;
  }

  const zeroCount = fraction.slice(0, indexOfNonZero).length;

  if (fraction && indexOfNonZero >= CONSECUTIVE_ZEROES_THRESHOLD) {
    return (
      <Tooltip title={amount}>
        <Stack
          direction="row"
          width="100%"
          justifyContent="flex-end"
          {...stackProps}
        >
          <Typography {...finalRegularProps}>{integer}.0</Typography>
          <Typography {...finalOverlineProps}>{zeroCount}</Typography>
          <Typography {...finalRegularProps}>
            {fraction.slice(
              indexOfNonZero,
              indexOfNonZero + MAX_DIGITS_AFTER_CONSECUTIVE_ZEROES,
            )}
          </Typography>
        </Stack>
      </Tooltip>
    );
  }

  // If the fraction is longer than the max fraction size, but we can't collapse
  // the zeroes, let's truncate the amount and show an approximation with the
  // exact amount in a tooltip.
  if (fraction && fraction.length > MAX_FRACTION_SIZE) {
    return (
      <Tooltip title={amount}>
        <Typography {...finalRegularProps}>
          {integer}.{fraction.substring(0, MAX_FRACTION_SIZE)}
        </Typography>
      </Tooltip>
    );
  }

  return <Typography {...finalRegularProps}>{amount}</Typography>;
};
