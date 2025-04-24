import { WalletEvents } from '@core/types';
import {
  ExtensionConnectionEvent,
  ExtensionEventEmitter,
} from '../../../connections/models';
import { EventEmitter } from 'events';
import { singleton } from 'tsyringe';
import { SecretsService } from '../SecretsService';

@singleton()
export class WalletUpdatedEvents implements ExtensionEventEmitter {
  private eventEmitter = new EventEmitter();
  constructor(private secretsService: SecretsService) {
    this.secretsService.addListener(
      WalletEvents.WALLET_STATE_UPDATE,
      (wallet) => {
        this.eventEmitter.emit('update', {
          name: WalletEvents.WALLET_STATE_UPDATE,
          value: wallet,
        });
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
