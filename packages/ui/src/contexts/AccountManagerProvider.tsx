import {
  createContext,
  useCallback,
  useContext,
  useEffect,
  useState,
} from 'react';

import { isPrimaryAccount } from '@core/common';
import { Account, FeatureGates, SecretType } from '@core/types';
import { useAccountsContext } from './AccountsProvider';
import { useFeatureFlagContext } from './FeatureFlagsProvider';
import { useWalletContext } from './WalletProvider';

interface AccountManagerContextProps {
  children?: React.ReactNode;
}

const AccountManagerContext = createContext<{
  exitManageMode(): void;
  isManageMode: boolean;
  isAccountSelectable(account: Account): boolean;
  selectedAccounts: string[];
  selectAccount(accountId: string): void;
  deselectAccount(accountId: string, deselectPrevious?: boolean): void;
  toggleManageMode(newValue?: boolean): void;
}>({
  exitManageMode() {},
  isManageMode: false,
  isAccountSelectable() {
    return false;
  },
  selectedAccounts: [],
  selectAccount() {},
  deselectAccount() {},
  toggleManageMode() {},
});

export enum SelectionMode {
  None, // Reserved for Seedless
  Any,
  Consecutive,
}

export const AccountManagerProvider = ({
  children,
}: AccountManagerContextProps) => {
  const { accounts } = useAccountsContext();
  const { featureFlags } = useFeatureFlagContext();
  const { getWallet } = useWalletContext();
  const [selectedAccounts, setSelectedAccounts] = useState<string[]>([]);
  const [isManageMode, setIsManageMode] = useState(false);

  const isAccountSelectable = useCallback(
    (account: Account) => {
      // Seedless accounts cannot be selected for deletion
      if (isPrimaryAccount(account)) {
        const wallet = getWallet(account.walletId);
        if (wallet?.type === SecretType.Seedless) {
          return false;
        }
      }

      if (
        !featureFlags[FeatureGates.PRIMARY_ACCOUNT_REMOVAL] ||
        !isPrimaryAccount(account)
      ) {
        return account.id in accounts.imported;
      }

      const { id: accountId, walletId } = account;

      if (selectedAccounts.includes(accountId)) {
        return true;
      }

      const walletPrimaryAccounts = accounts.primary[walletId];

      if (!walletPrimaryAccounts) {
        return false;
      }

      const allAccountsCount = Object.values(accounts.primary).flat().length;
      if (allAccountsCount - 1 === selectedAccounts.length) {
        return false;
      }

      return walletPrimaryAccounts
        .slice(walletPrimaryAccounts.indexOf(account) + 1)
        .every(({ id }) => selectedAccounts.includes(id));

      return false;
    },
    [
      featureFlags,
      selectedAccounts,
      accounts.primary,
      accounts.imported,
      getWallet,
    ],
  );

  const selectAccount = useCallback((accountId: string) => {
    setSelectedAccounts((currentSet) => {
      return [...currentSet, accountId];
    });
  }, []);

  const deselectAccount = useCallback(
    (accountId: string, deselectPrevious = false) => {
      setSelectedAccounts((currentSet) => {
        const index = currentSet.indexOf(accountId);

        if (index === -1) {
          return currentSet;
        }

        currentSet.splice(
          index,
          deselectPrevious ? currentSet.length - index : 1,
        );

        return Array.from(currentSet);
      });
    },
    [],
  );

  const toggleManageMode = useCallback(() => {
    setIsManageMode((wasManageModeEnabled) => !wasManageModeEnabled);
  }, []);

  const exitManageMode = useCallback(() => {
    setIsManageMode(false);
    setSelectedAccounts([]);
  }, []);

  useEffect(() => {
    setSelectedAccounts([]);
  }, [isManageMode]);

  return (
    <AccountManagerContext.Provider
      value={{
        exitManageMode,
        isAccountSelectable,
        isManageMode,
        selectedAccounts,
        selectAccount,
        deselectAccount,
        toggleManageMode,
      }}
    >
      {children}
    </AccountManagerContext.Provider>
  );
};

export function useAccountManager() {
  return useContext(AccountManagerContext);
}
