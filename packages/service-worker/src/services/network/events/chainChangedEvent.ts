import {
  ConnectionInfo,
  DAppEventEmitter,
  ExtensionConnectionEvent,
  Web3Event,
} from '@core/types';
import { caipToChainId, getSyncDomain } from '@core/common';
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
    this.networkService.dappScopeChanged.add(({ domain, scope }) => {
      if (!this._connectionInfo?.domain) {
        return;
      }

      // Changes triggered by Core suite will contain the extension's ID as the `domain`.

      const normalizedConnectionDomain = getSyncDomain(
        this._connectionInfo?.domain,
      );

      if (normalizedConnectionDomain !== domain) {
        // Do not emit events to other dApps
        return;
      }

      const chainId = caipToChainId(scope);

      this.eventEmitter.emit('update', {
        method: Web3Event.CHAIN_CHANGED,
        params: {
          chainId: `0x${chainId.toString(16)}`,
          networkVersion: `${chainId}`,
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
