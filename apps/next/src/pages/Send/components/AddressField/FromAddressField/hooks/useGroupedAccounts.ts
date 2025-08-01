import { useMemo } from 'react';
import { useTranslation } from 'react-i18next';

import {
  Account,
  AddressType,
  IMPORTED_ACCOUNTS_WALLET_ID,
  ImportedAccount,
  PrimaryAccount,
  WalletDetails,
} from '@core/types';
import { useAccountsContext, useWalletContext } from '@core/ui';

import { getAddressByType } from '@/utils/getAddressByType';

export const useGroupedAccounts = (addressType: AddressType, query: string) => {
  const { t } = useTranslation();

  const { wallets } = useWalletContext();
  const {
    accounts: { imported: importedAccounts, primary: primaryAccounts },
  } = useAccountsContext();

  return useMemo(() => {
    const primary = wallets.map(
      (wallet): WalletDetails & { accounts: PrimaryAccount[] } => {
        return {
          ...wallet,
          accounts: searchAccounts(
            primaryAccounts[wallet.id] ?? [],
            query,
            addressType,
          ),
        };
      },
    );

    const imported: Omit<WalletDetails, 'type' | 'derivationPath'> & {
      type: 'all-imported';
      accounts: ImportedAccount[];
    } = {
      id: IMPORTED_ACCOUNTS_WALLET_ID,
      type: 'all-imported',
      name: t('Imported accounts'),
      accounts: searchAccounts(
        Object.values(importedAccounts ?? {}),
        query,
        addressType,
      ),
    };

    return [...primary, imported].filter(
      (wallet) => wallet.accounts.length > 0,
    );
  }, [wallets, primaryAccounts, importedAccounts, t, query, addressType]);
};

const searchAccounts = <T extends Account>(
  accounts: T[],
  query: string,
  addressType: AddressType,
): T[] => {
  return accounts.filter(
    (account) =>
      account.name.toLowerCase().includes(query.toLowerCase()) ||
      getAddressByType(account, addressType)
        ?.toLowerCase()
        .includes(query.toLowerCase()),
  );
};
