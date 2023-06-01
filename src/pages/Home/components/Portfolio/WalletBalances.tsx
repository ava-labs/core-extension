import { Skeleton, Stack, Typography } from '@avalabs/k2-components';
import { useAccountsContext } from '@src/contexts/AccountsProvider';
import { useSettingsContext } from '@src/contexts/SettingsProvider';
import { useBalanceTotalInCurrency } from '@src/hooks/useBalanceTotalInCurrency';
import { useLiveBalance } from '@src/hooks/useLiveBalance';

export function WalletBalances() {
  const { currency, currencyFormatter } = useSettingsContext();
  const {
    accounts: { active: activeAccount },
  } = useAccountsContext();

  const balanceTotalUSD = useBalanceTotalInCurrency(activeAccount, true);

  useLiveBalance(); // Make sure we show the latest balances.

  return (
    <Stack
      direction="row"
      justifyContent="center"
      alignItems="flex-end"
      sx={{
        minHeight: 5.5,
        width: '100%',
        mt: 1.75,
      }}
    >
      {balanceTotalUSD === null ? (
        <Skeleton variant="rounded" sx={{ height: 37, width: 215 }} />
      ) : (
        <>
          <Typography
            data-testid="wallet-balance"
            variant="h2"
            sx={{ fontWeight: 'fontWeightBold' }}
          >
            {currencyFormatter(balanceTotalUSD).replace(currency, '')}
          </Typography>
          <Typography variant="body1" sx={{ opacity: '60%' }}>
            {currency}
          </Typography>
        </>
      )}
    </Stack>
  );
}
