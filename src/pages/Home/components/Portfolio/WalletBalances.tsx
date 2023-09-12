import {
  AlertTriangleIcon,
  Stack,
  Tooltip,
  Typography,
  Skeleton,
} from '@avalabs/k2-components';
import { useAccountsContext } from '@src/contexts/AccountsProvider';
import { useBalancesContext } from '@src/contexts/BalancesProvider';
import { useSettingsContext } from '@src/contexts/SettingsProvider';
import { useBalanceTotalInCurrency } from '@src/hooks/useBalanceTotalInCurrency';
import { useLiveBalance } from '@src/hooks/useLiveBalance';
import { useTranslation } from 'react-i18next';

export function WalletBalances() {
  const { currency, currencyFormatter } = useSettingsContext();
  const {
    accounts: { active: activeAccount },
  } = useAccountsContext();

  const { isTokensCached, totalBalance } = useBalancesContext();

  const { t } = useTranslation();

  const balanceTotalUSD = useBalanceTotalInCurrency(activeAccount);

  const balanceTotal =
    balanceTotalUSD !== null ? balanceTotalUSD : totalBalance ?? null;

  useLiveBalance(); // Make sure we show the latest balances.

  return (
    <Stack
      direction="row"
      sx={{
        justifyContent: 'center',
        alignItems: 'flex-end',
        minHeight: 5.5,
        width: '100%',
        mt: 1,
        gap: 1.25,
      }}
    >
      {balanceTotal === null ? (
        <Skeleton
          variant="rounded"
          sx={{
            height: 37,
            width: 215,
          }}
        />
      ) : (
        <Stack
          sx={{
            flexDirection: 'row',
            alignItems: 'baseline',
            gap: 1.25,
          }}
        >
          {isTokensCached && (
            <Tooltip title={t('Balances loading...')} placement="bottom">
              <AlertTriangleIcon
                size={19}
                sx={{ color: 'warning.main', mr: 1 }}
              />
            </Tooltip>
          )}
          <Typography
            data-testid="wallet-balance"
            variant="h2"
            sx={{ fontWeight: 'fontWeightBold' }}
          >
            {currencyFormatter(balanceTotal).replace(currency, '')}
          </Typography>
          <Typography variant="body1" sx={{ opacity: '60%' }}>
            {currency}
          </Typography>
        </Stack>
      )}
    </Stack>
  );
}
