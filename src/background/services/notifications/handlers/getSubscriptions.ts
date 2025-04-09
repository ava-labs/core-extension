import { ExtensionRequest } from '@src/background/connections/extensionConnection/models';
import { ExtensionRequestHandler } from '@src/background/connections/models';
import { injectable } from 'tsyringe';
import { NotificationTypes } from '../models';
import { NotificationsService } from '../NotificationsService';

type HandlerType = ExtensionRequestHandler<
  ExtensionRequest.NOTIFICATION_GET_SUBSCRIPTIONS,
  Record<NotificationTypes, boolean>,
  []
>;

@injectable()
export class GetNotificationSubscriptions implements HandlerType {
  method = ExtensionRequest.NOTIFICATION_GET_SUBSCRIPTIONS as const;

  constructor(private notificationsService: NotificationsService) {}

  handle: HandlerType['handle'] = async ({ request }) => {
    try {
      return {
        ...request,
        result: await this.notificationsService.getSubscriptions(),
      };
    } catch (err) {
      return {
        ...request,
        error: (err as any).toString(),
      };
    }
  };
}
