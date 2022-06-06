import { NetworkFeeEvents } from '../models';
import {
  ExtensionConnectionEvent,
  ExtensionEventEmitter,
} from '@src/background/connections/models';
import { EventEmitter } from 'events';
import { NetworkFeeService } from '../NetworkFeeService';
import { singleton } from 'tsyringe';

@singleton()
export class NetworkFeeUpdateEvents implements ExtensionEventEmitter {
  private eventEmitter = new EventEmitter();
  constructor(private networkFeeService: NetworkFeeService) {
    this.networkFeeService.addListener(
      NetworkFeeEvents.NETWORK_FEE_UPDATED,
      (fee) => {
        this.eventEmitter.emit('update', {
          name: NetworkFeeEvents.NETWORK_FEE_UPDATED,
          value: fee,
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
