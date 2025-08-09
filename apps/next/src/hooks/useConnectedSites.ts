import { NetworkVMType } from '@avalabs/vm-module-types';
import { getAllAddressesForAccount } from '@core/common';
import { Account } from '@core/types';
import { useAccountsContext, usePermissionContext } from '@core/ui';
import { useCallback, useMemo } from 'react';
import { getFaviconUrl } from '../pages/Settings/components/ConnectedSites/utils/favicon';

export interface ConnectedSite {
  domain: string;
  favicon: string;
  accounts: Record<string, NetworkVMType>;
}

export const useConnectedSites = () => {
  const { accounts, selectAccount, allAccounts } = useAccountsContext();
  const { permissions, revokeAddressPermission, isDomainConnectedToAccount } =
    usePermissionContext();

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
        accounts: dappPermissions.accounts,
        favicon: getFaviconUrl(domain),
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
    selectAccount,
    disconnectSite,
    isDomainConnectedToAccount,
  };
};
