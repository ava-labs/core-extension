import { Account, AddressType, WalletDetails } from '@core/types';
import { isPrimaryAccount } from '@core/common';

import { type Group } from '@/components/SearchableSelect';
import { getAddressByType } from '@/utils/getAddressByType';

import { IMPORTED_ACCOUNTS_GROUP_ID } from './config';

export const groupByWallet = (account: Account) =>
  isPrimaryAccount(account) ? account.walletId : IMPORTED_ACCOUNTS_GROUP_ID;

export const getWalletName =
  (getWallet: (walletId: string) => WalletDetails | undefined) =>
  (accountGroup: Group<Account>) =>
    getWallet(accountGroup.id)?.name ?? 'Unnamed wallet';

export const compareAccounts = (account: Account, selectedAccount: Account) =>
  account.id === selectedAccount.id;

export const searchAccounts =
  (addressType: AddressType) => (account: Account, query?: string) => {
    if (!query) {
      return true;
    }

    const pureQuery = query?.toLowerCase();
    const name = account.name.toLowerCase();
    const address = getAddressByType(account, addressType)?.toLowerCase();

    return (name.includes(pureQuery) || address?.includes(pureQuery)) ?? false;
  };
