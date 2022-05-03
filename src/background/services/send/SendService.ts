import { EventEmitter } from 'events';
import { singleton } from 'tsyringe';
import { SendEvent } from './models';

@singleton()
export class SendService {
  private eventEmitter = new EventEmitter();

  transactionUpdated(txData) {
    this.eventEmitter.emit(SendEvent.TX_DETAILS, txData);
  }

  addListener(event: SendEvent, callback: (data: unknown) => void) {
    this.eventEmitter.on(event, callback);
  }
}
