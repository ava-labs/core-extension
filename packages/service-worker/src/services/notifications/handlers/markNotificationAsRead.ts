import { ExtensionRequest, ExtensionRequestHandler } from '@core/types';
import { injectable } from 'tsyringe';
import { NotificationCenterService } from '../NotificationCenterService';
import { NotificationsService } from '../NotificationsService';

type HandlerType = ExtensionRequestHandler<
  ExtensionRequest.NOTIFICATION_CENTER_MARK_AS_READ,
  boolean,
  string
>;

@injectable()
export class MarkNotificationAsRead implements HandlerType {
  method = ExtensionRequest.NOTIFICATION_CENTER_MARK_AS_READ as const;

  constructor(
    private notificationCenterService: NotificationCenterService,
    private notificationsService: NotificationsService,
  ) {}

  handle: HandlerType['handle'] = async ({ request }) => {
    try {
      const notificationId = request.params;
      await this.notificationCenterService.markAsRead(notificationId);
      this.notificationsService.notifyNotificationCenterChanged();
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
