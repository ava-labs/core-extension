import { Stack, Typography } from '@avalabs/k2-alpine';

import {
  useAccountsContext,
  useBalanceTotalInCurrency,
  useSettingsContext,
} from '@core/ui';

export const SelectedAccount = ({ accountId }: { accountId: string }) => {
  const { getAccountById } = useAccountsContext();
  const { currencyFormatter } = useSettingsContext();
  const fromAccountBalance = useBalanceTotalInCurrency(
    getAccountById(accountId),
  );
  return (
    <Stack textAlign="end">
      <Typography
        variant="body3"
        color="text.primary"
        fontWeight="fontWeightMedium"
      >
        {getAccountById(accountId)?.name}
      </Typography>
      <Typography variant="caption" color="text.secondary">
        {typeof fromAccountBalance?.sum === 'number'
          ? currencyFormatter(fromAccountBalance.sum)
          : '-'}
      </Typography>
    </Stack>
  );
};
