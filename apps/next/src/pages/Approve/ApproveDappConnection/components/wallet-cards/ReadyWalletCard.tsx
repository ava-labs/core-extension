import { FC } from 'react';
import { Stack, Switch, truncateAddress, Typography } from '@avalabs/k2-alpine';

import {
  useAccountsContext,
  useBalancesContext,
  useSettingsContext,
} from '@core/ui';

import { OverflowingTypography } from '@/components/OverflowingTypography';

import { ConnectWalletCardProps } from '../../types';
import { AccountDivider } from '../Styled';

export const ReadyWalletCard: FC<ConnectWalletCardProps> = ({
  wallet,
  isSelected,
  toggleAccount,
}) => {
  const {
    accounts: { active: activeAccount },
  } = useAccountsContext();
  const { getTotalBalance } = useBalancesContext();
  const { currencyFormatter } = useSettingsContext();

  return (
    <Stack px={0.5} divider={<AccountDivider />}>
      {wallet.accounts.map((account) => {
        const balance = getTotalBalance(account.address)?.sum;
        return (
          <Stack key={account.id} direction="row" alignItems="center" gap={1.5}>
            <Stack flexGrow={1}>
              <OverflowingTypography variant="subtitle3" fontWeight={500}>
                {account.name}
              </OverflowingTypography>
              <Typography variant="mono" color="text.secondary">
                {truncateAddress(account.address, 10)}
              </Typography>
            </Stack>
            <Typography variant="body3" fontWeight={500} color="text.secondary">
              {typeof balance === 'number' ? currencyFormatter(balance) : '-'}
            </Typography>
            <Switch
              checked={isSelected(account.id)}
              disabled={account.id === activeAccount?.id}
              onChange={() => toggleAccount(account.id)}
              size="small"
            />
          </Stack>
        );
      })}
    </Stack>
  );
};
