import { EventEmitter } from 'events';
import { singleton } from 'tsyringe';

import {
  ExtensionConnectionEvent,
  ExtensionEventEmitter,
} from '../../../connections/models';

import { WalletConnectService } from '../WalletConnectService';
import { WalletConnectEvent } from '@core/types';

@singleton()
export class WalletConnectEvents implements ExtensionEventEmitter {
  private eventEmitter = new EventEmitter();
  constructor(private wcService: WalletConnectService) {
    this.wcService.addListener(WalletConnectEvent.UriGenerated, (data) => {
      this.eventEmitter.emit('update', {
        name: WalletConnectEvent.UriGenerated,
        value: data,
      });
    });

    this.wcService.addListener(
      WalletConnectEvent.SessionPermissionsMismatch,
      (data) => {
        this.eventEmitter.emit('update', {
          name: WalletConnectEvent.SessionPermissionsMismatch,
          value: data,
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
