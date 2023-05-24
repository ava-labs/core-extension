import { Web3Event } from '@src/background/connections/dAppConnection/models';
import {
  ExtensionConnectionEvent,
  DAppEventEmitter,
  ConnectionInfo,
} from '@src/background/connections/models';
import { ChainChangedEventData } from '@src/background/providers/models';
import { EventEmitter } from 'events';
import { injectable } from 'tsyringe';
import { NetworkService } from '../NetworkService';

/**
 * Emits `chainChanged` events for each dApp according to EIP-1193
 * https://eips.ethereum.org/EIPS/eip-1193#chainchanged-1
 * For compatibility with legacy apps, also returns the deprecated networkVersion
 */
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
      const eventData: ChainChangedEventData = {
        chainId: `0x${chain.chainId.toString(16)}`,
        networkVersion: `${chain.chainId}`,
      };
      this.eventEmitter.emit('update', {
        method: Web3Event.CHAIN_CHANGED,
        params: eventData,
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
