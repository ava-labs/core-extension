import { Button, styled, Typography } from '@avalabs/k2-alpine';
import { Account } from '@core/types';
import {
  useBalancesContext,
  useBalanceTotalInCurrency,
  useSettingsContext,
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

  return (
    <header>
      <Typography variant="h2" marginBlockEnd={0.5}>
        <SecondaryText>{account.name}</SecondaryText>
        <br />
        <span>{currencyFormatter(balance?.sum ?? 0)}</span>
      </Typography>
      {!isTokensCached && (
        <StaleBalanceContainer>
          <Typography variant="h6" color="error">
            <MdError size={16} /> {t('Unable to load balances')}
          </Typography>
          <Button
            variant="contained"
            size="small"
            color="secondary"
            onClick={() => updateBalanceOnNetworks([account])}
          >
            {t('Refresh')}
          </Button>
        </StaleBalanceContainer>
      )}
    </header>
  );
};

const StaleBalanceContainer = styled('div')(({ theme }) => ({
  display: 'flex',
  alignItems: 'center',
  justifyContent: 'space-between',
  gap: theme.spacing(1),
}));
