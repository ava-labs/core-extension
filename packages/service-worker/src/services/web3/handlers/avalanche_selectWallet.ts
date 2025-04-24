import { DAppRequestHandler } from '../../../connections/dAppConnection/DAppRequestHandler';
import { DAppProviderRequest } from '@core/types';
import { DEFERRED_RESPONSE } from '../../../connections/middlewares/models';
import { ethErrors } from 'eth-rpc-errors';
import { injectable } from 'tsyringe';
import { Action } from '@core/types';
import { openApprovalWindow } from '../../../runtime/openApprovalWindow';

@injectable()
export class AvalancheSelectWalletHandler extends DAppRequestHandler {
  methods = [DAppProviderRequest.AVALANCHE_SELECT_WALLET];

  handleUnauthenticated = async (rpcCall) => {
    const { request } = rpcCall;
    const [availableExtensions] = request.params;

    if (!availableExtensions || availableExtensions.length === 0) {
      return {
        ...request,
        error: 'no wallet options available',
      };
    }

    await openApprovalWindow(
      {
        ...request,
        displayData: {
          options: availableExtensions.map((o) => o.type),
          info: availableExtensions.map((extension) => extension.info),
        },
      },
      `approve/select-wallet`,
    );

    return { ...request, result: DEFERRED_RESPONSE };
  };

  handleAuthenticated = async (rpcCall) => {
    return this.handleUnauthenticated(rpcCall);
  };

  onActionApproved = async (
    _pendingAction: Action,
    result,
    onSuccess,
    onError,
  ) => {
    if (result >= 0) {
      onSuccess(result);
    } else {
      onError(ethErrors.provider.userRejectedRequest());
    }
  };
}
