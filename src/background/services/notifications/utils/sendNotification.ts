import { MessagePayload } from 'firebase/messaging';
import { NotificationTypes } from '../models';
import { NOTIFICATION_PAYLOAD_SCHEMA } from '../constants';

type Params = {
  payload: MessagePayload;
  allowedEvents: NotificationTypes[];
};

export const sendNotification = ({ payload, allowedEvents }: Params) => {
  const { error: payloadError, value: notificationPayload } =
    NOTIFICATION_PAYLOAD_SCHEMA.validate(payload);

  if (payloadError) {
    throw new Error(`Invalid payload: ${payloadError.message}`);
  }

  if (!allowedEvents.includes(notificationPayload.data.event)) {
    return;
  }

  chrome.notifications.create({
    type: 'basic',
    title: notificationPayload.data.title,
    message: notificationPayload.data.body,
    iconUrl: '../../../../images/icon-192.png',
    priority: 2,
  });
};
