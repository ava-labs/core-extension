import {
  GetAllPermissionsHandler,
  RevokeAddressPermissionsForDomainHandler,
} from '@core/service-worker';
import { ExtensionRequest, Permissions } from '@core/types';
import { toLower } from 'lodash';
import {
  createContext,
  PropsWithChildren,
  useCallback,
  useContext,
  useEffect,
  useState,
} from 'react';
import { filter, map } from 'rxjs';
import { useConnectionContext } from '../ConnectionProvider';
import { permissionsUpdatedEventListener } from './permissionsEventFilters';

const PermissionContext = createContext<{
  permissions: Permissions;
  revokeAddressPermission: (
    domain: string,
    addresses: string[],
  ) => Promise<true>;
  isDomainConnectedToAccount: (
    domain?: string,
    addresses?: string[],
  ) => boolean;
}>({} as any);

export function PermissionContextProvider({ children }: PropsWithChildren) {
  const { request, events } = useConnectionContext();

  const [permissionState, setPermissionState] = useState<Permissions>(
    {} as Permissions,
  );

  const revokeAddressPermission = useCallback(
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
        revokeAddressPermission,
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
