import { DAppProviderRequest } from '@src/background/connections/dAppConnection/models';
import { openExtensionNewWindow } from '@src/utils/extensionUtils';
import { TransactionsService } from '../TransactionsService';
import { injectable } from 'tsyringe';
import { DEFERRED_RESPONSE } from '@src/background/connections/middlewares/models';
import { DAppRequestHandler } from '@src/background/connections/dAppConnection/DAppRequestHandler';

@injectable()
export class EthSendTransactionHandler extends DAppRequestHandler {
  methods = [DAppProviderRequest.ETH_SEND_TX];

  constructor(private transactionsService: TransactionsService) {
    super();
  }

  handleUnauthenticated = async (request) => {
    return {
      ...request,
      error: 'account not connected',
    };
  };

  handleAuthenticated = async (request) => {
    await this.transactionsService.addTransaction(request);

    await openExtensionNewWindow(`sign/transaction?actionId=${request.id}`, '');

    return { ...request, result: DEFERRED_RESPONSE };
  };
}
