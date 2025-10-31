import { Network } from '@avalabs/core-chains-sdk';
import {
  ConnectionInfo,
  ExtensionConnectionEvent,
  ExtensionEventEmitter,
  NetworkEvents,
} from '@core/types';
import EventEmitter from 'events';
import { injectable } from 'tsyringe';
import { NetworkService } from '../NetworkService';

@injectable()
export class NetworksUpdatedEvents implements ExtensionEventEmitter {
  private eventEmitter = new EventEmitter();
  private _connectionInfo?: ConnectionInfo;

  setConnectionInfo(connectionInfo: ConnectionInfo) {
    this._connectionInfo = connectionInfo;
  }

  constructor(private networkService: NetworkService) {
    this.networkService.activeNetworks.add(async (networksPromise) => {
      const networks = await networksPromise;
      const favoriteNetworks = await this.networkService.getFavoriteNetworks();

      this.eventEmitter.emit('update', {
        name: NetworkEvents.NETWORKS_UPDATED_EVENT,
        value: {
          activeNetwork: this.networkService.uiActiveNetwork,
          networks: Object.values<Network>(networks).sort((a, b) =>
            a.chainName.localeCompare(b.chainName),
          ),
          favoriteNetworks,
          customNetworks: this.networkService.customNetworks,
          enabledNetworks: await this.networkService.getEnabledNetworks(),
        },
      });
    });
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
