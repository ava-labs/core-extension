import { ExtensionRequest } from '@src/background/connections/models';
import { DappPermissions } from '@src/background/services/permissions/models';
import { useConnectionContext } from '@src/contexts/ConnectionProvider';
import { useEffect, useMemo, useState } from 'react';

function accountsToPermissions(accounts: string[], domain: string) {
  return {
    domain,
    accounts: accounts.reduce((acc, account) => {
      return {
        ...acc,
        [account]: false,
      };
    }, {}),
  };
}

function updateAnAccount(
  permissions: ReturnType<typeof accountsToPermissions>,
  account: { [key: string]: boolean }
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

export function usePermissions(domain: string) {
  const { request } = useConnectionContext();
  const [permissions, updatePermissions] = useState<
    ReturnType<typeof accountsToPermissions> | undefined
  >();
  const acceptPermissionsDisabled = useMemo(
    () => permissions && !atleastOneAccountHasPermissions(permissions),
    [permissions]
  );

  useEffect(() => {
    Promise.all([
      request({
        method: ExtensionRequest.PERMISSIONS_GET_PERMISSIONS,
        params: [domain],
      }),

      request({
        method: ExtensionRequest.PERMISSIONS_GET_ACCOUNTS,
      }).then((result) => {
        return accountsToPermissions(result, domain);
      }),
    ]).then(([existing, newBasedonAccounts]) => {
      updatePermissions(existing || newBasedonAccounts);
    });
  }, []);

  function addPermissionsForDomain(permissions: DappPermissions) {
    return request({
      method: ExtensionRequest.PERMISSIONS_ADD_DOMAIN,
      params: [permissions],
    });
  }

  function updateAccountPermission(account: string, hasPermission: boolean) {
    if (!permissions) return;

    updatePermissions(
      updateAnAccount(permissions, { [account]: hasPermission })
    );
  }

  return {
    addPermissionsForDomain,
    permissions,
    acceptPermissionsDisabled,
    updateAccountPermission,
  };
}
