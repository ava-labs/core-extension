import { BridgeEvents } from '@core/types/src/models';
import {
  ExtensionConnectionEvent,
  ExtensionEventEmitter,
} from '../../../connections/models';
import { EventEmitter } from 'events';
import { BridgeService } from '../BridgeService';
import { singleton } from 'tsyringe';

@singleton()
export class BridgeTransferEvents implements ExtensionEventEmitter {
  private eventEmitter = new EventEmitter();
  constructor(private bridgeService: BridgeService) {
    this.bridgeService.addListener(
      BridgeEvents.BRIDGE_TRANSFER_EVENT,
      (status) => {
        this.eventEmitter.emit('update', {
          name: BridgeEvents.BRIDGE_TRANSFER_EVENT,
          value: status,
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
