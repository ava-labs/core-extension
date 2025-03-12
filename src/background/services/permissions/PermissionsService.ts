import { lowerCase, omit } from 'lodash';
import { NetworkVMType } from '@avalabs/vm-module-types';
import { OnLock } from '@src/background/runtime/lifecycleCallbacks';
import { EventEmitter } from 'events';
import { singleton } from 'tsyringe';
import { StorageService } from '../storage/StorageService';
import {
  PermissionEvents,
  Permissions,
  PERMISSION_STORAGE_KEY,
} from './models';
import { Account } from '../accounts/models';
import getAllAddressesForAccount from '@src/utils/getAllAddressesForAccount';

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
      this.permissions = omit(
        (await this.storageService.load<Permissions>(PERMISSION_STORAGE_KEY)) ??
          {},
        'version',
      );
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
    account: Account,
  ): Promise<boolean> {
    const domainPermissions = await this.getPermissionsForDomain(domain);
    const permittedAddresses = Object.keys(
      domainPermissions?.accounts ?? {},
    ).map(lowerCase);
    const accountAddresses = getAllAddressesForAccount(account).map(lowerCase);

    return accountAddresses.some((address) =>
      permittedAddresses.includes(address),
    );
  }

  async revokePermission(domain: string, addresses: string[]) {
    const currentPermissions = await this.getPermissions();
    const permissionsForDomain = currentPermissions[domain];

    if (!permissionsForDomain) {
      // Nothing to revoke
      return;
    }

    const newPermissionsForDomain = {
      ...permissionsForDomain,
      accounts: omit(permissionsForDomain.accounts, addresses),
    };

    if (Object.keys(newPermissionsForDomain.accounts).length === 0) {
      // dApp no longer has any permissions, just remove the whole domain
      this.permissions = omit(currentPermissions, domain);
    } else {
      this.permissions = {
        ...currentPermissions,
        [domain]: newPermissionsForDomain,
      };
    }

    await this.storageService.save<Permissions | undefined>(
      PERMISSION_STORAGE_KEY,
      this.permissions,
    );

    return this.permissions;
  }

  async grantPermission(domain: string, address: string, vm: NetworkVMType) {
    const currentPermissions = await this.getPermissions();
    const permissionsForDomain = currentPermissions[domain] ?? {
      domain,
      accounts: {},
    };

    this.permissions = {
      ...currentPermissions,
      [domain]: {
        ...permissionsForDomain,
        accounts: {
          ...permissionsForDomain.accounts,
          [address]: vm,
        },
      },
    };

    await this.storageService.save<Permissions | undefined>(
      PERMISSION_STORAGE_KEY,
      this.permissions,
    );

    return this.permissions;
  }

  async addWhitelistDomains(addressC: string) {
    try {
      await this.grantPermission('core.app', addressC, NetworkVMType.EVM);
      await this.grantPermission('test.core.app', addressC, NetworkVMType.EVM);
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
