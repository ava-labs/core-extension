import { FC } from 'react';
import {
  Box,
  Stack,
  Switch,
  Tooltip,
  truncateAddress,
  Typography,
} from '@avalabs/k2-alpine';
import { useTranslation } from 'react-i18next';

import {
  useAccountsContext,
  useBalancesContext,
  useSettingsContext,
} from '@core/ui';

import { OverflowingTypography } from '@/components/OverflowingTypography';

import { ConnectWalletCardProps } from '../../types';
import { AccountDivider } from '../Styled';
import CheckIcon from '@/components/CheckIcon';

export const ReadyWalletCard: FC<ConnectWalletCardProps> = ({
  wallet,
  isSelected,
  toggleAccount,
}) => {
  const { t } = useTranslation();
  const {
    accounts: { active: activeAccount },
  } = useAccountsContext();
  const { getTotalBalance } = useBalancesContext();
  const { currencyFormatter } = useSettingsContext();

  return (
    <Stack px={0.5} divider={<AccountDivider />}>
      {wallet.accounts.map((account) => {
        const balance = getTotalBalance(account.address)?.sum;
        const isActive = account.id === activeAccount?.id;

        return (
          <Stack key={account.id} direction="row" alignItems="center" gap={1.5}>
            <CheckIcon
              size={11}
              color={isActive ? 'currentColor' : 'transparent'}
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
            <Tooltip
              title={
                isActive ? t('Active account is accessible by default') : ''
              }
            >
              <Box sx={{ cursor: isActive ? 'not-allowed' : 'pointer' }}>
                <Switch
                  checked={isSelected(account.id)}
                  readOnly={isActive}
                  disabled={isActive}
                  onChange={() => toggleAccount(account.id)}
                  size="small"
                />
              </Box>
            </Tooltip>
          </Stack>
        );
      })}
    </Stack>
  );
};
