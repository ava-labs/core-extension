import { Web3Event } from '@src/background/connections/dAppConnection/models';
import {
  ExtensionConnectionEvent,
  DAppEventEmitter,
} from '@src/background/connections/models';
import { EventEmitter } from 'events';
import { injectable } from 'tsyringe';
import { ActiveNetwork, NetworkEvents } from '../models';
import { NetworkService } from '../NetworkService';

@injectable()
export class ChainChangedEvents implements DAppEventEmitter {
  private eventEmitter = new EventEmitter();
  private _domain?: string;

  setDomain(domain: string) {
    this._domain = domain;
  }

  constructor(private networkService: NetworkService) {
    this.networkService.addListener(
      NetworkEvents.NETWORK_UPDATE_EVENT,
      (activeNetwork) => {
        this.eventEmitter.emit('update', {
          method: Web3Event.CHAIN_CHANGED,
          params: {
            chainId: (activeNetwork as ActiveNetwork).chainId,
            networkVersion: 'avax',
          },
        });
      }
    );
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
