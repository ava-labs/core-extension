import { getHexAlpha, styled, Typography } from '@avalabs/k2-alpine';
import { TokenType } from '@avalabs/vm-module-types';
import {
  useAccountsContext,
  useBalanceTotalInCurrency,
  useLiveBalance,
  useSettingsContext,
  useWalletContext,
  useWalletTotalBalance,
} from '@core/ui';
import { FC } from 'react';
import { useTranslation } from 'react-i18next';

const POLLED_BALANCES: TokenType[] = [TokenType.NATIVE, TokenType.ERC20];

const Root = styled('div')(({ theme }) => ({
  display: 'grid',
  gridTemplateColumns: '1fr auto',
  gridTemplateRows: 'auto auto',

  padding: theme.spacing(1.5),
  marginBlockEnd: theme.spacing(1.5),
  borderRadius: theme.shape.mediumBorderRadius,
  backgroundColor: getHexAlpha(theme.palette.primary.main, 10),
}));

const CurrentAccount: FC = () => {
  const { t } = useTranslation();
  const { accounts } = useAccountsContext();
  const { walletDetails } = useWalletContext();
  const { totalBalanceInCurrency = 0 } = useWalletTotalBalance(
    walletDetails?.id,
  );
  const accountBalance = useBalanceTotalInCurrency(accounts.active);
  const { currencyFormatter } = useSettingsContext();
  useLiveBalance(POLLED_BALANCES);

  return (
    <Root>
      <Typography variant="body2" color="text.disabled">
        {t('Currently using {{name}}', { name: walletDetails?.name })}
      </Typography>
      <Typography variant="body2" textAlign="end" color="text.disabled">
        {currencyFormatter(totalBalanceInCurrency)}
      </Typography>
      <Typography variant="subtitle1">{accounts.active?.name}</Typography>
      <Typography variant="subtitle1" textAlign="end">
        {currencyFormatter(accountBalance?.sum ?? 0)}
      </Typography>
    </Root>
  );
};

export default CurrentAccount;
