import { ExtensionRequest, ExtensionRequestHandler } from '@core/types';
import { injectable } from 'tsyringe';
import { NotificationCenterService } from '../NotificationCenterService';

type HandlerType = ExtensionRequestHandler<
  ExtensionRequest.NOTIFICATION_CENTER_MARK_ALL_AS_READ,
  boolean
>;

@injectable()
export class MarkAllNotificationsAsRead implements HandlerType {
  method = ExtensionRequest.NOTIFICATION_CENTER_MARK_ALL_AS_READ as const;

  constructor(private notificationCenterService: NotificationCenterService) {}

  handle: HandlerType['handle'] = async ({ request }) => {
    try {
      await this.notificationCenterService.markAllAsRead();
      return {
        ...request,
        result: true,
      };
    } catch (err) {
      return {
        ...request,
        error: (err as Error).toString(),
      };
    }
  };
}
