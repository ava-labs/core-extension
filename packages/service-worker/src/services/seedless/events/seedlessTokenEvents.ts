import { EventEmitter } from 'events';
import { singleton } from 'tsyringe';

import {
  ExtensionConnectionEvent,
  ExtensionEventEmitter,
} from '../../../connections/models';

import { SeedlessEvents } from '@core/types/src/models';
import { SeedlessSessionManager } from '../SeedlessSessionManager';

@singleton()
export class SeedlessTokenEvents implements ExtensionEventEmitter {
  private eventEmitter = new EventEmitter();
  constructor(private sessionManager: SeedlessSessionManager) {
    this.sessionManager.addListener(SeedlessEvents.TokenExpired, () => {
      this.eventEmitter.emit('update', {
        name: SeedlessEvents.TokenExpired,
      });
    });

    this.sessionManager.addListener(SeedlessEvents.TokenRefreshed, () => {
      this.eventEmitter.emit('update', {
        name: SeedlessEvents.TokenRefreshed,
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
