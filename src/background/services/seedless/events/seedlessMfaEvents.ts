import { EventEmitter } from 'events';
import { singleton } from 'tsyringe';

import {
  ExtensionConnectionEvent,
  ExtensionEventEmitter,
} from '@src/background/connections/models';

import { SeedlessEvents } from '../models';
import { SeedlessMfaService } from '../SeedlessMfaService';

@singleton()
export class SeedlessMfaEvents implements ExtensionEventEmitter {
  private eventEmitter = new EventEmitter();
  constructor(private seedlessMfaService: SeedlessMfaService) {
    this.seedlessMfaService.addListener(SeedlessEvents.MfaRequest, (value) => {
      this.eventEmitter.emit('update', {
        name: SeedlessEvents.MfaRequest,
        value,
      });
    });
    this.seedlessMfaService.addListener(SeedlessEvents.MfaFailure, (value) => {
      this.eventEmitter.emit('update', {
        name: SeedlessEvents.MfaFailure,
        value,
      });
    });
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
