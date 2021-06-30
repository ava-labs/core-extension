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
   * @returns
   */
  domainHasPermissions(domain: string) {
    return !!(
      this.permissions[domain] &&
      this.permissions[domain].accounts &&
      Object.values(this.permissions[domain].accounts).length &&
      Object.values(this.permissions[domain].accounts).some((value) => value)
    );
  }

  addPermissionsForDomain(permissions: DappPermissions) {
    this.permissions = {
      ...this.permissions,
      [permissions.domain]: permissions,
    };
  }
}
