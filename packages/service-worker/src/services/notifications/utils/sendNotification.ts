import { MessagePayload } from 'firebase/messaging/sw';
import { NotificationCategories, NotificationTypes } from '@core/types';
import { NOTIFICATION_PAYLOAD_SCHEMA } from '../constants';

type Params = {
  payload: MessagePayload;
  allowedType: NotificationCategories;
  allowedEvents?: NotificationTypes[];
};

export const sendNotification = ({
  payload,
  allowedType,
  allowedEvents,
}: Params) => {
  const { error: payloadError, value: notificationPayload } =
    NOTIFICATION_PAYLOAD_SCHEMA.validate(payload);

  if (payloadError) {
    throw new Error(`Invalid payload: ${payloadError.message}`);
  }

  if (allowedType !== notificationPayload.data.type) {
    return;
  }

  if (
    allowedEvents &&
    !allowedEvents.includes(notificationPayload.data.event)
  ) {
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
