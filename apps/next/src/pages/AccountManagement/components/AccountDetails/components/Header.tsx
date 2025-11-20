import { Button, styled, Typography } from '@avalabs/k2-alpine';
import { Account } from '@core/types';
import {
  useBalancesContext,
  useBalanceTotalInCurrency,
  useSettingsContext,
  useAnalyticsContext,
} from '@core/ui';
import { FC } from 'react';
import { useTranslation } from 'react-i18next';
import { MdError } from 'react-icons/md';

type Props = {
  account: Account;
};

const SecondaryText = styled('span')(({ theme }) => ({
  color: theme.palette.text.secondary,
}));

export const AccountDetailsHeader: FC<Props> = ({ account }) => {
  const { t } = useTranslation();
  const balance = useBalanceTotalInCurrency(account);
  const { isTokensCached, updateBalanceOnNetworks } = useBalancesContext();
  const { currencyFormatter } = useSettingsContext();
  const { capture } = useAnalyticsContext();

  return (
    <header>
      <Typography variant="h2" marginBlockEnd={0.5}>
        <SecondaryText>{account.name}</SecondaryText>
        <br />
        <span>{currencyFormatter(balance?.sum ?? 0)}</span>
      </Typography>
      {isTokensCached && (
        <StaleBalanceContainer>
          <MdError size={16} />
          <Typography variant="subtitle3" color="error">
            {t('Unable to load balances')}
          </Typography>
          <EndAction
            variant="contained"
            size="small"
            color="secondary"
            onClick={() => {
              capture('AccountSelectorRefreshBalanceClicked', {
                type: account.type,
              });
              updateBalanceOnNetworks([account]);
            }}
          >
            {t('Refresh')}
          </EndAction>
        </StaleBalanceContainer>
      )}
    </header>
  );
};

const StaleBalanceContainer = styled('div')(({ theme }) => ({
  display: 'flex',
  alignItems: 'center',
  gap: theme.spacing(0.5),
  color: theme.palette.error.main,
}));

const EndAction = styled(Button)({
  marginLeft: 'auto',
});
