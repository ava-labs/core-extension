import { ExtensionRequest } from '@src/background/connections/extensionConnection/models';
import { ExtensionRequestHandler } from '@src/background/connections/models';
import { injectable } from 'tsyringe';
import { NotificationTypes } from '../models';
import { BalanceNotificationService } from '../BalanceNotificationService';
import { NewsNotificationService } from '../NewsNotificationService';
type HandlerType = ExtensionRequestHandler<
  ExtensionRequest.NOTIFICATION_GET_SUBSCRIPTIONS,
  Record<NotificationTypes, boolean>,
  []
>;

@injectable()
export class GetNotificationSubscriptions implements HandlerType {
  method = ExtensionRequest.NOTIFICATION_GET_SUBSCRIPTIONS as const;

  constructor(
    private balanceNotificationService: BalanceNotificationService,
    private newsNotificationService: NewsNotificationService,
  ) {}

  handle: HandlerType['handle'] = async ({ request }) => {
    try {
      const [balanceSubscription, newsSubscriptions] = await Promise.all([
        this.balanceNotificationService.getSubscriptions(),
        this.newsNotificationService.getSubscriptions(),
      ]);

      const subscriptions = {
        ...balanceSubscription,
        ...newsSubscriptions,
      };

      return {
        ...request,
        result: subscriptions,
      };
    } catch (err) {
      return {
        ...request,
        error: (err as any).toString(),
      };
    }
  };
}
