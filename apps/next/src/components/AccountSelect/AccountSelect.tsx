import { FC } from 'react';
import { Typography } from '@avalabs/k2-alpine';
import { useTranslation } from 'react-i18next';

import { Account, AddressType } from '@core/types';
import { useAccountsContext, useWalletContext } from '@core/ui';

import { SearchableSelect } from '@/components/SearchableSelect';

import { AccountItem, SelectedAccount } from './components';
import {
  compareAccounts,
  getWalletName,
  groupByWallet,
  searchAccounts,
} from './lib/utils';

type AccountSelectProps = {
  addressType: AddressType;
  value?: Account;
  onValueChange: (account: Account) => void;
  query?: string;
  onQueryChange: (query: string) => void;
  isBalanceVisible?: boolean;
};

export const AccountSelect: FC<AccountSelectProps> = ({
  addressType,
  value,
  onValueChange,
  query,
  onQueryChange,
  isBalanceVisible = true,
}) => {
  const { t } = useTranslation();
  const { allAccounts } = useAccountsContext();
  const { getWallet } = useWalletContext();

  return (
    <SearchableSelect<Account>
      id="account-select"
      options={allAccounts}
      getOptionId={(account) => account.id}
      groupBy={groupByWallet}
      getGroupLabel={getWalletName(getWallet)}
      isOptionEqualToValue={compareAccounts}
      searchFn={searchAccounts(addressType)}
      query={query}
      onQueryChange={onQueryChange}
      value={value}
      onValueChange={onValueChange}
      label={t('Account')}
      renderValue={(val) =>
        val ? (
          <SelectedAccount
            accountId={val.id}
            isBalanceVisible={isBalanceVisible}
          />
        ) : (
          <Typography variant="caption">{t('Choose')}</Typography>
        )
      }
      renderOption={(option, getOptionProps) => (
        <AccountItem
          {...getOptionProps(option)}
          key={option.id}
          account={option}
          addressType={addressType}
        />
      )}
    />
  );
};
