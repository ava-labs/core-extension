import { useMemo, useState } from 'react';
import { useTranslation } from 'react-i18next';
import { NetworkVMType } from '@avalabs/vm-module-types';
import { DerivationPath } from '@avalabs/core-wallets-sdk';

import {
  Account,
  DappPermissions,
  IMPORTED_ACCOUNTS_WALLET_ID,
  isVMCapableAccount,
  Permissions,
  SecretType,
} from '@core/types';
import { useAccountsContext, useWalletContext } from '@core/ui';
import { isChainSupportedByWallet, mapAddressesToVMs } from '@core/common';

import { ConnectDappDisplayData, DappPermissionsState } from '../types';

const getInitiallySelectedAccounts = (
  activeAccount: Account,
  getAccount: (address: string) => Account | undefined,
  vm: NetworkVMType,
  permissions?: DappPermissions,
): Map<string, boolean> => {
  const { accounts } = permissions ?? {};

  const allMap = new Map<string, boolean>();

  const accountsWithAccess = Object.entries(accounts ?? {})
    .filter(([_, accessibleVM]) => {
      return vm === accessibleVM;
    })
    .map(([address]) => getAccount(address))
    .filter((acc) => acc !== undefined)
    .filter((acc) => acc.id !== activeAccount.id)
    .map((acc) => acc.id);

  if (isVMCapableAccount(vm, activeAccount)) {
    allMap.set(activeAccount.id, true);
  }

  for (const id of accountsWithAccess) {
    allMap.set(id, true);
  }

  return allMap;
};

export const useDappPermissionsState = (
  activeAccount: Account,
  permissions: Permissions,
  displayData: ConnectDappDisplayData,
): DappPermissionsState => {
  const { t } = useTranslation();
  const { getAllWalletAccountsForVM, getAccount, allAccounts } =
    useAccountsContext();
  const { wallets, walletDetails } = useWalletContext();

  const { addressVM: vm, dappDomain } = displayData;
  const initiallySelectedAccounts = useMemo(() => {
    return getInitiallySelectedAccounts(
      activeAccount,
      getAccount,
      vm,
      permissions[dappDomain],
    );
  }, [activeAccount, getAccount, vm, permissions, dappDomain]);

  const [accountSettings, setAaccountSettings] = useState(
    initiallySelectedAccounts,
  );

  const toggleAccount = (accountId: string) =>
    setAaccountSettings((current) => {
      const map = new Map(current);
      map.set(accountId, !map.get(accountId));
      return map;
    });

  const isSelected = (accountId: string) =>
    accountSettings.get(accountId) ?? false;

  if (!allAccounts.length) {
    return {
      isLoading: true,
      wallets: [],
      numberOfSelectedAccounts: 0,
      isSelected,
      toggleAccount,
      accountSettings,
    };
  }

  const hasImportedAccounts =
    getAllWalletAccountsForVM(vm, IMPORTED_ACCOUNTS_WALLET_ID).length > 0;

  // Make sure to show the active wallet first and the imported accounts last
  const sortedWallets = wallets.toSorted((a) =>
    walletDetails?.id === a.id ? -1 : 0,
  );

  if (hasImportedAccounts) {
    sortedWallets.push({
      id: IMPORTED_ACCOUNTS_WALLET_ID,
      name: t('Imported'),
      type: SecretType.PrivateKey,
      derivationPath: DerivationPath.BIP44,
    });
  }

  return {
    isLoading: false,
    isSelected,
    toggleAccount,
    numberOfSelectedAccounts: Array.from(accountSettings.values()).filter(
      (enabled) => enabled,
    ).length,
    accountSettings,
    wallets: sortedWallets.map((wallet) => {
      const accounts = getAllWalletAccountsForVM(vm, wallet.id).map(
        (account) => ({
          id: account.id,
          name: account.name,
          address: mapAddressesToVMs(account)[vm]!,
        }),
      );

      const isNetworkSupported = isChainSupportedByWallet(vm, wallet.type);

      const common = {
        id: wallet.id,
        type: wallet.type,
        name: wallet.name,
        authProvider:
          wallet.type === SecretType.Seedless ? wallet.authProvider : undefined,
        accounts,
      };

      if (!isNetworkSupported && vm === NetworkVMType.SVM) {
        return {
          ...common,
          state: 'solana-not-supported',
        };
      }

      if (!isNetworkSupported) {
        return {
          ...common,
          state: 'network-not-supported',
        };
      }

      if (isNetworkSupported && vm === NetworkVMType.SVM) {
        const isLedgerWallet =
          wallet.type === SecretType.Ledger ||
          wallet.type === SecretType.LedgerLive;

        return {
          ...common,
          state:
            accounts.length > 0
              ? 'ready'
              : // For Ledger wallets, a user action is required.
                isLedgerWallet
                ? 'ledger-needs-solana-setup'
                : // For Seedless, we may need to wait a few seconds for the addresses to be derived.
                  'seedless-solana-loading',
        };
      }

      return {
        ...common,
        state: 'ready',
      };
    }),
  };
};
