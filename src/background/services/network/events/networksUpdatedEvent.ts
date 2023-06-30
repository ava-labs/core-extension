import { Network } from '@avalabs/chains-sdk';
import {
  ExtensionConnectionEvent,
  ExtensionEventEmitter,
  ConnectionInfo,
} from '@src/background/connections/models';
import { EventEmitter } from 'events';
import { injectable } from 'tsyringe';
import { NetworkEvents } from '../models';
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
          networks: Object.values<Network>(networks).sort((a, b) =>
            a.chainName.localeCompare(b.chainName)
          ),
          activeNetwork: this.networkService.activeNetwork,
          favoriteNetworks,
          customNetworks: this.networkService.customNetworks,
        },
      });
    });
  }

  addListener(handler: (event: ExtensionConnectionEvent) => void): void {
    this.eventEmitter.on('update', handler);
  }

  removeListener(
    handler: (event: ExtensionConnectionEvent<any>) => void
  ): void {
    this.eventEmitter.off('update', handler);
  }
}
