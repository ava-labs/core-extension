import {
  BridgeEvents,
  ExtensionConnectionEvent,
  ExtensionEventEmitter,
} from '@core/types';
import { EventEmitter } from 'events';
import { BridgeService } from '../BridgeService';
import { singleton } from 'tsyringe';

@singleton()
export class BridgeStateUpdateEvents implements ExtensionEventEmitter {
  private eventEmitter = new EventEmitter();
  constructor(private bridgeService: BridgeService) {
    this.bridgeService.addListener(
      BridgeEvents.BRIDGE_STATE_UPDATE_EVENT,
      (value) => {
        this.eventEmitter.emit('update', {
          name: BridgeEvents.BRIDGE_STATE_UPDATE_EVENT,
          value: value,
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
