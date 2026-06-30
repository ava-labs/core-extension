import { ExtensionRequest, ExtensionRequestHandler } from '@core/types';
import { injectable } from 'tsyringe';
import { RecurringSwapNotificationService } from '../RecurringSwapNotificationService';

type HandlerType = ExtensionRequestHandler<
  ExtensionRequest.NOTIFICATION_DISCOVER_RECURRING_SWAPS,
  boolean
>;

@injectable()
export class DiscoverRecurringSwaps implements HandlerType {
  method = ExtensionRequest.NOTIFICATION_DISCOVER_RECURRING_SWAPS as const;

  constructor(
    private recurringSwapNotificationService: RecurringSwapNotificationService,
  ) {}

  handle: HandlerType['handle'] = async ({ request }) => {
    try {
      await this.recurringSwapNotificationService.requestDiscovery();

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
