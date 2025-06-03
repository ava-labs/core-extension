import { getHexAlpha, styled } from '@avalabs/k2-alpine';
import { FC } from 'react';
import {
  useAccountsContext,
  useBalanceTotalInCurrency,
  useSettingsContext,
  useWalletContext,
  useWalletTotalBalance,
} from '@core/ui';
import { Typography } from './Typography';

const Root = styled('div')(({ theme }) => ({
  display: 'grid',
  gridTemplateColumns: '1fr auto',
  gridTemplateRows: 'auto auto',

  padding: theme.spacing(1.5),
  borderRadius: theme.shape.borderRadius * 2,
  backgroundColor: getHexAlpha(theme.palette.primary.main, 10),
}));

const CurrentAccount: FC = () => {
  const { accounts } = useAccountsContext();
  const { walletDetails } = useWalletContext();
  const { totalBalanceInCurrency = 0 } = useWalletTotalBalance(
    walletDetails?.id,
  );
  const accountBalance = useBalanceTotalInCurrency(accounts.active);
  const { currencyFormatter } = useSettingsContext();
  return (
    <Root>
      <Typography variant="caption" color="text.disabled">
        Currently using {walletDetails?.name}
      </Typography>
      <Typography variant="caption" textAlign="end" color="text.disabled">
        {currencyFormatter(totalBalanceInCurrency)}
      </Typography>
      <Typography variant="titleBold">{accounts.active?.name}</Typography>
      <Typography variant="titleBold" textAlign="end">
        {currencyFormatter(accountBalance?.sum ?? 0)}
      </Typography>
    </Root>
  );
};

export default CurrentAccount;
