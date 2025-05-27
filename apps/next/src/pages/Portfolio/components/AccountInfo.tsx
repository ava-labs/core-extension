import {
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
  return (
    <Stack spacing={0.5} mt={4.5}>
      <Typography variant="h2" color="text.secondary">
        {account.name}
      </Typography>
      <Stack direction="row" alignItems="baseline">
        <Typography variant="h2">{currencyFormatter(sum ?? 0)}</Typography>
        <Typography variant="body1">{currency}</Typography>
      </Stack>
      <Stack direction="row" spacing={0.5}>
        <Typography
          variant="body2"
          color={isLoss ? 'red.main' : 'teal.main'}
          fontWeight={600}
        >
          {isLoss ? '-' : '+'}
          {currencyFormatter(priceChange.value)}
          <PnLIcon size="0.75em" />
        </Typography>
        <Typography variant="body2" fontWeight={600}>
          {`${(priceChange.percentage[0] ?? 0).toFixed(1)}%`}
        </Typography>
      </Stack>
    </Stack>
  );
};

export default AccountInfo;
