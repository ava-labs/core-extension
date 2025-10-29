import { useEffect, useState } from 'react';
import { useTranslation } from 'react-i18next';
import { NetworkVMType } from '@avalabs/vm-module-types';
import { DerivationPath } from '@avalabs/core-wallets-sdk';

import {
  IMPORTED_ACCOUNTS_WALLET_ID,
  isVMCapableAccount,
  SecretType,
} from '@core/types';
import { useAccountsContext, useWalletContext } from '@core/ui';
import { isChainSupportedByWallet, mapAddressesToVMs } from '@core/common';

import { DappPermissionsState } from '../types';

export const useDappPermissionsState = (
  vm: NetworkVMType.SVM | NetworkVMType.EVM,
): DappPermissionsState => {
  const { t } = useTranslation();
  const {
    getAllWalletAccountsForVM,
    allAccounts,
    accounts: { active: activeAccount },
  } = useAccountsContext();
  const { wallets, walletDetails } = useWalletContext();

  const [selectedAccounts, setSelectedAccounts] = useState<Set<string>>(
    new Set(),
  );

  const toggleAccount = (accountId: string) =>
    setSelectedAccounts((current) => {
      const set = new Set(current);
      if (set.has(accountId)) {
        set.delete(accountId);
      } else {
        set.add(accountId);
      }
      return set;
    });

  const isSelected = (accountId: string) => selectedAccounts.has(accountId);

  useEffect(() => {
    if (activeAccount) {
      setSelectedAccounts((current) => {
        const set = new Set(current);
        if (isVMCapableAccount(vm, activeAccount)) {
          set.add(activeAccount.id);
        }
        return set;
      });
    }
  }, [activeAccount, vm]);

  if (!walletDetails || !allAccounts.length) {
    return {
      isLoading: true,
      wallets: [],
      isSelected,
      toggleAccount,
      selectedAccounts,
    };
  }

  const hasImportedAccounts =
    getAllWalletAccountsForVM(vm, IMPORTED_ACCOUNTS_WALLET_ID).length > 0;

  // Make sure to show the active wallet first and the imported accounts last
  const sortedWallets = wallets.toSorted((a) =>
    walletDetails.id === a.id ? -1 : 0,
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
    selectedAccounts,
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
