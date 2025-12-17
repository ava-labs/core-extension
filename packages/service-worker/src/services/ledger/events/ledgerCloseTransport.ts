import {
  ExtensionConnectionEvent,
  ExtensionEventEmitter,
  LedgerEvent,
} from '@core/types';
import { EventEmitter } from 'events';
import { singleton } from 'tsyringe';
import { LedgerService } from '../LedgerService';

@singleton()
export class LedgerCloseTransportEvent implements ExtensionEventEmitter {
  private eventEmitter = new EventEmitter();
  constructor(private ledgerService: LedgerService) {
    this.ledgerService.addListener(
      LedgerEvent.TRANSPORT_CLOSE_REQUEST,
      (data: unknown) => {
        if (typeof data !== 'string') {
          return;
        }
        this.eventEmitter.emit('update', {
          name: LedgerEvent.TRANSPORT_CLOSE_REQUEST,
          value: {
            currentTransportUUID: data,
          },
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
