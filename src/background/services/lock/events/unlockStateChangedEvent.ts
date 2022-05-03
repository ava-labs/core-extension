import {
  DAppEventEmitter,
  ExtensionConnectionEvent,
} from '@src/background/connections/models';
import { EventEmitter } from 'events';
import { LockEvents } from '../models';
import { LockService } from '../LockService';
import { AccountsService } from '../../accounts/AccountsService';
import { Web3Event } from '@src/background/connections/dAppConnection/models';
import { injectable } from 'tsyringe';

@injectable()
export class LockStateChangedEvents implements DAppEventEmitter {
  private eventEmitter = new EventEmitter();
  private _domain?: string;

  setDomain(domain: string) {
    this._domain = domain;
  }

  constructor(
    private lockService: LockService,
    private accountsService: AccountsService
  ) {
    this.lockService.addListener(LockEvents.LOCKED, () => {
      this.eventEmitter.emit('update', {
        method: Web3Event.UNLOCK_STATE_CHANGED,
        params: [],
      });
    });

    this.lockService.addListener(LockEvents.UNLOCKED, () => {
      this.eventEmitter.emit('update', {
        method: Web3Event.UNLOCK_STATE_CHANGED,
        params: [this.accountsService.activeAccount?.addressC],
      });
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
