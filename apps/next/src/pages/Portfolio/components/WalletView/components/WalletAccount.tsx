import { PersonalAvatar } from '@/components/PersonalAvatar';
import { Stack, Typography, useTheme } from '@avalabs/k2-alpine';
import { Account } from '@core/types';
import {
  useAccountsContext,
  useBalancesContext,
  useSettingsContext,
} from '@core/ui';
import { FC, useCallback } from 'react';
import { MdCircle } from 'react-icons/md';
import { useHistory } from 'react-router-dom';
import { BalanceChange } from '../../BalanceChange';

type Props = {
  account: Account;
};

export const WalletAccount: FC<Props> = ({ account }) => {
  const theme = useTheme();

  const history = useHistory();
  const { selectAccount, isActiveAccount } = useAccountsContext();
  const { getTotalBalance } = useBalancesContext();
  const { currencyFormatter } = useSettingsContext();

  const clickHandler = useCallback(() => {
    selectAccount(account.id);
    history.push(`/portfolio`);
  }, [history, selectAccount, account.id]);

  const balance = getTotalBalance(account.addressC);

  return (
    <Stack
      direction="row"
      alignItems="center"
      gap={1}
      onClick={() => clickHandler()}
      sx={{ cursor: 'pointer' }}
    >
      {isActiveAccount(account.id) && (
        <MdCircle color={theme.palette.success.main} />
      )}
      {/* TODO: Add random Icon */}
      <PersonalAvatar cached size="small" sx={{ mr: 1 }} />
      <Stack>
        <Typography variant="subtitle3">{account.name}</Typography>
        {/* <Typography variant="subtitle3">{account.addressC}</Typography> */}
        {/*TODO: Replace with supported network logos */}
      </Stack>
      <Stack>
        <Typography variant="subtitle3">
          {currencyFormatter(balance?.sum ?? 0)}
        </Typography>
        <BalanceChange
          balanceChange={balance?.priceChange.value ?? 0}
          percentageChange={balance?.priceChange.percentage[0] ?? 0}
        />
      </Stack>
    </Stack>
  );
};
