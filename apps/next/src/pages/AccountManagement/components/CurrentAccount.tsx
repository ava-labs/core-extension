import { Typography } from '@/components/Typography';
import { getHexAlpha, styled } from '@avalabs/k2-alpine';
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
  borderRadius: 12,
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
      <Typography variant="caption" color="text.disabled">
        {t('Currently using {{name}}', { name: walletDetails?.name })}
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
