import { getAllAddressesForAccount } from '@core/common';
import { Account } from '@core/types';
import { useAccountsContext, usePermissionContext } from '@core/ui';
import { useCallback, useMemo } from 'react';

interface ConnectedSite {
  domain: string;
  name?: string;
  icon?: string;
  accounts: { [address: string]: any };
}

export const useConnectedSites = () => {
  const { accounts, selectAccount, allAccounts } = useAccountsContext();
  const { permissions, revokeAddressPermission } = usePermissionContext();

  const selectedAccount = accounts.active;

  // Transform permissions into connected sites format
  const connectedSites: ConnectedSite[] = useMemo(() => {
    if (!permissions || !selectedAccount) {
      return [];
    }

    const accountAddresses = getAllAddressesForAccount(selectedAccount).map(
      (addr) => addr?.toLowerCase(),
    );

    return Object.entries(permissions)
      .filter(([, dappPermissions]) => {
        if (!dappPermissions?.accounts) return false;

        // Check if any of the account's addresses are connected to this dApp
        const connectedAddresses = Object.keys(dappPermissions.accounts).map(
          (addr) => addr.toLowerCase(),
        );

        return accountAddresses.some(
          (addr) => addr && connectedAddresses.includes(addr),
        );
      })
      .map(([domain, dappPermissions]) => ({
        domain,
        name: dappPermissions.siteName || undefined,
        icon: dappPermissions.siteIcon || undefined,
        accounts: dappPermissions.accounts,
      }));
  }, [permissions, selectedAccount]);

  const disconnectSite = useCallback(
    async (domain: string, account?: Account) => {
      if (!account) return;

      const addresses = getAllAddressesForAccount(account).filter(Boolean);
      await revokeAddressPermission(domain, addresses);
    },
    [revokeAddressPermission],
  );

  return {
    selectedAccount,
    accounts: allAccounts,
    connectedSites,
    isLoading: false, // TODO: Implement loading state if needed
    selectAccount,
    disconnectSite,
  };
};
