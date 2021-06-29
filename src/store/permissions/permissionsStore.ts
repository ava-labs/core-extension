import { makeAutoObservable } from 'mobx';
import { persistStore } from '@src/utils/mobx';
import { getStoreFromStorage } from '@src/background/utils/storage';

export interface DappPermissions {
  domain: string;
  accounts: {
    [account: string]: boolean;
  };
}

export interface Permissions {
  [domain: string]: DappPermissions;
}

export default class PermissionsStore {
  _permissions: Permissions = {};

  get permissions() {
    return getStoreFromStorage('PermissionsStore')?._permissions || {};
  }
  set permissions(permissions: Permissions) {
    this._permissions = permissions;
  }

  constructor() {
    makeAutoObservable(this);
    persistStore(this, ['_permissions'], 'PermissionsStore');
  }
  /**
   * In order for a domain to qualify as permitted it needs to have added accounts, at
   * least one of those accounts needs to be granted
   *
   * @param domain the domain we want to check for permissions
   * @returns boolean
   */
  domainHasPermissions(domain: string) {
    return !!(
      this.permissions[domain] &&
      this.permissions[domain].accounts &&
      Object.values(this.permissions[domain].accounts).length &&
      Object.values(this.permissions[domain].accounts).some((value) => value)
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
  domainPermissionsExist(domain: string) {
    return !!this.permissions[domain];
  }

  addPermissionsForDomain(permissions: DappPermissions) {
    this.permissions = {
      ...this.permissions,
      [permissions.domain]: permissions,
    };
  }
}
