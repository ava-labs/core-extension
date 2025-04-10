import {
  ExtensionConnectionEvent,
  ExtensionEventEmitter,
} from '../../../connections/models';
import { AccountsEvents } from '../models';
import { EventEmitter } from 'events';
import { AccountsService } from '../AccountsService';
import { singleton } from 'tsyringe';

@singleton()
export class AccountsUpdatedEvents implements ExtensionEventEmitter {
  private eventEmitter = new EventEmitter();
  constructor(private accountsService: AccountsService) {
    this.accountsService.addListener(
      AccountsEvents.ACCOUNTS_UPDATED,
      (accounts) => {
        this.eventEmitter.emit('update', {
          name: AccountsEvents.ACCOUNTS_UPDATED,
          value: accounts,
        });
      },
    );
  }

  addListener(handler: (event: ExtensionConnectionEvent) => void): void {
    this.eventEmitter.on('update', handler);
  }

  removeListener(
    handler: (event: ExtensionConnectionEvent<any>) => void,
  ): void {
    this.eventEmitter.off('update', handler);
  }
}
