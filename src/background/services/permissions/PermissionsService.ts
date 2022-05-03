import { EventEmitter } from 'events';
import { singleton } from 'tsyringe';
import { LockService } from '../lock/LockService';
import { LockEvents } from '../lock/models';
import { StorageService } from '../storage/StorageService';
import {
  DappPermissions,
  PermissionEvents,
  Permissions,
  PERMISSION_STORAGE_KEY,
} from './models';

@singleton()
export class PermissionsService {
  private eventEmitter = new EventEmitter();

  private permissions?: Permissions;

  constructor(
    private storageService: StorageService,
    private lockService: LockService
  ) {
    // Implement tsyringe Disposable interface once it's released
    this.lockService.addListener(LockEvents.LOCKED, () => {
      this.permissions = undefined;
    });
  }

  // use getter to cache permissions
  // they are needed for every dApp rpc request
  async getPermissions(): Promise<Permissions> {
    if (this.permissions) {
      return this.permissions;
    }
    try {
      this.permissions =
        (await this.storageService.load<Permissions>(PERMISSION_STORAGE_KEY)) ??
        {};
    } catch (e) {
      this.permissions = {};
    }

    this.eventEmitter.emit(
      PermissionEvents.PERMISSIONS_STATE_UPDATE,
      this.permissions
    );
    return this.permissions;
  }

  async getPermissionsForDomain(domain: string) {
    const permissions = await this.getPermissions();
    return permissions[domain];
  }

  async addPermission(dappPermissions: DappPermissions) {
    const currentPermissions = await this.getPermissions();
    this.permissions = {
      ...currentPermissions,
      [dappPermissions.domain]: dappPermissions,
    };
    this.storageService.save<Permissions>(
      PERMISSION_STORAGE_KEY,
      this.permissions
    );
    this.eventEmitter.emit(
      PermissionEvents.PERMISSIONS_STATE_UPDATE,
      this.permissions
    );
  }

  addListener(event: PermissionEvents, callback: (data: unknown) => void) {
    this.eventEmitter.addListener(event, callback);
  }

  removeListener(event: PermissionEvents, callback: (data: unknown) => void) {
    this.eventEmitter.removeListener(event, callback);
  }
}
