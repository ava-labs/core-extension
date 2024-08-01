import { DAppRequestHandler } from '@src/background/connections/dAppConnection/DAppRequestHandler';
import { DAppProviderRequest } from '@src/background/connections/dAppConnection/models';
import { DEFERRED_RESPONSE } from '@src/background/connections/middlewares/models';
import { injectable } from 'tsyringe';
import { Action } from '../../actions/models';
import { NetworkService } from '../NetworkService';
import { ethErrors } from 'eth-rpc-errors';
import { openApprovalWindow } from '@src/background/runtime/openApprovalWindow';
import { ChainId } from '@avalabs/core-chains-sdk';

@injectable()
export class AvalancheSetDeveloperModeHandler extends DAppRequestHandler {
  methods = [DAppProviderRequest.AVALANCHE_SET_DEVELOPER_MODE];

  constructor(private networkService: NetworkService) {
    super();
  }

  handleUnauthenticated = async (rpcCall) => {
    const { request } = rpcCall;
    const [isRequestingTestnetMode] = request.params;

    if (typeof isRequestingTestnetMode !== 'boolean') {
      return {
        ...request,
        error: ethErrors.rpc.invalidParams(
          'Invalid param, must be true or false'
        ),
      };
    }

    // If we're already on the requested environment, do not prompt the user
    if (this.networkService.isMainnet() !== isRequestingTestnetMode) {
      return {
        ...request,
        result: null,
      };
    }

    const actionData = {
      ...request,
      tabId: request.site.tabId,
      displayData: {
        isTestmode: isRequestingTestnetMode,
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

      const domain = pendingAction.site?.domain;

      if (!domain) {
        throw new Error('Unrecognized domain');
      }

      const network = await this.networkService.getNetwork(
        isTestmode ? ChainId.AVALANCHE_TESTNET_ID : ChainId.AVALANCHE_MAINNET_ID
      );

      if (!network) {
        throw new Error('Target network not found');
      }

      await this.networkService.setNetwork(domain, network);

      onSuccess(null);
    } catch (e) {
      onError(e);
    }
  };
}
