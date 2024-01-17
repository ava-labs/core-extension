import { TransactionsService } from './../TransactionsService';
import {
  ConnectionInfo,
  DAppEventEmitter,
  ExtensionConnectionEvent,
} from '@src/background/connections/models';
import { EventEmitter } from 'events';
import { injectable } from 'tsyringe';
import { TransactionEvent, TxStatus } from '../models';
import { ethErrors } from 'eth-rpc-errors';

@injectable()
export class TransactionCompletedEvents implements DAppEventEmitter {
  private eventEmitter = new EventEmitter();
  private _connectionInfo?: ConnectionInfo;

  setConnectionInfo(connectionInfo: ConnectionInfo) {
    this._connectionInfo = connectionInfo;
  }

  constructor(private transactionService: TransactionsService) {
    this.transactionService.addListener(
      TransactionEvent.TRANSACTION_FINALIZED,
      (response) => {
        if (response.tabId === this._connectionInfo?.tabId) {
          this.eventEmitter.emit('update', {
            id: `${response.requestId}`,
            method: response.method,
            params: [
              {
                ...response.txParams,
                gasPrice:
                  response.gasPrice && `0x${response.gasPrice?.toString(16)}`,
              },
            ],
            ...(response.txHash ? { result: response.txHash } : {}),
            ...(response.error ? { error: response.error } : {}),
            ...(response.status === TxStatus.ERROR_USER_CANCELED
              ? { error: ethErrors.provider.userRejectedRequest() }
              : {}),
          });
        }
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
