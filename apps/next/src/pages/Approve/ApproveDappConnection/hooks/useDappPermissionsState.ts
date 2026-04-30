import { useState } from 'react';
import { useTranslation } from 'react-i18next';
import { NetworkVMType } from '@avalabs/vm-module-types';
import { DerivationPath } from '@avalabs/core-wallets-sdk';

import { Account, IMPORTED_ACCOUNTS_WALLET_ID, SecretType } from '@core/types';
import { useAccountsContext, useWalletContext } from '@core/ui';
import { isChainSupportedByWallet, mapAddressesToVMs } from '@core/common';

import { ConnectDappDisplayData, DappPermissionsState } from '../types';

export const useDappPermissionsState = (
  activeAccount: Account,
  displayData: ConnectDappDisplayData,
): DappPermissionsState => {
  const { t } = useTranslation();
  const { getAllWalletAccountsForVM, allAccounts } = useAccountsContext();
  const { wallets, walletDetails } = useWalletContext();

  const { addressVM: vm } = displayData;

  const [selectedAccountId, setSelectedAccountId] = useState(() => {
    const addresses = mapAddressesToVMs(activeAccount);
    if (addresses[vm]) return activeAccount.id;
    return (
      allAccounts.find((a) => mapAddressesToVMs(a)[vm])?.id ?? activeAccount.id
    );
  });

  const selectAccount = (accountId: string) => setSelectedAccountId(accountId);

  if (!allAccounts.length) {
    return {
      isLoading: true,
      wallets: [],
      numberOfSelectedAccounts: 1,
      selectedAccountId,
      selectAccount,
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
    selectedAccountId,
    selectAccount,
    numberOfSelectedAccounts: 1,
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
