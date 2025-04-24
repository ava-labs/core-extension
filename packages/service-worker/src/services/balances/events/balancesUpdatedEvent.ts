import {
  BalanceServiceEvents,
  BalancesInfo,
  ExtensionConnectionEvent,
  ExtensionEventEmitter,
} from '@core/types';
import { EventEmitter } from 'events';
import { singleton } from 'tsyringe';
import { BalanceAggregatorService } from '../BalanceAggregatorService';

@singleton()
export class BalancesUpdatedEvents implements ExtensionEventEmitter {
  private eventEmitter = new EventEmitter();
  constructor(private networkBalancesAggregator: BalanceAggregatorService) {
    this.networkBalancesAggregator.addListener(
      BalanceServiceEvents.UPDATED,
      (balancesData: BalancesInfo) => {
        this.eventEmitter.emit('update', {
          name: BalanceServiceEvents.UPDATED,
          value: balancesData,
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
