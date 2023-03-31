import { WalletService } from '../WalletService';
import { WalletEvents } from '../models';
import {
  ExtensionConnectionEvent,
  ExtensionEventEmitter,
} from '@src/background/connections/models';
import { EventEmitter } from 'events';
import { singleton } from 'tsyringe';

@singleton()
export class WalletUpdatedEvents implements ExtensionEventEmitter {
  private eventEmitter = new EventEmitter();
  constructor(private walletService: WalletService) {
    this.walletService.addListener(
      WalletEvents.WALLET_STATE_UPDATE,
      (wallet) => {
        this.eventEmitter.emit('update', {
          name: WalletEvents.WALLET_STATE_UPDATE,
          value: wallet,
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
