import {
  PersonalAvatar,
  type PersonalAvatarName,
} from '@/components/PersonalAvatar';
import { Stack, Typography, useTheme } from '@avalabs/k2-alpine';
import { Account, NetworkWithCaipId } from '@core/types';
import {
  useAccountsContext,
  useAnalyticsContext,
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
  avatarName?: PersonalAvatarName;
  networksWithBalance: NetworkWithCaipId[];
};

export const WalletAccount: FC<Props> = ({
  account,
  isFirst = false,
  avatarName = 'abstract-1.svg',
  networksWithBalance,
}) => {
  const theme = useTheme();

  const history = useHistory();
  const { selectAccount, isActiveAccount } = useAccountsContext();
  const { getTotalBalance, getAtomicBalance } = useBalancesContext();
  const { currencyFormatter } = useSettingsContext();
  const { capture } = useAnalyticsContext();
  const clickHandler = useCallback(() => {
    selectAccount(account.id);

    capture('AccountSelectorAccountSwitched', {
      type: account.type,
    });

    history.push(`/portfolio`);
  }, [selectAccount, account.id, account.type, history, capture]);

  const balance = getTotalBalance(account.addressC);
  const atomicBalance = getAtomicBalance(account.id);

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
        <PersonalAvatar name={avatarName} size="xsmall" sx={{ mr: 1 }} />
        <Stack gap={0.5}>
          <Typography variant="subtitle3">{account.name}</Typography>
          <NetworksWithBalances networksWithBalance={networksWithBalance} />
        </Stack>
      </Stack>

      <Stack direction="row" alignItems="center" gap={0.5}>
        <Stack alignItems="flex-end">
          <Typography variant="subtitle3">
            {currencyFormatter(
              (balance?.sum ?? 0) + (atomicBalance?.balanceInCurrency ?? 0),
            )}
          </Typography>
          <BalanceChange balanceChange={balance?.priceChange.value ?? 0} />
        </Stack>
        <MdNavigateNext size={16} color={theme.palette.text.secondary} />
      </Stack>
    </Stack>
  );
};
