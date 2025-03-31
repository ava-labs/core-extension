import { Stack, Typography } from '@avalabs/core-k2-components';

export function TruncateFeeAmount({ amount }: { amount: string }) {
  const [integer, fraction] = amount.split('.');
  if (!fraction || (fraction && fraction.length <= 5)) {
    return (
      <Typography
        variant="body2"
        component="span"
        color="text.primary"
        sx={{ fontWeight: 'fontWeightSemibold' }}
      >
        {amount}
      </Typography>
    );
  }

  const indexOfNonZero = fraction?.search(/[1-9]/);
  if (indexOfNonZero == -1) {
    return (
      <Typography
        variant="body2"
        component="span"
        color="text.primary"
        sx={{ fontWeight: 'fontWeightSemibold' }}
      >
        {integer}
      </Typography>
    );
  }
  const zeroCount = fraction.slice(0, indexOfNonZero).length;
  if (fraction && indexOfNonZero) {
    return (
      <Stack sx={{ flexDirection: 'row', columnGap: 0 }}>
        <Typography
          variant="body2"
          component="span"
          color="text.primary"
          sx={{ fontWeight: 'fontWeightSemibold' }}
        >
          {integer}.0
        </Typography>
        <Typography
          variant="overline"
          component="span"
          color="text.primary"
          sx={{ mt: 1, fontWeight: 'fontWeightSemibold' }}
        >
          {zeroCount}
        </Typography>
        <Typography
          variant="body2"
          component="span"
          color="text.primary"
          sx={{ fontWeight: 'fontWeightSemibold' }}
        >
          {fraction.slice(indexOfNonZero, indexOfNonZero + 2)}
        </Typography>
      </Stack>
    );
  }
  return (
    <Typography
      variant="body2"
      component="span"
      color="text.primary"
      sx={{ fontWeight: 'fontWeightSemibold' }}
    >
      {amount}
    </Typography>
  );
}
