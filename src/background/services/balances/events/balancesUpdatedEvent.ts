import {
  ExtensionConnectionEvent,
  ExtensionEventEmitter,
} from '@src/background/connections/models';
import { EventEmitter } from 'events';
import { singleton } from 'tsyringe';
import { BalanceServiceEvents, Balances } from '../models';
import { BalanceAggregatorService } from '../BalanceAggregatorService';
import { NftTokenWithBalance } from '@avalabs/vm-module-types';

export interface BalancesInfo {
  balances: {
    tokens: Balances;
    nfts: Balances<NftTokenWithBalance>;
  };
  isBalancesCached: boolean;
}
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
