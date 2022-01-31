import { HorizontalFlex, Typography } from '@avalabs/react-components';
import { useSettingsContext } from '@src/contexts/SettingsProvider';
import { useBalanceTotalInCurrency } from '@src/hooks/useBalanceTotalInCurrency';

export function WalletBalancesMiniMode() {
  const { currency, currencyFormatter } = useSettingsContext();
  const balanceTotalUSD = useBalanceTotalInCurrency();

  return (
    <HorizontalFlex
      justify="center"
      align="flex-end"
      minHeight="44px"
      width="100%"
    >
      {balanceTotalUSD !== null && (
        <>
          <Typography size={32} height="44px" weight={500}>
            {currencyFormatter(balanceTotalUSD)}
          </Typography>
          <Typography weight={500} margin={'0 0 10px 6px'} color="text2">
            {currency}
          </Typography>
        </>
      )}
    </HorizontalFlex>
  );
}
