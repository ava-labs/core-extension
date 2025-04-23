import { useEffect, useState } from 'react';
import { useTranslation } from 'react-i18next';
import {
  CheckIcon,
  Skeleton,
  Stack,
  Typography,
  useTheme,
} from '@avalabs/core-k2-components';
import { DropdownItem, Dropdown } from 'packages/ui/src/components/common/Dropdown';
import { useBalancesContext } from '@src/contexts/BalancesProvider';
import { useSettingsContext } from '@src/contexts/SettingsProvider';
import { useBalanceTotalInCurrency } from '@src/hooks/useBalanceTotalInCurrency';
import { truncateAddress } from '@core/utils';
import { NetworkVMType } from '@avalabs/vm-module-types';
import { getAddressByVMType } from '@core/utils';
import { Account } from '@core/service-worker';

const renderValue = (account: Account, vmType: NetworkVMType) => (
  <Typography
    component="span"
    fontSize="inherit"
    sx={{
      display: 'flex',
      flex: 1,
      minWidth: 0,
    }}
  >
    <Typography component="span" noWrap fontSize="inherit">
      {account.name}
    </Typography>
    <Typography
      component="span"
      sx={{ flexShrink: 0, pl: 0.5 }}
      fontSize="inherit"
    >
      ({truncateAddress(getAddressByVMType(account, vmType)!)})
    </Typography>
  </Typography>
);

export const AccountsDropdown = ({
  allAccountsForRequestedVM,
  activeAccount,
  onSelectedAccountChanged,
  addressVM = NetworkVMType.EVM,
}) => {
  const theme = useTheme();
  const { t } = useTranslation();
  const [selectedAccount, setSelectedAccount] = useState(activeAccount);
  const [isBalanceLoading, setIsBalanceLoading] = useState(false);
  const { updateBalanceOnNetworks } = useBalancesContext();
  const { currency, currencyFormatter } = useSettingsContext();
  const accountBalance = useBalanceTotalInCurrency(selectedAccount);

  const balanceSum = accountBalance?.sum || 0;
  const hasAccountBalance =
    accountBalance && accountBalance !== null && accountBalance.sum !== null;

  // Set active account as default
  useEffect(() => {
    const getBalance = async () => {
      setIsBalanceLoading(true);
      await updateBalanceOnNetworks?.(selectedAccount);
      setIsBalanceLoading(false);
    };

    if (!selectedAccount) {
      if (activeAccount) {
        setSelectedAccount(activeAccount);
      }
      return;
    }

    if (selectedAccount) {
      getBalance();
    }
  }, [activeAccount, selectedAccount, updateBalanceOnNetworks]);

  // Update balance & notify parent component about changes when account is selected
  useEffect(() => {
    onSelectedAccountChanged(selectedAccount);
  }, [onSelectedAccountChanged, selectedAccount]);

  return (
    <Stack sx={{ gap: 1, width: '100%' }}>
      <Dropdown
        SelectProps={{
          // <Select /> expects reference equality and `activeAccount` is a different object
          // than the one in `accounts` array.
          defaultValue: allAccountsForRequestedVM.find(
            (acc) => acc.id === activeAccount?.id,
          ),
          onChange: (ev) => setSelectedAccount(ev.target.value),
          renderValue: (value) => renderValue(value as Account, addressVM),
          // We need the @ts-ignore, because MUI's "nested props" (such as SelectProps)
          // do not allow passing data-attributes.
          // eslint-disable-next-line @typescript-eslint/ban-ts-comment
          // @ts-ignore
          'data-testid': 'connect-account-dropdown',
        }}
        label={t('Select Account')}
      >
        {allAccountsForRequestedVM.map((acc) => (
          <DropdownItem
            key={acc.id}
            value={acc}
            selected={selectedAccount?.id === acc.id}
            data-testid="connect-account-menu-item"
            title={acc.name}
          >
            {renderValue(acc, addressVM)}
            {selectedAccount?.id === acc.id && <CheckIcon />}
          </DropdownItem>
        ))}
      </Dropdown>
      {isBalanceLoading && <Skeleton variant="text" width={120} />}
      {!isBalanceLoading && hasAccountBalance && (
        <Typography variant="caption" color={theme.palette.text.secondary}>
          {t('Balance')}: {currencyFormatter(balanceSum).replace(currency, '')}
        </Typography>
      )}
    </Stack>
  );
};
