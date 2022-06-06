import { DAppProviderRequest } from '@src/background/connections/dAppConnection/models';
import { DAppRequestHandler } from '@src/background/connections/models';
import { openExtensionNewWindow } from '@src/utils/extensionUtils';
import { TransactionsService } from '../TransactionsService';
import { injectable } from 'tsyringe';
import { DEFERRED_RESPONSE } from '@src/background/connections/middlewares/models';

@injectable()
export class EthSendTransactionHandler implements DAppRequestHandler {
  methods = [DAppProviderRequest.ETH_SEND_TX];

  constructor(private transactionsService: TransactionsService) {}

  handleUnauthenticated = async (request) => {
    return {
      ...request,
      error: 'account not connected',
    };
  };

  handleAuthenticated = async (request) => {
    await this.transactionsService.addTransaction(request);

    await openExtensionNewWindow(
      `sign/transaction?id=${request.id}`,
      '',
      request.meta?.coords
    );

    return { ...request, result: DEFERRED_RESPONSE };
  };
}
