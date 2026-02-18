import {
  ExtensionConnectionEvent,
  ExtensionEventEmitter,
  TransactionStatusEvents as TransactionStatusEventNames,
  TransactionStatusInfo,
} from '@core/types';
import { EventEmitter } from 'events';
import { singleton } from 'tsyringe';

@singleton()
export class TransactionStatusEvents implements ExtensionEventEmitter {
  private eventEmitter = new EventEmitter();

  emitPending(
    txHash: string,
    chainId: string,
    method: string,
    accountAddress: string,
    context?: Record<string, unknown>,
  ) {
    this.eventEmitter.emit('update', {
      name: TransactionStatusEventNames.PENDING,
      value: {
        txHash,
        chainId,
        context,
        method,
        accountAddress,
      } as TransactionStatusInfo,
    });
  }

  emitConfirmed(
    txHash: string,
    chainId: string,
    method: string,
    accountAddress: string,
    context?: Record<string, unknown>,
  ) {
    this.eventEmitter.emit('update', {
      name: TransactionStatusEventNames.CONFIRMED,
      value: {
        txHash,
        chainId,
        context,
        method,
        accountAddress,
      } as TransactionStatusInfo,
    });
  }

  emitReverted(
    txHash: string,
    chainId: string,
    method: string,
    accountAddress: string,
    context?: Record<string, unknown>,
  ) {
    this.eventEmitter.emit('update', {
      name: TransactionStatusEventNames.REVERTED,
      value: {
        txHash,
        chainId,
        context,
        method,
        accountAddress,
      } as TransactionStatusInfo,
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
