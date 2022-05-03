import {
  ExtensionConnectionEvent,
  ExtensionEventEmitter,
} from '@src/background/connections/models';
import { EventEmitter } from 'events';
import { singleton } from 'tsyringe';
import { WalletEvents } from '../models';
import { WalletService } from '../WalletService';

@singleton()
export class WalletUpdatedEvents implements ExtensionEventEmitter {
  private eventEmitter = new EventEmitter();
  constructor(private walletService: WalletService) {
    this.walletService.addListener(
      WalletEvents.WALLET_STATE_UPDATE,
      (state) => {
        this.eventEmitter.emit('update', {
          name: WalletEvents.WALLET_STATE_UPDATE,
          value: state,
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
