import { ChainId } from '@avalabs/core-chains-sdk';
import {
  Action,
  DAppProviderRequest,
  DAppRequestHandler,
  DEFERRED_RESPONSE,
} from '@core/types';
import { chainIdToCaip } from '@core/common';
import { ethErrors } from 'eth-rpc-errors';
import { injectable } from 'tsyringe';
import { openApprovalWindow } from '../../../runtime/openApprovalWindow';
import { NetworkService } from '../NetworkService';

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
          'Invalid param, must be true or false',
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
    _result,
    onSuccess,
    onError,
  ) => {
    try {
      const {
        displayData: { isTestmode },
      } = pendingAction;

      const domain = pendingAction.site?.domain;

      if (!domain) {
        throw new Error('Unrecognized domain');
      }

      await this.networkService.setNetwork(
        domain,
        chainIdToCaip(
          isTestmode
            ? ChainId.AVALANCHE_TESTNET_ID
            : ChainId.AVALANCHE_MAINNET_ID,
        ),
      );

      onSuccess(null);
    } catch (e) {
      onError(e);
    }
  };
}
