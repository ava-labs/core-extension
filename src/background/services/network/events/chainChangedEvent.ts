import { Web3Event } from '@src/background/connections/dAppConnection/models';
import {
  ExtensionConnectionEvent,
  DAppEventEmitter,
  ConnectionInfo,
} from '@src/background/connections/models';
import { EventEmitter } from 'events';
import { injectable } from 'tsyringe';
import { NetworkService } from '../NetworkService';

@injectable()
export class ChainChangedEvents implements DAppEventEmitter {
  private eventEmitter = new EventEmitter();
  private _connectionInfo?: ConnectionInfo;

  setConnectionInfo(connectionInfo: ConnectionInfo) {
    this._connectionInfo = connectionInfo;
  }

  constructor(private networkService: NetworkService) {
    this.networkService.activeNetworkChanged.add((chain) => {
      if (!chain) return;
      this.eventEmitter.emit('update', {
        method: Web3Event.CHAIN_CHANGED,
        params: {
          chainId: `0x${chain.chainId.toString(16)}`,
          networkVersion: `${chain.chainId}`,
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
