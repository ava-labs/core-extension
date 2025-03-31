import { ExtensionRequest } from '@src/background/connections/extensionConnection/models';
import { ExtensionRequestHandler } from '@src/background/connections/models';
import { injectable } from 'tsyringe';
import { BalanceNotificationService } from '../BalanceNotificationService';

type HandlerType = ExtensionRequestHandler<
  ExtensionRequest.BALANCE_NOTIFICATION_SUBSCRIBE,
  boolean,
  []
>;

@injectable()
export class SubscribeToBalanceNotifications implements HandlerType {
  method = ExtensionRequest.BALANCE_NOTIFICATION_SUBSCRIBE as const;

  constructor(private balanceNotificationService: BalanceNotificationService) {}

  handle: HandlerType['handle'] = async ({ request }) => {
    try {
      await this.balanceNotificationService.subscribe();
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
