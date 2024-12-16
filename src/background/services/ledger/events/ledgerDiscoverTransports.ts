import {
  ExtensionConnectionEvent,
  ExtensionEventEmitter,
} from '@src/background/connections/models';
import { EventEmitter } from 'events';
import { singleton } from 'tsyringe';
import { LedgerService } from '../LedgerService';
import { LedgerEvent } from '../models';

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
