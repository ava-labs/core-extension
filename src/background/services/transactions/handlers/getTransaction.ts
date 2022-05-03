import { ExtensionRequestHandler } from '@src/background/connections/models';
import { TransactionsService } from '../TransactionsService';
import { ExtensionRequest } from '@src/background/connections/extensionConnection/models';
import { injectable } from 'tsyringe';

@injectable()
export class GetTransactionHandler implements ExtensionRequestHandler {
  methods = [ExtensionRequest.TRANSACTIONS_GET];

  constructor(private transactionsService: TransactionsService) {}

  handle = async (request) => {
    const params = request.params;
    if (!params) {
      return {
        ...request,
        error: 'no params on request',
      };
    }

    const txId = params[0];

    if (!txId) {
      return {
        ...request,
        error: 'no tx id found in params',
      };
    }

    const currentPendingTransactions =
      await this.transactionsService.getTransactions();

    const tx = currentPendingTransactions[txId];

    return {
      ...request,
      result: tx,
    };
  };
}
