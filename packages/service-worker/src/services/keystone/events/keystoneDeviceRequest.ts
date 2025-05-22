import {
  ExtensionConnectionEvent,
  ExtensionEventEmitter,
  KeystoneEvent,
} from '@core/types';
import { EventEmitter } from 'events';
import { singleton } from 'tsyringe';
import { KeystoneService } from '../KeystoneService';

@singleton()
export class KeystoneRequestEvents implements ExtensionEventEmitter {
  private eventEmitter = new EventEmitter();
  constructor(private keystoneService: KeystoneService) {
    this.keystoneService.addListener(KeystoneEvent.DEVICE_REQUEST, (data) => {
      this.eventEmitter.emit('update', {
        name: KeystoneEvent.DEVICE_REQUEST,
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
