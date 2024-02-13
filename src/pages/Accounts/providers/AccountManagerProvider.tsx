import {
  createContext,
  useCallback,
  useContext,
  useEffect,
  useState,
} from 'react';

import { useAccountsContext } from '@src/contexts/AccountsProvider';
import { useFeatureFlagContext } from '@src/contexts/FeatureFlagsProvider';
import { FeatureGates } from '@src/background/services/featureFlags/models';

interface AccountManagerContextProps {
  children?: React.ReactNode;
}

export const AccountManagerContext = createContext<{
  exitManageMode(): void;
  isManageMode: boolean;
  isAccountSelectable(accountId: string): boolean;
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

// TODO: make it work with multiple wallets.
// New data structure will be needed where we split the selected accounts by their respective wallets.
export const AccountManagerProvider = ({
  children,
}: AccountManagerContextProps) => {
  const { accounts } = useAccountsContext();
  const { featureFlags } = useFeatureFlagContext();
  const [selectedAccounts, setSelectedAccounts] = useState<string[]>([]);
  const [isManageMode, setIsManageMode] = useState(false);

  const isAccountSelectable = useCallback(
    (accountId: string) => {
      // Only allow removing primary accounts when the backend starts supporting it.
      if (!featureFlags[FeatureGates.PRIMARY_ACCOUNT_REMOVAL]) {
        return accountId in accounts.imported;
      }

      const index = accounts.primary.findIndex(({ id }) => id === accountId);
      const account = accounts.primary[index];

      // Account does not exist or is an imported account.
      if (!account) {
        // Imported accounts can always be removed.
        return accountId in accounts.imported;
      }

      // We do not allow removing the the very first account, but
      // ask the user to remove the whole wallet instead.
      if (index === 0) {
        return false;
      }

      // Primary accounts can only be selected for removal if they're the last
      // derived account for the given wallet...
      // if (index === accounts.primary.length - 1) {
      //   return true;
      // }

      // or when all of the following accounts are already selected.
      return accounts.primary
        .slice(index + 1)
        .every(({ id }) => selectedAccounts.includes(id));
    },
    [accounts.primary, accounts.imported, selectedAccounts, featureFlags]
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
          deselectPrevious ? currentSet.length - index : 1
        );

        return Array.from(currentSet);
      });
    },
    []
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
