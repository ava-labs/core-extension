import { Stack, Typography } from '@avalabs/k2-alpine';

import {
  useAccountsContext,
  useBalanceTotalInCurrency,
  useSettingsContext,
} from '@core/ui';

type SelectedAccountProps = {
  accountId: string;
  isBalanceVisible: boolean;
};

export const SelectedAccount = ({
  accountId,
  isBalanceVisible,
}: SelectedAccountProps) => {
  const { getAccountById } = useAccountsContext();
  const { currencyFormatter } = useSettingsContext();
  const fromAccountBalance = useBalanceTotalInCurrency(
    getAccountById(accountId),
  );
  return (
    <Stack textAlign="end" py={!isBalanceVisible ? 0.75 : 0}>
      <Typography
        variant="body3"
        color="text.primary"
        fontWeight="fontWeightMedium"
      >
        {getAccountById(accountId)?.name}
      </Typography>
      {isBalanceVisible && (
        <Typography variant="caption" color="text.secondary">
          {typeof fromAccountBalance?.sum === 'number'
            ? currencyFormatter(fromAccountBalance.sum)
            : '-'}
        </Typography>
      )}
    </Stack>
  );
};
