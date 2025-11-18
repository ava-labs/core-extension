import { PersonalAvatar } from '@/components/PersonalAvatar';
import { Stack, Typography, useTheme } from '@avalabs/k2-alpine';
import { Account } from '@core/types';
import {
  useAccountsContext,
  useBalancesContext,
  useSettingsContext,
} from '@core/ui';
import { FC, useCallback } from 'react';
import { MdCircle, MdNavigateNext } from 'react-icons/md';
import { useHistory } from 'react-router-dom';
import { BalanceChange } from '../../BalanceChange';
import { NetworksWithBalances } from './NetworksWithBalances';

type Props = {
  account: Account;
  isFirst?: boolean;
};

export const WalletAccount: FC<Props> = ({ account, isFirst = false }) => {
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
      justifyContent="space-between"
      gap={1}
      onClick={() => clickHandler()}
      py={1}
      sx={{
        cursor: 'pointer',
        position: 'relative',
        ...(!isFirst && {
          borderTop: `1px solid ${theme.palette.divider}`,
        }),
      }}
    >
      <Stack direction="row" alignItems="center" gap={1}>
        {isActiveAccount(account.id) && (
          <MdCircle
            size={6}
            color={theme.palette.success.main}
            style={{
              position: 'absolute',
              left: '-8px',
            }}
          />
        )}
        {/* TODO: Add random Icon */}
        <PersonalAvatar cached size="small" sx={{ mr: 1 }} />
        <Stack>
          <Typography variant="subtitle3">{account.name}</Typography>
          <NetworksWithBalances account={account} />
        </Stack>
      </Stack>

      <Stack direction="row" alignItems="center" gap={0.5}>
        <Stack alignItems="flex-end">
          <Typography variant="subtitle3">
            {currencyFormatter(balance?.sum ?? 0)}
          </Typography>
          <BalanceChange balanceChange={balance?.priceChange.value ?? 0} />
        </Stack>
        <MdNavigateNext size={16} color={theme.palette.text.secondary} />
      </Stack>
    </Stack>
  );
};
