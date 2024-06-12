import { DAppRequestHandler } from '@src/background/connections/dAppConnection/DAppRequestHandler';
import { DAppProviderRequest } from '@src/background/connections/dAppConnection/models';
import { DEFERRED_RESPONSE } from '@src/background/connections/middlewares/models';
import { injectable } from 'tsyringe';
import { Action } from '../../actions/models';
import { NetworkService } from '../NetworkService';
import { ethErrors } from 'eth-rpc-errors';
import { ChainId } from '@avalabs/chains-sdk';
import { openApprovalWindow } from '@src/background/runtime/openApprovalWindow';

@injectable()
export class AvalancheSetDeveloperModeHandler extends DAppRequestHandler {
  methods = [DAppProviderRequest.AVALANCHE_SET_DEVELOPER_MODE];

  constructor(private networkService: NetworkService) {
    super();
  }

  handleUnauthenticated = async (rpcCall) => {
    const { request } = rpcCall;
    const [isTestmode] = request.params;

    if (typeof isTestmode !== 'boolean') {
      return {
        ...request,
        error: ethErrors.rpc.invalidParams(
          'Invalid param, must be true or false'
        ),
      };
    }

    const actionData = {
      ...request,
      tabId: request.site.tabId,
      displayData: {
        isTestmode,
      },
    };

    await openApprovalWindow(actionData, `approve/set-developer-mode`);

    return { ...request, result: DEFERRED_RESPONSE };
  };

  handleAuthenticated = async (rpcCall) => {
    return this.handleUnauthenticated(rpcCall);
  };

  onActionApproved = async (
    pendingAction: Action<{ isTestmode: boolean }>,
    result,
    onSuccess,
    onError
  ) => {
    try {
      const {
        displayData: { isTestmode },
      } = pendingAction;
      await this.networkService.setNetwork(
        isTestmode ? ChainId.AVALANCHE_TESTNET_ID : ChainId.AVALANCHE_MAINNET_ID
      );
      onSuccess(null);
    } catch (e) {
      onError(e);
    }
  };
}
