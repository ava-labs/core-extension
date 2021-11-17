import { ExtensionRequest } from '@src/background/connections/models';
import { Account } from '@src/background/services/accounts/models';
import { DappPermissions } from '@src/background/services/permissions/models';
import { useConnectionContext } from '@src/contexts/ConnectionProvider';
import { useEffect, useMemo, useState } from 'react';

function accountsToPermissions(accounts: Account[], domain: string) {
  return {
    domain,
    accounts: accounts.reduce((acc, account) => {
      return {
        ...acc,
        [account.addressC]: false,
      };
    }, {}),
  };
}

function updateAnAccount(
  permissions: ReturnType<typeof accountsToPermissions>,
  account: { [address: string]: boolean }
) {
  return {
    ...permissions,
    accounts: {
      ...permissions.accounts,
      ...account,
    },
  };
}

function atleastOneAccountHasPermissions(permissions: DappPermissions) {
  return (Object.values(permissions.accounts) || []).some((value) => value);
}

export function usePermissions(domain?: string) {
  const { request } = useConnectionContext();
  const [permissions, updatePermissions] = useState<
    ReturnType<typeof accountsToPermissions> | undefined
  >();
  const acceptPermissionsDisabled = useMemo(
    () => permissions && !atleastOneAccountHasPermissions(permissions),
    [permissions]
  );

  useEffect(() => {
    if (!domain) {
      updatePermissions(undefined);
      return;
    }

    Promise.all([
      request({
        method: ExtensionRequest.PERMISSIONS_GET_PERMISSIONS,
        params: [domain],
      }),

      // gets every account to map the permissions to in a second step
      request({
        method: ExtensionRequest.PERMISSIONS_GET_ACCOUNTS,
      }).then((result: Account[]) => {
        return accountsToPermissions(result, domain);
      }),
    ]).then(([existing, newBasedonAccounts]) => {
      // update permissions on the previously constructed account list
      updatePermissions(existing || newBasedonAccounts);
    });
  }, [domain]);

  function addPermissionsForDomain(permissions: DappPermissions) {
    return request({
      method: ExtensionRequest.PERMISSIONS_ADD_DOMAIN,
      params: [permissions],
    });
  }

  function updateAccountPermission(
    addressC: string, // wallet c address
    hasPermission: boolean
  ) {
    if (!permissions) return;

    updatePermissions(
      updateAnAccount(permissions, { [addressC]: hasPermission })
    );
  }

  return {
    addPermissionsForDomain,
    permissions,
    acceptPermissionsDisabled,
    updateAccountPermission,
  };
}
