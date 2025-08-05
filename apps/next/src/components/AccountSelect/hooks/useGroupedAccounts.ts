import { useMemo } from 'react';
import { useTranslation } from 'react-i18next';

import { Account, AddressType, IMPORTED_ACCOUNTS_WALLET_ID } from '@core/types';
import { useAccountsContext, useWalletContext } from '@core/ui';

import { getAddressByType } from '@/utils/getAddressByType';

import { AccountGroup } from '../types';

export const useGroupedAccounts = (
  addressType: AddressType,
  query: string,
): AccountGroup[] => {
  const { t } = useTranslation();

  const { wallets } = useWalletContext();
  const {
    accounts: { imported: importedAccounts, primary: primaryAccounts },
  } = useAccountsContext();

  return useMemo(() => {
    const primary = wallets.map((wallet, index): AccountGroup => {
      return {
        name: wallet.name ?? t('Wallet {{index}}', { index: index + 1 }),
        id: wallet.id ?? `wallet-${index + 1}`,
        items: searchAccounts(
          primaryAccounts[wallet.id] ?? [],
          query,
          addressType,
        ),
      };
    });

    const imported: AccountGroup = {
      id: IMPORTED_ACCOUNTS_WALLET_ID,
      name: t('Imported accounts'),
      items: searchAccounts(
        Object.values(importedAccounts ?? {}),
        query,
        addressType,
      ),
    };

    return [...primary, imported].filter((wallet) => wallet.items.length > 0);
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
