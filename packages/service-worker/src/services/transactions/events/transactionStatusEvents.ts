import { RpcRequest } from '@avalabs/vm-module-types';
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

  emitPending(txHash: string, request: RpcRequest) {
    this.eventEmitter.emit('update', {
      name: TransactionStatusEventNames.PENDING,
      value: { txHash, request } as TransactionStatusInfo,
    });
  }

  emitConfirmed(txHash: string, request: RpcRequest, explorerLink: string) {
    this.eventEmitter.emit('update', {
      name: TransactionStatusEventNames.CONFIRMED,
      value: { txHash, request, explorerLink } as TransactionStatusInfo,
    });
  }

  emitReverted(txHash: string, request: RpcRequest) {
    this.eventEmitter.emit('update', {
      name: TransactionStatusEventNames.REVERTED,
      value: { txHash, request } as TransactionStatusInfo,
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
