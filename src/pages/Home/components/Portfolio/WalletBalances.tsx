import {
  AlertTriangleIcon,
  Stack,
  Tooltip,
  Typography,
  Skeleton,
} from '@avalabs/core-k2-components';
import { TokenType } from '@avalabs/vm-module-types';
import { PAndL } from '@src/components/common/ProfitAndLoss';
import { useAccountsContext } from '@src/contexts/AccountsProvider';
import { useBalancesContext } from '@src/contexts/BalancesProvider';
import { useSettingsContext } from '@src/contexts/SettingsProvider';
import { useBalanceTotalInCurrency } from '@src/hooks/useBalanceTotalInCurrency';
import { useLiveBalance } from '@src/hooks/useLiveBalance';
import { useTokenPriceMissing } from '@src/hooks/useTokenPriceIsMissing';
import { useTranslation } from 'react-i18next';

const POLLED_BALANCES = [TokenType.NATIVE, TokenType.ERC20];

export function WalletBalances() {
  const { currency, currencyFormatter } = useSettingsContext();
  const {
    accounts: { active: activeAccount },
  } = useAccountsContext();

  const { isTokensCached, totalBalance } = useBalancesContext();

  const { t } = useTranslation();
  const { favoriteNetworksMissingPrice, activeNetworkMissingPrice } =
    useTokenPriceMissing();

  const balanceTotalUSD = useBalanceTotalInCurrency(activeAccount);

  const balanceTotalUSDSum = balanceTotalUSD?.sum;

  const totalBalanceSum = totalBalance?.sum || null;
  const totalBalanceChanges = totalBalance?.priceChange;

  const totalBalanceChange = totalBalance
    ? {
        value: totalBalanceChanges?.value,
        percentage: balanceTotalUSDSum
          ? (totalBalance?.priceChange.value / balanceTotalUSDSum) * 100
          : undefined,
      }
    : {};

  const balanceTotal =
    balanceTotalUSDSum !== null && balanceTotalUSDSum !== undefined
      ? balanceTotalUSDSum
      : totalBalanceSum ?? null;

  useLiveBalance(POLLED_BALANCES); // Make sure we show the latest balances.

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
        <Stack>
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
            {!isTokensCached &&
              (favoriteNetworksMissingPrice || activeNetworkMissingPrice) && (
                <Tooltip
                  title={t(
                    'The prices of some tokens are missing. The balance might not be accurate currently.'
                  )}
                  placement="bottom"
                >
                  <AlertTriangleIcon
                    size={19}
                    sx={{ color: 'warning.main', mr: 1 }}
                  />
                </Tooltip>
              )}
            <Typography
              data-testid="wallet-balance"
              variant="h3"
              sx={{ fontWeight: 'fontWeightBold' }}
            >
              {currencyFormatter(balanceTotal).replace(currency, '')}
            </Typography>
            <Typography variant="body1" sx={{ opacity: '60%' }}>
              {currency}
            </Typography>
          </Stack>
          <Stack sx={{ alignItems: 'center' }}>
            <PAndL
              value={totalBalanceChange.value}
              percentage={totalBalanceChange.percentage}
              size="big"
              showPercentage
            />
          </Stack>
        </Stack>
      )}
    </Stack>
  );
}
