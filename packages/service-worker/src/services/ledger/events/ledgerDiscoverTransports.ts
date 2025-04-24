import {
  ExtensionConnectionEvent,
  ExtensionEventEmitter,
	LedgerEvent
} from '@core/types';
import { EventEmitter } from 'events';
import { singleton } from 'tsyringe';
import { LedgerService } from '../LedgerService';

@singleton()
export class LedgerDiscoverTransportsEvents implements ExtensionEventEmitter {
  private eventEmitter = new EventEmitter();
  constructor(private ledgerService: LedgerService) {
    this.ledgerService.addListener(LedgerEvent.DISCOVER_TRANSPORTS, () => {
      this.eventEmitter.emit('update', {
        name: LedgerEvent.DISCOVER_TRANSPORTS,
        value: {},
      });
    });
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
