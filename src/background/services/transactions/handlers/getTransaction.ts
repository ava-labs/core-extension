import { ExtensionRequestHandler } from '@src/background/connections/models';
import { TransactionsService } from '../TransactionsService';
import { ExtensionRequest } from '@src/background/connections/extensionConnection/models';
import { injectable } from 'tsyringe';
import { Transaction } from '../models';

type HandlerType = ExtensionRequestHandler<
  ExtensionRequest.TRANSACTIONS_GET,
  Transaction | undefined,
  [txId: string]
>;

@injectable()
export class GetTransactionHandler implements HandlerType {
  method = ExtensionRequest.TRANSACTIONS_GET as const;

  constructor(private transactionsService: TransactionsService) {}

  handle: HandlerType['handle'] = async (request) => {
    const [txId] = request.params;

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
