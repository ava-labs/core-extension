import { Stack, Typography } from '@avalabs/k2-components';
import { bigIntToString } from '@avalabs/utils-sdk';
import { useSettingsContext } from '@src/contexts/SettingsProvider';

type AvaxAmountProps = {
  amount: bigint;
  avaxPrice: number;
};

export const AvaxAmount = ({ amount, avaxPrice }: AvaxAmountProps) => {
  const { currencyFormatter } = useSettingsContext();

  return (
    <Stack sx={{ textAlign: 'end', gap: 0.5, pb: 0.5 }}>
      <Typography variant="subtitle2">
        {Number(bigIntToString(amount, 9))} AVAX
      </Typography>
      <Typography variant="caption" color="text.secondary">
        {currencyFormatter(Number(bigIntToString(amount, 9)) * avaxPrice)}
      </Typography>
    </Stack>
  );
};
