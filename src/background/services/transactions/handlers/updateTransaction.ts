import { ExtensionRequestHandler } from '@src/background/connections/models';
import { TransactionsService } from '../TransactionsService';
import { ExtensionRequest } from '@src/background/connections/extensionConnection/models';
import {
  isTxFinalizedUpdate,
  isTxParamsUpdate,
  isTxStatusUpdate,
  TxStatus,
} from '../models';
import { injectable } from 'tsyringe';

@injectable()
export class UpdateTransactionHandler implements ExtensionRequestHandler {
  methods = [ExtensionRequest.TRANSACTIONS_UPDATE];

  constructor(private transactionsService: TransactionsService) {}

  handle = async (request) => {
    const params = request.params;
    if (!params) {
      return {
        ...request,
        error: 'no params on request',
      };
    }

    const update = params[0];

    if (!update) {
      return {
        ...request,
        error: 'no updates found in params',
      };
    }

    const isKnownTxType = [
      isTxStatusUpdate(update),
      isTxFinalizedUpdate(update),
      isTxParamsUpdate(update),
    ].some((isKnown) => isKnown);

    if (!isKnownTxType) {
      return {
        ...request,
        error: 'malformed or unsupported update',
      };
    }

    await this.transactionsService.updateTransaction(update);

    const currentPendingTransactions =
      await this.transactionsService.getTransactions();
    const pendingTx = currentPendingTransactions[update.id];

    if (update.status === TxStatus.SUBMITTING) {
      /**
       * If we are updating submit then we need to wait for the tx to be put into the
       * doen state before we update the requester
       */

      return pendingTx.txHash
        ? {
            ...request,
            result: pendingTx,
          }
        : {
            ...request,
            error: pendingTx.error,
          };
    }

    return {
      ...request,
      result: pendingTx,
    };
  };
}
