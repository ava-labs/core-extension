import {
  BridgeEvents,
  ExtensionConnectionEvent,
  ExtensionEventEmitter,
} from '@core/types';
import { EventEmitter } from 'events';
import { BridgeService } from '../BridgeService';
import { singleton } from 'tsyringe';

@singleton()
export class BridgeConfigUpdatedEvents implements ExtensionEventEmitter {
  private eventEmitter = new EventEmitter();
  constructor(private bridgeService: BridgeService) {
    this.bridgeService.addListener(
      BridgeEvents.BRIDGE_CONFIG_UPDATE_EVENT,
      (config) => {
        this.eventEmitter.emit('update', {
          name: BridgeEvents.BRIDGE_CONFIG_UPDATE_EVENT,
          value: config,
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
