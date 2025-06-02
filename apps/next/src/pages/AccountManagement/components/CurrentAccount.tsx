import { getHexAlpha, styled, Typography } from '@avalabs/k2-alpine';
import { FC } from 'react';
import {
  useAccountsContext,
  useBalancesContext,
  useSettingsContext,
  useWalletContext,
} from '@core/ui';

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
  const { totalBalance, getTotalBalance } = useBalancesContext();
  const { currencyFormatter } = useSettingsContext();
  return (
    <Root>
      <Typography variant="caption" fontWeight="500">
        Currently using {walletDetails?.name}
      </Typography>
      <Typography variant="caption" fontWeight="500" textAlign="end">
        {currencyFormatter(totalBalance?.sum ?? 0)}
      </Typography>
      <Typography variant="body1" fontWeight="600">
        {accounts.active?.name}
      </Typography>
      <Typography variant="body1" fontWeight="600" textAlign="end">
        {currencyFormatter(
          getTotalBalance(accounts.active?.addressC ?? '')?.sum ?? 0,
        )}
      </Typography>
    </Root>
  );
};

export default CurrentAccount;
