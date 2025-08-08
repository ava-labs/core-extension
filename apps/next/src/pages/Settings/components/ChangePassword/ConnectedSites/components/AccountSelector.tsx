import {
  ChevronRightIcon,
  FormControl,
  MenuItem,
  Select,
  Stack,
  styled,
  Typography,
} from '@avalabs/k2-alpine';
import { Account } from '@core/types';
import { FC } from 'react';
import { useTranslation } from 'react-i18next';

interface AccountSelectorProps {
  selectedAccount?: Account;
  accounts: Account[];
  onChange: (accountId: string) => void;
}

export const AccountSelector: FC<AccountSelectorProps> = ({
  selectedAccount,
  accounts,
  onChange,
}) => {
  const { t } = useTranslation();

  const formatAccountBalance = (_account: Account) => {
    // For now, we'll show a placeholder balance
    // This should be integrated with the actual balance system
    return '$7,377.37';
  };

  if (!selectedAccount) {
    return null;
  }

  return (
    <StyledCard>
      <FormControl fullWidth>
        <Select
          value={selectedAccount.id}
          onChange={(e) => onChange(e.target.value as string)}
          renderValue={() => (
            <Stack
              direction="row"
              alignItems="center"
              justifyContent="space-between"
              width="100%"
            >
              <Typography variant="h6">{t('Account')}</Typography>
              <Stack direction="row" alignItems="center" gap={1}>
                <Typography variant="subtitle2" fontWeight="600">
                  {selectedAccount.name}
                </Typography>
                <Typography variant="caption" color="text.secondary">
                  {formatAccountBalance(selectedAccount)}
                </Typography>
                <ChevronRightIcon fontSize="small" />
              </Stack>
            </Stack>
          )}
          sx={{
            '& .MuiSelect-select': {
              padding: 2,
            },
            '& fieldset': {
              border: 'none',
            },
          }}
        >
          {accounts.map((account) => (
            <MenuItem key={account.id} value={account.id}>
              <Stack
                direction="row"
                alignItems="center"
                justifyContent="space-between"
                width="100%"
              >
                <Typography variant="subtitle2" fontWeight="600">
                  {account.name}
                </Typography>
                <Typography variant="caption" color="text.secondary">
                  {formatAccountBalance(account)}
                </Typography>
              </Stack>
            </MenuItem>
          ))}
        </Select>
      </FormControl>
    </StyledCard>
  );
};

const StyledCard = styled('div')(({ theme }) => ({
  backgroundColor: theme.palette.background.paper,
  borderRadius: theme.shape.borderRadius,
  border: `1px solid ${theme.palette.divider}`,
  overflow: 'hidden',
}));
