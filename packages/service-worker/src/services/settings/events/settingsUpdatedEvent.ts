import {
  ConnectionInfo,
  DAppEventEmitter,
  ExtensionConnectionEvent,
  SettingsEvents,
  Web3Event,
} from '@core/types';
import { isSyncDomain } from '@core/common';
import { EventEmitter } from 'events';
import { SettingsService } from '../SettingsService';
import { injectable } from 'tsyringe';

@injectable()
export class SettingsUpdatedEvents implements DAppEventEmitter {
  private eventEmitter = new EventEmitter();
  private _connectionInfo?: ConnectionInfo;

  setConnectionInfo(connectionInfo: ConnectionInfo) {
    this._connectionInfo = connectionInfo;
  }

  constructor(private settingsService: SettingsService) {
    this.settingsService.addListener(
      SettingsEvents.SETTINGS_UPDATED,
      (settings) => {
        // Emit extension event (for extension UI)
        this.eventEmitter.emit('update', {
          name: SettingsEvents.SETTINGS_UPDATED,
          value: settings,
        });

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
