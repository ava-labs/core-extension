import { singleton } from 'tsyringe';
import { EventEmitter } from 'events';

import { ExtensionConnectionEvent, ExtensionEventEmitter } from '@core/types';

import { TransferTrackingService } from '../TransferTrackingService';

@singleton()
export class TransferTrackingEvents implements ExtensionEventEmitter {
  private eventEmitter = new EventEmitter();
  constructor(private trackingService: TransferTrackingService) {
    this.trackingService.addListener('tracked-transfers-updated', (state) => {
      this.eventEmitter.emit('update', {
        name: 'tracked-transfers-updated',
        value: state,
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
