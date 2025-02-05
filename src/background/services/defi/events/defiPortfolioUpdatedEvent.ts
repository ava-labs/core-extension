import { singleton } from 'tsyringe';
import { EventEmitter } from 'events';

import type {
  ExtensionConnectionEvent,
  ExtensionEventEmitter,
} from '@src/background/connections/models';

import { DefiServiceEvents } from '../models';
import type { DefiService } from '../DefiService';

@singleton()
export class DefiPortfolioUpdatedEvents implements ExtensionEventEmitter {
  private eventEmitter = new EventEmitter();
  constructor(private defiService: DefiService) {
    this.defiService.addListener(
      DefiServiceEvents.PortfolioUpdated,
      (value) => {
        this.eventEmitter.emit('update', {
          name: DefiServiceEvents.PortfolioUpdated,
          value,
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
