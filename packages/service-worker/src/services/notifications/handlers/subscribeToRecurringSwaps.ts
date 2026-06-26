import { ExtensionRequest, ExtensionRequestHandler } from '@core/types';
import { injectable } from 'tsyringe';
import { RecurringSwapNotificationService } from '../RecurringSwapNotificationService';

type HandlerType = ExtensionRequestHandler<
  ExtensionRequest.NOTIFICATION_SUBSCRIBE_RECURRING_SWAPS,
  boolean,
  [orderIds: string[]]
>;

@injectable()
export class SubscribeToRecurringSwapNotifications implements HandlerType {
  method = ExtensionRequest.NOTIFICATION_SUBSCRIBE_RECURRING_SWAPS as const;

  constructor(
    private recurringSwapNotificationService: RecurringSwapNotificationService,
  ) {}

  handle: HandlerType['handle'] = async ({ request }) => {
    const [orderIds] = request.params;

    try {
      await this.recurringSwapNotificationService.subscribeToOrders(orderIds);

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
