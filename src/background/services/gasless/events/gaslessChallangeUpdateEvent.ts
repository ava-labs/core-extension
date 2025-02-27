import {
  ExtensionConnectionEvent,
  ExtensionEventEmitter,
} from '@src/background/connections/models';
import { EventEmitter } from 'events';
import { singleton } from 'tsyringe';
import { GaslessEvents } from '../model';
import { GasStationService } from '../GasStationService';

@singleton()
export class GaslessChallangeUpdateEvent implements ExtensionEventEmitter {
  private eventEmitter = new EventEmitter();
  constructor(private gasStationService: GasStationService) {
    this.gasStationService.solutionHex.add((solutionHex) => {
      this.eventEmitter.emit('update', {
        name: GaslessEvents.CHALLENGE_UPDATE,
        value: { solutionHex },
      });
    });
    this.gasStationService.challengeHex.add((challengeHex) => {
      this.eventEmitter.emit('update', {
        name: GaslessEvents.CHALLENGE_UPDATE,
        value: { challengeHex },
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
