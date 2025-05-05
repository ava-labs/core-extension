import { lowerCase, omit } from 'lodash';
import { ethErrors } from 'eth-rpc-errors';
import { NetworkVMType } from '@avalabs/vm-module-types';
import { OnLock } from '../../runtime/lifecycleCallbacks';
import { EventEmitter } from 'events';
import { singleton } from 'tsyringe';
import { StorageService } from '../storage/StorageService';
import {
	Account,
  PermissionEvents,
  Permissions,
  PERMISSION_STORAGE_KEY,
  PermissionsState,
  DappPermissions,
} from '@core/types';
import { getAddressByVMType, getAllAddressesForAccount } from '@core/common';
import { SYNCED_DOMAINS } from '@core/common';

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
      const storedPermissions =
        await this.storageService.load<PermissionsState>(
          PERMISSION_STORAGE_KEY,
        );
      this.permissions = storedPermissions?.permissions ?? {};
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
    vm?: NetworkVMType,
  ): Promise<boolean> {
    const domainPermissions = await this.getPermissionsForDomain(domain);
    const permittedAddresses = Object.keys(
      domainPermissions?.accounts ?? {},
    ).map(lowerCase);

    if (vm) {
      const address = getAddressByVMType(account, vm);

      if (!address) {
        throw ethErrors.rpc.internal(
          `Provided account has no address derived for the "${vm}" virtual machine`,
        );
      }

      return permittedAddresses.includes(lowerCase(address));
    }

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

    await this.storageService.save<PermissionsState | undefined>(
      PERMISSION_STORAGE_KEY,
      { permissions: this.permissions },
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

    await this.storageService.save<PermissionsState | undefined>(
      PERMISSION_STORAGE_KEY,
      { permissions: this.permissions },
    );

    return this.permissions;
  }

  async whitelistCoreDomains(
    addressMap: Partial<Record<NetworkVMType, string>>,
  ) {
    try {
      const domainAccounts: DappPermissions['accounts'] = Object.fromEntries(
        Object.entries(addressMap).map(([vm, address]) => [
          address,
          vm as NetworkVMType,
        ]),
      );
      const currentPermissions = await this.getPermissions();
      const newPermissions: Permissions = SYNCED_DOMAINS.reduce(
        (perms, domain) => ({
          ...perms,
          [domain]: {
            domain,
            accounts: {
              ...perms[domain]?.accounts,
              ...domainAccounts,
            },
          },
        }),
        currentPermissions,
      );
      this.permissions = newPermissions;

      await this.storageService.save<PermissionsState | undefined>(
        PERMISSION_STORAGE_KEY,
        { permissions: this.permissions },
      );
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
