import { Stack, Typography } from '@avalabs/k2-components';
import { bigToLocaleString } from '@avalabs/core-utils-sdk';
import { useSettingsContext } from '@src/contexts/SettingsProvider';
import { bigintToBig } from '@src/utils/bigintToBig';

type AvaxAmountProps = {
  amount: bigint;
  avaxPrice: number;
};

export const AvaxAmount = ({ amount, avaxPrice }: AvaxAmountProps) => {
  const { currencyFormatter } = useSettingsContext();

  return (
    <Stack sx={{ textAlign: 'end', gap: 0.5, pb: 0.5 }}>
      <Typography variant="subtitle2">
        {bigToLocaleString(bigintToBig(amount, 9), 4)} AVAX
      </Typography>
      <Typography variant="caption" color="text.secondary">
        {currencyFormatter(bigintToBig(amount, 9).times(avaxPrice).toNumber())}
      </Typography>
    </Stack>
  );
};
