import { AnalyticsEvents } from '../models';
import {
  ExtensionConnectionEvent,
  ExtensionEventEmitter,
} from '@src/background/connections/models';
import { EventEmitter } from 'events';
import { AnalyticsService } from '../AnalyticsService';
import { singleton } from 'tsyringe';

@singleton()
export class AnalyticsUpdatedEvents implements ExtensionEventEmitter {
  private eventEmitter = new EventEmitter();
  constructor(private analyticsService: AnalyticsService) {
    this.analyticsService.addListener(
      AnalyticsEvents.ANALYTICS_STATE_UPDATED,
      (contacts) => {
        this.eventEmitter.emit('update', {
          name: AnalyticsEvents.ANALYTICS_STATE_UPDATED,
          value: contacts,
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
