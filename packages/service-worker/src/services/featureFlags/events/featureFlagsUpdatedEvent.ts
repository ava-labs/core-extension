import {
  ExtensionConnectionEvent,
  ExtensionEventEmitter,
  FeatureFlagEvents,
} from '@core/types';
import { EventEmitter } from 'events';
import { singleton } from 'tsyringe';
import { FeatureFlagService } from '../FeatureFlagService';

@singleton()
export class FeatureFlagsUpdatedEvent implements ExtensionEventEmitter {
  private eventEmitter = new EventEmitter();
  constructor(private featureFlagService: FeatureFlagService) {
    this.featureFlagService.addListener(
      FeatureFlagEvents.FEATURE_FLAG_UPDATED,
      (featureFlags) => {
        this.eventEmitter.emit('update', {
          name: FeatureFlagEvents.FEATURE_FLAG_UPDATED,
          value: featureFlags,
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
