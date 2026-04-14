import {
  ConnectionInfo,
  DAppEventEmitter,
  ExtensionConnectionEvent,
  SettingsEvents,
  SubscriptionEvents,
  Web3Event,
} from '@core/types';
import { isSyncDomain } from '@core/common';
import { EventEmitter } from 'events';
import { SettingsService } from '../SettingsService';
import { injectable } from 'tsyringe';
import { BalanceNotificationService } from '../../notifications/BalanceNotificationService';
import { NewsNotificationService } from '../../notifications/NewsNotificationService';

@injectable()
export class SettingsUpdatedEventsCore implements DAppEventEmitter {
  private eventEmitter = new EventEmitter();
  private _connectionInfo?: ConnectionInfo;

  setConnectionInfo(connectionInfo: ConnectionInfo) {
    this._connectionInfo = connectionInfo;
  }

  constructor(
    private settingsService: SettingsService,
    private balanceNotificationService: BalanceNotificationService,
    private newsNotificationService: NewsNotificationService,
  ) {
    this.settingsService.addListener(
      SettingsEvents.SETTINGS_UPDATED,
      (settings) => {
        // Emit web3 event (for dApps) - only for Core Suite domains
        if (
          this._connectionInfo?.domain &&
          isSyncDomain(this._connectionInfo.domain)
        ) {
          this.eventEmitter.emit('update', {
            method: Web3Event.SETTINGS_CHANGED,
            params: settings,
          });
        }
      },
    );

    const emitSettingsChanged = (subscriptions: unknown) => {
      if (
        this._connectionInfo?.domain &&
        isSyncDomain(this._connectionInfo.domain)
      ) {
        this.eventEmitter.emit('update', {
          method: Web3Event.SETTINGS_CHANGED,
          params: { notificationSubscriptions: subscriptions },
        });
      }
    };

    this.balanceNotificationService.addListener(
      SubscriptionEvents.SUBSCRIPTIONS_CHANGED_EVENT,
      emitSettingsChanged,
    );

    this.newsNotificationService.addListener(
      SubscriptionEvents.SUBSCRIPTIONS_CHANGED_EVENT,
      emitSettingsChanged,
    );
  }

  addListener(handler: (event: ExtensionConnectionEvent) => void): void {
    this.eventEmitter.on('update', handler);
  }

  removeListener(
    handler: (event: ExtensionConnectionEvent<any>) => void,
  ): void {
    this.eventEmitter.off('update', handler);
  }
}
