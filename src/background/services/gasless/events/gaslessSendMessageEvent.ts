import {
  ExtensionConnectionEvent,
  ExtensionEventEmitter,
} from '@src/background/connections/models';
import { EventEmitter } from 'events';
import { singleton } from 'tsyringe';
import { GaslessEvents } from '../model';
import { GasStationService } from '../GasStationService';

@singleton()
export class GaslessSendMessageEvent implements ExtensionEventEmitter {
  private eventEmitter = new EventEmitter();
  constructor(private gasStationService: GasStationService) {
    this.gasStationService.addListener(
      GaslessEvents.SEND_MESSAGE,
      (message) => {
        this.eventEmitter.emit('update', {
          name: GaslessEvents.SEND_MESSAGE,
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
