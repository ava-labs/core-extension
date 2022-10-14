import {
  ConnectionInfo,
  DAppEventEmitter,
  ExtensionConnectionEvent,
} from '@src/background/connections/models';
import { EventEmitter } from 'events';
import { AccountsService } from '../../accounts/AccountsService';
import { Web3Event } from '@src/background/connections/dAppConnection/models';
import { singleton } from 'tsyringe';
import { OnLock, OnUnlock } from '@src/background/runtime/lifecycleCallbacks';

@singleton()
export class LockStateChangedEvents
  implements DAppEventEmitter, OnLock, OnUnlock
{
  private eventEmitter = new EventEmitter();
  private _connectionInfo?: ConnectionInfo;

  setConnectionInfo(connectionInfo: ConnectionInfo) {
    this._connectionInfo = connectionInfo;
  }

  constructor(private accountsService: AccountsService) {}

  onLock() {
    this.eventEmitter.emit('update', {
      method: Web3Event.UNLOCK_STATE_CHANGED,
      params: { accounts: [], isUnlocked: false },
    });
  }

  onUnlock() {
    this.eventEmitter.emit('update', {
      method: Web3Event.UNLOCK_STATE_CHANGED,
      params: {
        accounts: this.accountsService.activeAccount?.addressC,
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
