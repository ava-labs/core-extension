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
    this.networkService.developerModeChanges.add(async () => {
      const networks = await this.networkService.activeNetworks.promisify();
      const activeNetwork = await this.networkService.activeNetwork.promisify();
      this.eventEmitter.emit('update', {
        name: NetworkEvents.NETWORKS_UPDATED_EVENT,
        value: {
          networks: Object.values<Network>(networks),
          isDeveloperMode: this.networkService.isDeveloperMode,
          activeNetwork,
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
