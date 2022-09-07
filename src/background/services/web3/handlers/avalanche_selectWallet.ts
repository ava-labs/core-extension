import { DAppRequestHandler } from '@src/background/connections/dAppConnection/DAppRequestHandler';
import { DAppProviderRequest } from '@src/background/connections/dAppConnection/models';
import { DEFERRED_RESPONSE } from '@src/background/connections/middlewares/models';
import { ethErrors } from 'eth-rpc-errors';
import { injectable } from 'tsyringe';
import { Action } from '../../actions/models';

@injectable()
export class AvalancheSelectWalletHandler extends DAppRequestHandler {
  methods = [DAppProviderRequest.AVALANCHE_SELECT_WALLET];

  handleUnauthenticated = async (request) => {
    const [availableExtensions] = request.params;

    if (!availableExtensions || availableExtensions.length === 0) {
      return {
        ...request,
        error: 'no wallet options available',
      };
    }

    await this.openApprovalWindow(
      {
        ...request,
        displayData: {
          options: availableExtensions.map((o) => o.type),
        },
        tabId: request.site.tabId,
      },
      `approve/select-wallet?id=${request.id}`
    );

    return { ...request, result: DEFERRED_RESPONSE };
  };

  handleAuthenticated = async (request) => {
    return this.handleUnauthenticated(request);
  };

  onActionApproved = async (
    pendingAction: Action,
    result,
    onSuccess,
    onError
  ) => {
    if (result >= 0) {
      onSuccess(result);
    } else {
      onError(ethErrors.provider.userRejectedRequest());
    }
  };
}
