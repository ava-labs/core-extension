import { ExtensionRequest } from '@src/background/connections/extensionConnection/models';
import { ExtensionRequestHandler } from '@src/background/connections/models';
import { injectable } from 'tsyringe';
import { NotificationTypes } from '../models';
import { NotificationsService } from '../NotificationsService';

type HandlerType = ExtensionRequestHandler<
  ExtensionRequest.NOTIFICATION_UNSUBSCRIBE,
  boolean,
  NotificationTypes
>;

@injectable()
export class UnsubscribeFromNotification implements HandlerType {
  method = ExtensionRequest.NOTIFICATION_UNSUBSCRIBE as const;

  constructor(private notificationsService: NotificationsService) {}

  handle: HandlerType['handle'] = async ({ request }) => {
    const notificationType = request.params;
    try {
      await this.notificationsService.unsubscribe(notificationType);
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
