import {
  ConnectionInfo,
  DAppEventEmitter,
  ExtensionConnectionEvent,
  NotificationsEvents,
  Web3Event,
} from '@core/types';
import { isSyncDomain } from '@core/common';
import { EventEmitter } from 'events';
import { injectable } from 'tsyringe';
import { runtime } from 'webextension-polyfill';
import { NotificationsService } from '../NotificationsService';

/**
 * One emitter for both contexts: `ExtensionConnectionController` and `DAppConnectionController`
 * both subscribe `DAppEventEmitter` instances to their port.
 *
 * - Extension UI (`domain === runtime.id`): `{ name, value }` for ConnectionProvider `events()`.
 * - Core Web (other sync hosts): Web3 `{ method: notificationCenterChanged, params: {} }` like `accountNameChanged`.
 */
@injectable()
export class NotificationCenterChangedEvents implements DAppEventEmitter {
  private eventEmitter = new EventEmitter();
  private _connectionInfo?: ConnectionInfo;

  setConnectionInfo(connectionInfo: ConnectionInfo) {
    this._connectionInfo = connectionInfo;
  }

  private onNotificationCenterChanged = () => {
    const domain = this._connectionInfo?.domain;
    if (!domain) {
      return;
    }
    if (domain === runtime.id) {
      this.eventEmitter.emit('update', {
        name: NotificationsEvents.NOTIFICATION_CENTER_CHANGED_EVENT,
        value: undefined,
      });
      return;
    }
    if (isSyncDomain(domain)) {
      this.eventEmitter.emit('update', {
        method: Web3Event.NOTIFICATION_CENTER_CHANGED_EVENT,
        params: {},
      });
    }
  };

  constructor(private notificationsService: NotificationsService) {
    this.notificationsService.addListener(
      NotificationsEvents.NOTIFICATION_CENTER_CHANGED_EVENT,
      this.onNotificationCenterChanged,
    );
  }

  addListener(handler: (event: ExtensionConnectionEvent) => void): void {
    this.eventEmitter.on('update', handler);
  }

  removeListener(
    handler: (event: ExtensionConnectionEvent<any>) => void,
  ): void {
    this.eventEmitter.off('update', handler);
    this.notificationsService.removeListener(
      NotificationsEvents.NOTIFICATION_CENTER_CHANGED_EVENT,
      this.onNotificationCenterChanged,
    );
  }
}
