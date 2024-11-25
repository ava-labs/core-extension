import { Stack, Typography } from '@avalabs/core-k2-components';
import { TokenUnit } from '@avalabs/core-utils-sdk';
import { useSettingsContext } from '@src/contexts/SettingsProvider';

type AvaxAmountProps = {
  amount: bigint;
  avaxPrice: number;
};

export const AvaxAmount = ({
  amount: amountRaw,
  avaxPrice,
}: AvaxAmountProps) => {
  const { currencyFormatter } = useSettingsContext();
  const amount = new TokenUnit(amountRaw, 9, 'AVAX');

  return (
    <Stack sx={{ textAlign: 'end', gap: 0.5, pb: 0.5 }}>
      <Typography variant="subtitle2">{amount.toDisplay()} AVAX</Typography>
      <Typography variant="caption" color="text.secondary">
        {currencyFormatter(amount.toDisplay({ asNumber: true }) * avaxPrice)}
      </Typography>
    </Stack>
  );
};
