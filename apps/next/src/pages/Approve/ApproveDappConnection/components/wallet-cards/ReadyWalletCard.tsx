import { FC } from 'react';
import { Stack, truncateAddress, Typography } from '@avalabs/k2-alpine';

import { useBalancesContext, useSettingsContext } from '@core/ui';

import CheckIcon from '@/components/CheckIcon';
import { OverflowingTypography } from '@/components/OverflowingTypography';

import { ConnectWalletCardProps } from '../../types';
import { AccountDivider } from '../Styled';

export const ReadyWalletCard: FC<ConnectWalletCardProps> = ({
  wallet,
  selectedAccountId,
  selectAccount,
}) => {
  const { getTotalBalance } = useBalancesContext();
  const { currencyFormatter } = useSettingsContext();

  return (
    <Stack px={0.5} divider={<AccountDivider />}>
      {wallet.accounts.map((account) => {
        const balance = getTotalBalance(account.address)?.sum;
        const isSelected = selectedAccountId === account.id;

        return (
          <Stack
            key={account.id}
            direction="row"
            alignItems="center"
            gap={1.5}
            px={0.5}
            onClick={() => selectAccount(account.id)}
            sx={{
              cursor: 'pointer',
            }}
          >
            <CheckIcon
              size={11}
              color={isSelected ? 'currentColor' : 'transparent'}
            />
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
          </Stack>
        );
      })}
    </Stack>
  );
};
