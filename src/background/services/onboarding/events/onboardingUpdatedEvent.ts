import { OnboardingEvents } from '../models';
import type {
  ExtensionConnectionEvent,
  ExtensionEventEmitter,
} from '@src/background/connections/models';
import { EventEmitter } from 'events';
import type { OnboardingService } from '../OnboardingService';
import { singleton } from 'tsyringe';
@singleton()
export class OnboardingUpdatedEvents implements ExtensionEventEmitter {
  private eventEmitter = new EventEmitter();
  constructor(private onboardingService: OnboardingService) {
    this.onboardingService.addListener(
      OnboardingEvents.ONBOARDING_UPDATED_EVENT,
      (onboardingState) => {
        this.eventEmitter.emit('update', {
          name: OnboardingEvents.ONBOARDING_UPDATED_EVENT,
          value: onboardingState,
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
