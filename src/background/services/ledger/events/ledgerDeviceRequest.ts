import {
  ExtensionConnectionEvent,
  ExtensionEventEmitter,
} from '@src/background/connections/models';
import { EventEmitter } from 'events';
import { singleton } from 'tsyringe';
import { LedgerService } from '../LedgerService';
import { LedgerEvent } from '../models';
@singleton()
export class LedgerTransportRequestEvents implements ExtensionEventEmitter {
  private eventEmitter = new EventEmitter();
  constructor(private ledgerService: LedgerService) {
    this.ledgerService.addListener(LedgerEvent.TRANSPORT_REQUEST, (data) => {
      this.eventEmitter.emit('update', {
        name: LedgerEvent.TRANSPORT_REQUEST,
        value: data,
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
