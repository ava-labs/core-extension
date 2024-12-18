import { OnLock } from '@src/background/runtime/lifecycleCallbacks';
import { EventEmitter } from 'events';
import { singleton } from 'tsyringe';
import { StorageService } from '../storage/StorageService';
import {
  DappPermissions,
  PermissionEvents,
  Permissions,
  PERMISSION_STORAGE_KEY,
} from './models';

@singleton()
export class PermissionsService implements OnLock {
  #eventEmitter = new EventEmitter();
  #permissions?: Permissions;

  constructor(private storageService: StorageService) {}

  get permissions() {
    return this.#permissions;
  }

  set permissions(permissions: Permissions | undefined) {
    if (JSON.stringify(this.permissions) === JSON.stringify(permissions)) {
      return;
    }

    this.#permissions = permissions;
    this.#eventEmitter.emit(
      PermissionEvents.PERMISSIONS_STATE_UPDATE,
      this.permissions ?? {},
    );
  }

  onLock(): void {
    this.permissions = undefined;
  }

  // use getter to cache permissions
  // they are needed for every dApp rpc request
  async getPermissions(): Promise<Permissions> {
    if (this.permissions) {
      return this.permissions ?? {};
    }

    try {
      this.permissions =
        (await this.storageService.load<Permissions>(PERMISSION_STORAGE_KEY)) ??
        {};
    } catch (_err) {
      /**
       * If permissions arent pulled then dont set permissions to an empty object
       * since permissions is requested when the extension opens and the password may not have
       * not have been set yet. If you set permissions to an empty object at this point then it will
       * not try to retrieve them again once the password has been input and thus permissions wont be
       * set properly after retart
       */
    }

    return this.permissions ?? {};
  }

  async getPermissionsForDomain(domain: string) {
    const permissions = await this.getPermissions();
    return permissions[domain];
  }

  async hasDomainPermissionForAccount(
    domain: string,
    address: string,
  ): Promise<boolean> {
    const domainPermissions = await this.getPermissionsForDomain(domain);
    return !!domainPermissions?.accounts[address];
  }

  async addPermission(dappPermissions: DappPermissions) {
    const currentPermissions = await this.getPermissions();
    const permissionsForDomain: DappPermissions =
      currentPermissions[dappPermissions.domain] || dappPermissions;

    this.permissions = {
      ...currentPermissions,
      [dappPermissions.domain]: {
        ...permissionsForDomain,
        accounts: {
          ...permissionsForDomain.accounts,
          ...dappPermissions.accounts,
        },
      },
    };

    this.storageService.save<Permissions | undefined>(
      PERMISSION_STORAGE_KEY,
      this.permissions,
    );
  }

  async setAccountPermissionForDomain(
    domain: string,
    address: string,
    hasPermission: boolean,
  ) {
    const currentPermissions = await this.getPermissions();

    const permissionsForDomain: DappPermissions = currentPermissions[
      domain
    ] || {
      domain,
      accounts: {},
    };

    this.permissions = {
      ...currentPermissions,
      [domain]: {
        ...permissionsForDomain,
        accounts: {
          ...permissionsForDomain.accounts,
          [address]: hasPermission,
        },
      },
    };

    this.storageService.save<Permissions | undefined>(
      PERMISSION_STORAGE_KEY,
      this.permissions,
    );
  }

  async addWhitelistDomains(addressC: string) {
    try {
      await this.setAccountPermissionForDomain('core.app', addressC, true);
      await this.setAccountPermissionForDomain('test.core.app', addressC, true);
    } catch (err) {
      console.error(err);
    }
  }

  addListener(event: PermissionEvents, callback: (data: unknown) => void) {
    this.#eventEmitter.addListener(event, callback);
  }

  removeListener(event: PermissionEvents, callback: (data: unknown) => void) {
    this.#eventEmitter.removeListener(event, callback);
  }
}
