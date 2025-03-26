import {
  createContext,
  useCallback,
  useContext,
  useEffect,
  useState,
} from 'react';
import { useConnectionContext } from './ConnectionProvider';
import { ExtensionRequest } from '@src/background/connections/extensionConnection/models';
import { Permissions } from '@src/background/services/permissions/models';
import { permissionsUpdatedEventListener } from '@src/background/services/permissions/events/permissionsStateUpdatesListener';
import { filter, map } from 'rxjs';
import { GetAllPermissionsHandler } from '@src/background/services/permissions/handlers/getAllPermissions';
import { RevokeAddressPermissionsForDomainHandler } from '@src/background/services/permissions/handlers/revokeAddressPermissionsForDomain';
import { toLower } from 'lodash';

const PermissionContext = createContext<{
  permissions: Permissions;
  revokeAddressPermisson: (
    domain: string,
    addresses: string[],
  ) => Promise<true>;
  isDomainConnectedToAccount: (
    domain?: string,
    addresses?: string[],
  ) => boolean;
}>({} as any);

export function PermissionContextProvider({ children }: { children: any }) {
  const { request, events } = useConnectionContext();

  const [permissionState, setPermissionState] = useState<Permissions>(
    {} as Permissions,
  );

  const revokeAddressPermisson = useCallback(
    (domain: string, addresses: string[]) =>
      request<RevokeAddressPermissionsForDomainHandler>({
        method: ExtensionRequest.PERMISSIONS_REVOKE_ADDRESS_ACCESS_FOR_DOMAIN,
        params: [domain, addresses],
      }),
    [request],
  );

  const isDomainConnectedToAccount = useCallback(
    (domain?: string, addresses?: string[]) => {
      if (!domain || !addresses?.length) {
        return false;
      }
      const domainData = permissionState[domain];
      if (!domainData?.accounts) {
        return false;
      }
      return addresses
        .map(toLower)
        .some((addr) =>
          Object.keys(domainData.accounts).map(toLower).includes(addr),
        );
    },
    [permissionState],
  );

  // listen for permissions changes
  useEffect(() => {
    let isCancelled = false;

    request<GetAllPermissionsHandler>({
      method: ExtensionRequest.PERMISSIONS_GET_ALL_PERMISSIONS,
    })
      .then((result) => {
        return result;
      })
      .then((permissions) => {
        if (isCancelled) {
          return;
        }
        setPermissionState(permissions);
      });

    const subscription = events()
      .pipe(
        filter(permissionsUpdatedEventListener),
        map((evt) => evt.value),
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
        revokeAddressPermisson,
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
