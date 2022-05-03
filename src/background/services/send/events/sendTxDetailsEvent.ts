import {
  ExtensionConnectionEvent,
  ExtensionEventEmitter,
} from '@src/background/connections/models';
import { EventEmitter } from 'events';
import { singleton } from 'tsyringe';
import { SendEvent } from '../models';
import { SendService } from '../SendService';

@singleton()
export class SendTxDetailsEvents implements ExtensionEventEmitter {
  private eventEmitter = new EventEmitter();
  constructor(private sendService: SendService) {
    this.sendService.addListener(SendEvent.TX_DETAILS, (value) => {
      this.eventEmitter.emit('update', {
        name: SendEvent.TX_DETAILS,
        value: value,
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
