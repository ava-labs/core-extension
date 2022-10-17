import {
  ConnectionInfo,
  DAppEventEmitter,
  ExtensionConnectionEvent,
} from '@src/background/connections/models';
import { EventEmitter } from 'events';
import { AccountsService } from '../../accounts/AccountsService';
import { Web3Event } from '@src/background/connections/dAppConnection/models';
import { injectable } from 'tsyringe';
import { PermissionsService } from '../../permissions/PermissionsService';
import { LockService } from '../LockService';
import { LockEvents } from '../models';

@injectable()
export class LockStateChangedEvents implements DAppEventEmitter {
  private eventEmitter = new EventEmitter();
  private _connectionInfo?: ConnectionInfo;

  setConnectionInfo(connectionInfo: ConnectionInfo) {
    this._connectionInfo = connectionInfo;
  }

  constructor(
    private accountsService: AccountsService,
    private permissionsService: PermissionsService,
    private lockService: LockService
  ) {
    this.lockService.addListener(LockEvents.LOCK_STATE_CHANGED, (data) => {
      if (data.isUnlocked) {
        this.onUnlock();
      } else {
        this.onLock();
      }
    });
  }

  onLock() {
    this.eventEmitter.emit('update', {
      method: Web3Event.UNLOCK_STATE_CHANGED,
      params: { accounts: [], isUnlocked: false },
    });
  }

  async onUnlock() {
    const currentAddress = this.accountsService.activeAccount?.addressC;
    const connectionHasPermissions =
      this._connectionInfo &&
      currentAddress &&
      (await this.permissionsService.hasDomainPermissionForAccount(
        this._connectionInfo.domain,
        currentAddress
      ));

    this.eventEmitter.emit('update', {
      method: Web3Event.UNLOCK_STATE_CHANGED,
      params: {
        accounts: connectionHasPermissions
          ? [this.accountsService.activeAccount?.addressC]
          : [],
        isUnlocked: true,
      },
    });
  }

  addListener(handler: (event: ExtensionConnectionEvent) => void): void {
    this.eventEmitter.on('update', handler);
  }

  removeListener(
    handler: (event: ExtensionConnectionEvent<any>) => void
  ): void {
    this.eventEmitter.off('update', handler);
  }
}
