import {
  BackendNotification,
  NotificationListResponseSchema,
  NotificationsClientIdStorage,
  SuccessResponseSchema,
  transformNotification,
} from '@core/types';
import { Monitoring } from '@core/common';
import { singleton } from 'tsyringe';
import { StorageService } from '../storage/StorageService';
import { NOTIFICATIONS_CLIENT_ID_STORAGE_KEY } from './constants';
import { sendRequest } from './utils/sendRequest';

@singleton()
export class NotificationCenterService {
  constructor(private storageService: StorageService) {}

  async #getDeviceArn(): Promise<string> {
    const stored =
      await this.storageService.loadUnencrypted<NotificationsClientIdStorage>(
        NOTIFICATIONS_CLIENT_ID_STORAGE_KEY,
      );

    const deviceArn = stored?.clientId;

    if (!deviceArn) {
      throw new Error('Device ARN not available');
    }

    return deviceArn;
  }

  async getNotifications(): Promise<BackendNotification[]> {
    try {
      const deviceArn = await this.#getDeviceArn();

      const result = await sendRequest<unknown>({
        path: 'v1/push/notification-center/list',
        clientId: deviceArn,
        payload: {},
        includeAppType: false,
      });

      const parsed = NotificationListResponseSchema.safeParse(result);

      if (!parsed.success) {
        Monitoring.sentryCaptureException(
          new Error(
            `Notification center response validation failed: ${parsed.error.message}`,
          ),
          Monitoring.SentryExceptionTypes.NOTIFICATIONS,
        );
        return [];
      }

      return parsed.data.notifications
        .map(transformNotification)
        .filter((n) => n.data !== undefined);
    } catch (err) {
      console.error('NotificationCenterService.getNotifications error:', err);
      Monitoring.sentryCaptureException(
        err instanceof Error ? err : new Error(String(err)),
        Monitoring.SentryExceptionTypes.NOTIFICATIONS,
      );
      return [];
    }
  }

  async markAsRead(notificationId: string): Promise<void> {
    const deviceArn = await this.#getDeviceArn();

    const result = await sendRequest<unknown>({
      path: 'v1/push/notification-center/mark-as-read',
      clientId: deviceArn,
      payload: { notificationId },
      includeAppType: false,
    });

    const parsed = SuccessResponseSchema.safeParse(result);
    if (!parsed.success) {
      throw new Error('Unexpected response from mark-as-read');
    }
  }

  async markAllAsRead(): Promise<void> {
    const deviceArn = await this.#getDeviceArn();

    const result = await sendRequest<unknown>({
      path: 'v1/push/notification-center/mark-all-as-read',
      clientId: deviceArn,
      payload: {},
      includeAppType: false,
    });

    const parsed = SuccessResponseSchema.safeParse(result);
    if (!parsed.success) {
      throw new Error('Unexpected response from mark-all-as-read');
    }
  }
}
