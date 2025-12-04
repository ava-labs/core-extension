import { Stack, Tooltip, Typography } from '@avalabs/k2-alpine';
import { Account } from '@core/types';

import {
  useBalancesContext,
  useBalanceTotalInCurrency,
  useSettingsContext,
} from '@core/ui';
import { FC } from 'react';
import { useTranslation } from 'react-i18next';
import * as Styled from '../../Styled';

type Props = {
  account: Account;
  selected: boolean;
};

export const AccountBalance: FC<Props> = ({ account, selected }) => {
  const { t } = useTranslation();
  const { currencyFormatter } = useSettingsContext();
  const balance = useBalanceTotalInCurrency(account);
  const { isTokensCached } = useBalancesContext();
  return (
    <Stack direction="row" alignItems="center" gap={0.5}>
      {isTokensCached && (
        <Tooltip
          title={t('Balances loading...')}
          placement="bottom"
          color="error"
        >
          <Styled.ErrorIcon size={14} />
        </Tooltip>
      )}
      <Typography
        variant="body3"
        component="span"
        fontWeight={selected ? 600 : 400}
        color="text.primary"
      >
        {currencyFormatter(balance?.sum ?? 0)}
      </Typography>
    </Stack>
  );
};
