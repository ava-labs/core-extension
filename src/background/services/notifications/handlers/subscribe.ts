import { ExtensionRequest } from '@src/background/connections/extensionConnection/models';
import { ExtensionRequestHandler } from '@src/background/connections/models';
import { injectable } from 'tsyringe';
import {
  NewsNotificationTypes,
  NotificationCategories,
  NotificationTypes,
} from '../models';
import { BalanceNotificationService } from '../BalanceNotificationService';
import { NewsNotificationService } from '../NewsNotificationService';
import { getNotificationCategory } from '../utils/getNotificationCategory';

type HandlerType = ExtensionRequestHandler<
  ExtensionRequest.NOTIFICATION_SUBSCRIBE,
  boolean,
  NotificationTypes
>;

@injectable()
export class SubscribeToNotification implements HandlerType {
  method = ExtensionRequest.NOTIFICATION_SUBSCRIBE as const;

  constructor(
    private balanceNotificationService: BalanceNotificationService,
    private newsNotificationService: NewsNotificationService,
  ) {}

  handle: HandlerType['handle'] = async ({ request }) => {
    const notificationType = request.params;

    try {
      const category = getNotificationCategory(notificationType);

      switch (category) {
        case NotificationCategories.BALANCE_CHANGES:
          await this.balanceNotificationService.subscribe();
          break;
        case NotificationCategories.NEWS:
          await this.newsNotificationService.subscribe([
            notificationType as NewsNotificationTypes,
          ]);
          break;
      }

      return {
        ...request,
        result: true,
      };
    } catch (err) {
      return {
        ...request,
        error: (err as any).toString(),
      };
    }
  };
}
