import {
  ExtensionConnectionEvent,
  ExtensionEventEmitter,
} from '@src/background/connections/models';
import { EventEmitter } from 'events';
import { singleton } from 'tsyringe';
import { TransactionEvent } from '../models';
import { TransactionsService } from '../TransactionsService';

@singleton()
export class TransactionFinalizedUpdateEvents implements ExtensionEventEmitter {
  private eventEmitter = new EventEmitter();
  constructor(private transactionsService: TransactionsService) {
    this.transactionsService.addListener(
      TransactionEvent.TRANSACTION_FINALIZED,
      (value) => {
        this.eventEmitter.emit('update', {
          name: TransactionEvent.TRANSACTION_FINALIZED,
          value,
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
