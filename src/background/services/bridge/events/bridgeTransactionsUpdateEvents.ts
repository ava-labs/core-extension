import { BridgeEvents } from '../models';
import {
  ExtensionConnectionEvent,
  ExtensionEventEmitter,
} from '@src/background/connections/models';
import { EventEmitter } from 'events';
import { BridgeService } from '../BridgeService';
import { singleton } from 'tsyringe';

@singleton()
export class BridgeTransactionUpdatedEvents implements ExtensionEventEmitter {
  private eventEmitter = new EventEmitter();
  constructor(private bridgeService: BridgeService) {
    this.bridgeService.addListener(
      BridgeEvents.BRIDGE_TRANSACTIONS_UPDATED,
      (value) => {
        this.eventEmitter.emit('update', {
          name: BridgeEvents.BRIDGE_TRANSACTIONS_UPDATED,
          value: value,
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
