import {
  BackendNotification,
  ExtensionRequest,
  ExtensionRequestHandler,
} from '@core/types';
import { injectable } from 'tsyringe';
import { NotificationCenterService } from '../NotificationCenterService';

type HandlerType = ExtensionRequestHandler<
  ExtensionRequest.NOTIFICATION_CENTER_GET_LIST,
  BackendNotification[]
>;

@injectable()
export class GetNotificationCenterList implements HandlerType {
  method = ExtensionRequest.NOTIFICATION_CENTER_GET_LIST as const;

  constructor(private notificationCenterService: NotificationCenterService) {}

  handle: HandlerType['handle'] = async ({ request }) => {
    try {
      const notifications =
        await this.notificationCenterService.getNotifications();
      return {
        ...request,
        result: notifications,
      };
    } catch (err) {
      console.error('NotificationCenter handler error:', err);
      return {
        ...request,
        error: (err as Error).toString(),
      };
    }
  };
}
