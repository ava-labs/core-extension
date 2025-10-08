import {
  ConnectionInfo,
  DAppEventEmitter,
  ExtensionConnectionEvent,
  SettingsEvents,
  Web3Event,
} from '@core/types';
import { isSyncDomain } from '@core/common';
import { EventEmitter } from 'events';
import { injectable } from 'tsyringe';
import { NetworkService } from '../NetworkService';
import { SettingsService } from '~/services/settings/SettingsService';
import { getNetworkStateWithTokenvisibility } from '../utils/getNetworkStateWithTokenvisibility';

@injectable()
export class NetworkStateChangedEvents implements DAppEventEmitter {
  private eventEmitter = new EventEmitter();
  private _connectionInfo?: ConnectionInfo;

  setConnectionInfo(connectionInfo: ConnectionInfo) {
    this._connectionInfo = connectionInfo;
  }

  #sendUpdateEvent = async () => {
    if (
      !this._connectionInfo?.domain ||
      !isSyncDomain(this._connectionInfo?.domain)
    ) {
      return;
    }

    try {
      const networkState = await getNetworkStateWithTokenvisibility(
        this.networkService,
        this.settingsService,
      );

      this.eventEmitter.emit('update', {
        method: Web3Event.CHAIN_CHANGED,
        params: { networks: networkState },
      });
    } catch (error) {
      console.error(error);
    }
  };

  constructor(
    private networkService: NetworkService,
    private settingsService: SettingsService,
  ) {
    this.settingsService.addListener(
      SettingsEvents.SETTINGS_UPDATED,
      this.#sendUpdateEvent,
    );
    this.networkService.favoriteNetworksUpdated.add(this.#sendUpdateEvent);
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
