import {
  Box,
  Stack,
  TriangleDownIcon,
  TriangleUpIcon,
  Typography,
} from '@avalabs/k2-alpine';
import { Account } from '@core/types';
import { useBalancesContext, useSettingsContext } from '@core/ui';
import { FC } from 'react';

type Props = {
  account: Account;
};

const fallbackTotalBalance: ReturnType<
  typeof useBalancesContext
>['totalBalance'] = {
  sum: null,
  priceChange: {
    value: 0,
    percentage: [],
  },
};

export const AccountInfo: FC<Props> = ({ account }) => {
  const { currencyFormatter, currency } = useSettingsContext();
  const { totalBalance } = useBalancesContext();
  const { sum, priceChange } = totalBalance ?? fallbackTotalBalance;
  const isLoss = priceChange.value < 0;
  const PnLIcon = isLoss ? TriangleDownIcon : TriangleUpIcon;
  const formattedSum = currencyFormatter(sum ?? 0).replace(
    /^(\D)0\.00$/,
    '$1–',
  );

  return (
    <Stack spacing={0.5} mt={4.5}>
      <Typography variant="h2" color="text.secondary">
        {account?.name}
      </Typography>
      <Stack direction="row" alignItems="baseline" gap={0.5}>
        <Typography variant="h2">{formattedSum}</Typography>
        <Typography variant="body1">{currency}</Typography>
      </Stack>
      <Stack direction="row" spacing={0.5} alignItems="center" useFlexGap>
        <Typography
          variant="body2"
          color={isLoss ? 'red.main' : 'teal.main'}
          fontWeight={600}
        >
          {isLoss ? '-' : '+'} {currencyFormatter(priceChange.value)}
        </Typography>
        <Box color={isLoss ? 'red.main' : 'teal.main'}>
          <PnLIcon size={12} />
        </Box>
        <Typography variant="body2" fontWeight={600}>
          {`${(priceChange.percentage[0] ?? 0).toFixed(1)}%`}
        </Typography>
      </Stack>
    </Stack>
  );
};

export default AccountInfo;
