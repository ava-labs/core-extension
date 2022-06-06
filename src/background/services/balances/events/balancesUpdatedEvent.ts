import {
  ExtensionConnectionEvent,
  ExtensionEventEmitter,
} from '@src/background/connections/models';
import { EventEmitter } from 'events';
import { singleton } from 'tsyringe';
import { BalanceServiceEvents } from '../models';
import { NetworkBalanceAggregatorService } from '../NetworkBalanceAggregatorService';

@singleton()
export class BalancesUpdatedEvents implements ExtensionEventEmitter {
  private eventEmitter = new EventEmitter();
  constructor(
    private networkBalancesAggregator: NetworkBalanceAggregatorService
  ) {
    this.networkBalancesAggregator.balanceUpdates.add((balances) => {
      this.eventEmitter.emit('update', {
        name: BalanceServiceEvents.UPDATED,
        value: balances,
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
