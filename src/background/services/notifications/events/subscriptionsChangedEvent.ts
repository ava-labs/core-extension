import {
  ExtensionConnectionEvent,
  ExtensionEventEmitter,
} from '@src/background/connections/models';
import { EventEmitter } from 'events';
import { singleton } from 'tsyringe';
import { BalanceNotificationService } from '../BalanceNotificationService';
import { NewsNotificationService } from '../NewsNotificationService';
import { SubscriptionEvents } from '../models';

@singleton()
export class SubscriptionsChangedEvents implements ExtensionEventEmitter {
  private eventEmitter = new EventEmitter();

  constructor(
    private balanceNotificationService: BalanceNotificationService,
    private newsNotificationService: NewsNotificationService,
  ) {
    const addListener = (
      service: BalanceNotificationService | NewsNotificationService,
    ) => {
      service.addListener(
        SubscriptionEvents.SUBSCRIPTIONS_CHANGED_EVENT,
        (subscriptions) => {
          this.eventEmitter.emit('update', {
            name: SubscriptionEvents.SUBSCRIPTIONS_CHANGED_EVENT,
            value: subscriptions,
          });
        },
      );
    };

    addListener(this.balanceNotificationService);
    addListener(this.newsNotificationService);
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
