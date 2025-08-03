import {
  Box,
  Stack,
  TriangleDownIcon,
  TriangleUpIcon,
  Typography,
} from '@avalabs/k2-alpine';
import { useBalancesContext, useSettingsContext } from '@core/ui';
import { FC } from 'react';

type TotalBalance = ReturnType<typeof useBalancesContext>['totalBalance'];

type Props = {
  accountName: string;
  balance: TotalBalance;
};

const fallbackTotalBalance: TotalBalance = {
  sum: null,
  priceChange: {
    value: 0,
    percentage: [],
  },
};

export const AccountInfo: FC<Props> = ({
  accountName,
  balance = fallbackTotalBalance,
}) => {
  const { currencyFormatter, currency } = useSettingsContext();
  const { sum, priceChange } = balance;
  const isLoss = priceChange.value < 0;
  const PnLIcon = isLoss ? TriangleDownIcon : TriangleUpIcon;
  const pnlColor = isLoss ? 'red.main' : 'teal.main';
  const formattedSum = currencyFormatter(sum ?? 0).replace(
    /^(\D)0\.00$/,
    '$1–',
  );

  return (
    <Stack spacing={0.5} mt={4.5}>
      <Typography variant="h2" color="text.secondary">
        {accountName}
      </Typography>
      <Stack direction="row" alignItems="baseline" gap={0.5}>
        <Typography variant="h2">{formattedSum}</Typography>
        <Typography variant="body3">{currency}</Typography>
      </Stack>
      <Stack direction="row" spacing={0.5} alignItems="center" useFlexGap>
        <Typography variant="caption" color={pnlColor} fontWeight={600}>
          {isLoss ? '' : '+'}
          {currencyFormatter(priceChange.value)}
        </Typography>
        <Box color={pnlColor}>
          <PnLIcon size={12} />
        </Box>
        <Typography variant="caption" fontWeight={600}>
          {`${(priceChange.percentage[0] ?? 0).toFixed(1)}%`}
        </Typography>
      </Stack>
    </Stack>
  );
};

export default AccountInfo;
