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
      width="100%"
      margin="16px 0"
    >
      <Typography size={36} weight={700}>
        {currencyFormatter(balanceTotalUSD)}
      </Typography>
      <Typography weight={600} margin={'0 0 3px 5px'} color="text2">
        {currency}
      </Typography>
    </HorizontalFlex>
  );
}
