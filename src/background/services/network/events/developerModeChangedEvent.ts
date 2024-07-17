import {
  ExtensionConnectionEvent,
  ExtensionEventEmitter,
} from '@src/background/connections/models';
import { EventEmitter } from 'events';
import { singleton } from 'tsyringe';
import { NetworkEvents } from '../models';
import { NetworkService } from '../NetworkService';

@singleton()
export class DeveloperModeChangedEvents implements ExtensionEventEmitter {
  private eventEmitter = new EventEmitter();
  constructor(private networkService: NetworkService) {
    this.networkService.developerModeChanged.add((enabled) => {
      this.eventEmitter.emit('update', {
        name: NetworkEvents.DEVELOPER_MODE_CHANGED,
        value: Boolean(enabled),
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
