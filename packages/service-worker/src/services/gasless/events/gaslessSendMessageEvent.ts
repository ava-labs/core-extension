import {
  ExtensionConnectionEvent,
  ExtensionEventEmitter,
	GaslessEvents,
} from '@core/types';
import { EventEmitter } from 'events';
import { singleton } from 'tsyringe';
import { GasStationService } from '../GasStationService';

@singleton()
export class GaslessSendOffscreenMessageEvent implements ExtensionEventEmitter {
  private eventEmitter = new EventEmitter();
  constructor(private gasStationService: GasStationService) {
    this.gasStationService.addListener(
      GaslessEvents.SEND_OFFSCREEN_MESSAGE,
      (message) => {
        this.eventEmitter.emit('update', {
          name: GaslessEvents.SEND_OFFSCREEN_MESSAGE,
          value: message,
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
