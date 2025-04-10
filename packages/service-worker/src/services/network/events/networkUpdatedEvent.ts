import {
  ExtensionConnectionEvent,
  ExtensionEventEmitter,
} from '../../../connections/models';
import { EventEmitter } from 'events';
import { singleton } from 'tsyringe';
import { NetworkEvents } from '../models';
import { NetworkService } from '../NetworkService';

@singleton()
export class NetworkUpdatedEvents implements ExtensionEventEmitter {
  private eventEmitter = new EventEmitter();
  constructor(private networkService: NetworkService) {
    this.networkService.uiActiveNetworkChanged.add((network) => {
      if (!network) {
        this.eventEmitter.emit('update', {
          name: NetworkEvents.NETWORK_UPDATE_EVENT,
          value: undefined,
        });
        return;
      }

      const { tokens: _, ...networkWithoutTokens } = network;

      this.eventEmitter.emit('update', {
        name: NetworkEvents.NETWORK_UPDATE_EVENT,
        value: networkWithoutTokens,
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
