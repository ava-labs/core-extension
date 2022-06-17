import { createContext, useContext, useEffect, useState } from 'react';
import { useConnectionContext } from './ConnectionProvider';
import { ExtensionRequest } from '@src/background/connections/extensionConnection/models';
import {
  DappPermissions,
  Permissions,
} from '@src/background/services/permissions/models';
import { permissionsUpdatedEventListener } from '@src/background/services/permissions/events/permissionsStateUpdatesListener';
import { filter, map } from 'rxjs';

interface UpdateAccountPermission {
  addressC: string; // wallet c address
  hasPermission: boolean;
  domain: string;
  requestId: string;
}

function updateAnAccount(
  domain: string,
  account: { [address: string]: boolean }
): DappPermissions {
  return {
    domain,
    accounts: {
      ...account,
    },
  };
}

const PermissionContext = createContext<{
  permissions: Permissions;
  updateAccountPermission: (UpdateAccountPermission) => void;
  isDomainConnectedToAccount: (domain?: string, address?: string) => boolean;
}>({} as any);

export function PermissionContextProvider({ children }: { children: any }) {
  const { request, events } = useConnectionContext();

  const [permissionState, setPermissionState] = useState<Permissions>(
    {} as Permissions
  );

  function addPermissionsForDomain(
    permissions: DappPermissions,
    requestId: string
  ) {
    return request({
      method: ExtensionRequest.PERMISSIONS_ADD_DOMAIN,
      params: [permissions, requestId],
    });
  }

  async function updateAccountPermission({
    addressC, // wallet c address
    hasPermission,
    domain,
    requestId,
  }: UpdateAccountPermission) {
    const newPermissions = updateAnAccount(domain, {
      [addressC]: hasPermission,
    });

    if (!newPermissions) {
      return;
    }
    await addPermissionsForDomain(newPermissions, requestId);
  }

  function isDomainConnectedToAccount(domain?: string, address?: string) {
    if (!domain || !address) {
      return false;
    }
    const domainData: DappPermissions = permissionState[domain];
    if (!domainData?.accounts) {
      return false;
    }
    return !!domainData.accounts[address];
  }

  // listen for permissions changes
  useEffect(() => {
    let isCancelled = false;

    request({
      method: ExtensionRequest.PERMISSIONS_GET_ALL_PERMISSIONS,
      params: [],
    })
      .then((result) => {
        return result;
      })
      .then((permissions) => {
        !isCancelled && setPermissionState(permissions);
      });

    const subscription = events()
      .pipe(
        filter(permissionsUpdatedEventListener),
        map((evt) => evt.value)
      )
      .subscribe((permissions) => {
        setPermissionState(permissions);
      });
    return () => {
      subscription.unsubscribe();
      isCancelled = true;
    };
  }, [events, request]);

  return (
    <PermissionContext.Provider
      value={{
        permissions: permissionState,
        updateAccountPermission,
        isDomainConnectedToAccount,
      }}
    >
      {children}
    </PermissionContext.Provider>
  );
}

export function usePermissionContext() {
  return useContext(PermissionContext);
}
