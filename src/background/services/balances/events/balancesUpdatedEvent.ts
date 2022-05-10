import {
  ExtensionConnectionEvent,
  ExtensionEventEmitter,
} from '@src/background/connections/models';
import { BalanceServiceEvents } from '../models';
import { EventEmitter } from 'events';
import { BalancesService } from '../BalancesService';
import { singleton } from 'tsyringe';

@singleton()
export class BalancesUpdatedEvents implements ExtensionEventEmitter {
  private eventEmitter = new EventEmitter();
  constructor(private balancesService: BalancesService) {
    this.balancesService.addListener(
      BalanceServiceEvents.updated,
      (balances) => {
        this.eventEmitter.emit('update', {
          name: BalanceServiceEvents.updated,
          value: balances,
        });
      }
    );
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
