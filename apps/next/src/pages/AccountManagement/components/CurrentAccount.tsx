import { getHexAlpha, styled, Typography } from '@avalabs/k2-alpine';
import { TokenType } from '@avalabs/vm-module-types';
import {
  useAccountsContext,
  useBalancesContext,
  useBalanceTotalInCurrency,
  useLiveBalance,
  useSettingsContext,
  useWalletContext,
} from '@core/ui';
import { FC } from 'react';
import { useTranslation } from 'react-i18next';

type Props = {
  className?: string;
};

const POLLED_BALANCES: TokenType[] = [TokenType.NATIVE, TokenType.ERC20];

const Root = styled('div')(({ theme }) => ({
  display: 'grid',
  gridTemplateColumns: '1fr auto',
  gridTemplateRows: 'auto auto',

  padding: theme.spacing(1.5),
  borderRadius: theme.shape.mediumBorderRadius,
  backgroundColor: getHexAlpha(theme.palette.primary.main, 10),
}));

const CurrentAccount: FC<Props> = ({ className }) => {
  const { t } = useTranslation();
  const { accounts } = useAccountsContext();
  const { walletDetails } = useWalletContext();
  const { getWalletTotalBalance } = useBalancesContext();
  const { totalBalanceInCurrency } = getWalletTotalBalance(walletDetails?.id);

  const accountBalance = useBalanceTotalInCurrency(accounts.active);
  const { currencyFormatter } = useSettingsContext();
  useLiveBalance(POLLED_BALANCES);

  return (
    <Root className={className}>
      <Typography variant="caption" color="text.disabled">
        {t('Currently using {{name}}', {
          name: walletDetails ? walletDetails.name : 'Imported wallet',
        })}
      </Typography>
      <Typography variant="caption" textAlign="end" color="text.disabled">
        {totalBalanceInCurrency
          ? currencyFormatter(totalBalanceInCurrency)
          : '-'}
      </Typography>
      <Typography variant="subtitle3">{accounts.active?.name}</Typography>
      <Typography variant="subtitle3" textAlign="end">
        {accountBalance?.sum ? currencyFormatter(accountBalance.sum) : '-'}
      </Typography>
    </Root>
  );
};

export default CurrentAccount;
