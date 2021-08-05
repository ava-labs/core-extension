import {
  getFromStorage,
  removeFromStorage,
  saveToStorage,
  storageEventListener,
} from '@src/utils/storage/chrome-storage';
import {
  Subject,
  tap,
  concat,
  firstValueFrom,
  combineLatest,
  map,
  filter,
  from,
} from 'rxjs';
import { DappPermissions, Permissions } from './models';

const PERMISSION_STORAGE_KEY = 'permissions';
const _permissions = new Subject<Permissions>();

class PermissionsService {
  permissions = concat(
    from(
      getFromStorage(PERMISSION_STORAGE_KEY).then((permissions) => {
        return permissions;
      })
    ),
    _permissions
  );

  constructor() {
    _permissions
      .pipe(
        tap((permissions) => {
          saveToStorage({ [PERMISSION_STORAGE_KEY]: permissions });
        })
      )
      .subscribe();
  }

  /**
   * In order for a domain to qualify as permitted it needs to have added accounts, at
   * least one of those accounts needs to be granted
   *
   * @param domain the domain we want to check for permissions
   * @returns boolean
   */
  async domainHasAccountsPermissions(domain: string) {
    const permissions = await firstValueFrom(this.permissions);

    return !!(
      permissions[domain] &&
      permissions[domain].accounts &&
      Object.values(permissions[domain].accounts).length &&
      Object.values(permissions[domain].accounts).some((value) => value)
    );
  }

  /**
   * If the permissions are popped open and the user closes it without giving permissions
   * than we need to write to disk beofre the window closes that permissions were refused. This
   * write will signal to the connect request that the user refused the connect and release the stream
   * so they can click connect again.
   *
   * @param domain the domain name
   * @returns boolean
   */
  async domainPermissionsExist(domain: string) {
    const permissions = await firstValueFrom(this.permissions);
    return !!permissions[domain];
  }

  async addPermissionsForDomain(permissions: DappPermissions) {
    const perms = await firstValueFrom(this.permissions);
    _permissions.next({
      ...perms,
      [permissions.domain]: permissions,
    });
  }

  async removeAll() {
    return removeFromStorage(PERMISSION_STORAGE_KEY);
  }

  /**
   * In order to work with the @link https://metamask.github.io/test-dapp/ we convert our own
   * permissions to the structure currently used by metamask
   *
   * @param domain the domain for which permissions are being requested
   * @returns
   */
  async getPermissionsConvertedToMetaMaskStructure(domain: string) {
    const hasAccountsPermission = await this.domainHasAccountsPermissions(
      domain
    );
    return hasAccountsPermission
      ? [
          {
            invoker: domain,
            parentCapability: 'accounts',
          },
        ]
      : [];
  }

  listenForPermissionChanges() {
    return combineLatest([storageEventListener(), this.permissions]).pipe(
      filter(([evt]) => {
        return !!evt.changes[PERMISSION_STORAGE_KEY];
      }),
      map(([_evt, permissions]) => {
        return permissions;
      })
    );
  }
}

export const permissionsService = new PermissionsService();
