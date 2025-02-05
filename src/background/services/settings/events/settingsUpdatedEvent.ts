import { SettingsEvents } from '../models';
import type {
  ExtensionConnectionEvent,
  ExtensionEventEmitter,
} from '@src/background/connections/models';
import { EventEmitter } from 'events';
import type { SettingsService } from '../SettingsService';
import { singleton } from 'tsyringe';

@singleton()
export class SettingsUpdatedEvents implements ExtensionEventEmitter {
  private eventEmitter = new EventEmitter();
  constructor(private settingsService: SettingsService) {
    this.settingsService.addListener(
      SettingsEvents.SETTINGS_UPDATED,
      (settings) => {
        this.eventEmitter.emit('update', {
          name: SettingsEvents.SETTINGS_UPDATED,
          value: settings,
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
