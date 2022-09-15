import {
  HorizontalFlex,
  Skeleton,
  Typography,
} from '@avalabs/react-components';
import { useAccountsContext } from '@src/contexts/AccountsProvider';
import { useSettingsContext } from '@src/contexts/SettingsProvider';
import { useBalanceTotalInCurrency } from '@src/hooks/useBalanceTotalInCurrency';

export function WalletBalances() {
  const { currency, currencyFormatter } = useSettingsContext();
  const { activeAccount } = useAccountsContext();
  const balanceTotalUSD = useBalanceTotalInCurrency(activeAccount);

  return (
    <HorizontalFlex
      justify="center"
      align="flex-end"
      minHeight="44px"
      width="100%"
    >
      {balanceTotalUSD === null ? (
        <Skeleton width="215px" height="44px" delay={250} />
      ) : (
        <>
          <Typography
            data-testid="wallet-balance"
            size={32}
            height="44px"
            weight={500}
          >
            {currencyFormatter(balanceTotalUSD).replace(currency, '')}
          </Typography>
          <Typography
            data-testid="wallet-currency"
            weight={500}
            margin={'0 0 10px 6px'}
            color="text2"
          >
            {currency}
          </Typography>
        </>
      )}
    </HorizontalFlex>
  );
}
