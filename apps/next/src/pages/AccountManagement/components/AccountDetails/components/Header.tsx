import { Typography, Tooltip, styled } from '@avalabs/k2-alpine';
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
  const { isTokensCached } = useBalancesContext();
  const { currencyFormatter } = useSettingsContext();

  return (
    <Typography variant="h2" marginBlockEnd={0.5}>
      <SecondaryText>{account.name}</SecondaryText>
      <br />
      <span>
        {isTokensCached && (
          <Tooltip
            title={t('Balances loading...')}
            placement="bottom"
            color="error"
          >
            <MdError size={14} />
          </Tooltip>
        )}
        {currencyFormatter(balance?.sum ?? 0)}
      </span>
    </Typography>
  );
};
