import { EventEmitter } from 'events';
import { singleton } from 'tsyringe';
import {
  ExtensionConnectionEvent,
  ExtensionEventEmitter,
  GaslessEvents,
} from '@core/types';
import { GasStationService } from '../GasStationService';

@singleton()
export class GaslessChallangeUpdateEvent implements ExtensionEventEmitter {
  private eventEmitter = new EventEmitter();
  constructor(private gasStationService: GasStationService) {
    this.gasStationService.gaslessState.add((state) => {
      this.eventEmitter.emit('update', {
        name: GaslessEvents.STATE_UPDATE,
        value: { ...state },
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
