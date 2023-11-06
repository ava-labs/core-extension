import { DAppRequestHandler } from '@src/background/connections/dAppConnection/DAppRequestHandler';
import { DAppProviderRequest } from '@src/background/connections/dAppConnection/models';
import { DEFERRED_RESPONSE } from '@src/background/connections/middlewares/models';
import { injectable } from 'tsyringe';
import { Action } from '../../actions/models';
import { NetworkService } from '../NetworkService';
import { ethErrors } from 'eth-rpc-errors';
import { ChainId } from '@avalabs/chains-sdk';

@injectable()
export class AvalancheSetDeveloperModeHandler extends DAppRequestHandler {
  methods = [DAppProviderRequest.AVALANCHE_SET_DEVELOPER_MODE];

  constructor(private networkService: NetworkService) {
    super();
  }

  handleUnauthenticated = async (request) => {
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

    await this.openApprovalWindow(actionData, `approve/set-developer-mode`);

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
    try {
      const {
        displayData: { isTestmode },
      } = pendingAction as Action & {
        isTestmode: boolean;
      };
      await this.networkService.setNetwork(
        isTestmode ? ChainId.AVALANCHE_TESTNET_ID : ChainId.AVALANCHE_MAINNET_ID
      );
      onSuccess(null);
    } catch (e) {
      onError(e);
    }
  };
}
