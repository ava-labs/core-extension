import { DAppRequestHandler } from '@src/background/connections/dAppConnection/DAppRequestHandler';
import { DAppProviderRequest } from '@src/background/connections/dAppConnection/models';
import { DEFERRED_RESPONSE } from '@src/background/connections/middlewares/models';
import { ethErrors } from 'eth-rpc-errors';
import { injectable } from 'tsyringe';
import { Action } from '../../actions/models';
import { NetworkService } from '../../network/NetworkService';
import ensureMessageIsValid from '../../wallet/utils/ensureMessageIsValid';
import { WalletService } from '../../wallet/WalletService';
import { MessageType } from '../models';
import { paramsToMessageParams } from '../utils/messageParamsParser';
import { sanitizeRequestParams } from '../../wallet/utils/sanitizeRequestParams';

@injectable()
export class PersonalSignHandler extends DAppRequestHandler {
  methods = [
    MessageType.ETH_SIGN,
    MessageType.SIGN_TYPED_DATA,
    DAppProviderRequest.ETH_SIGN_TYPED_DATA_V1,
    DAppProviderRequest.ETH_SIGN_TYPED_DATA_V3,
    DAppProviderRequest.ETH_SIGN_TYPED_DATA_V4,
    MessageType.PERSONAL_SIGN,
  ];
  constructor(
    private walletService: WalletService,
    private networkService: NetworkService
  ) {
    super();
  }

  handleUnauthenticated = async (request) => {
    return {
      ...request,
      error: `account not available`,
    };
  };

  handleAuthenticated = async (request) => {
    if (!this.walletService.walletType) {
      return {
        ...request,
        error: 'wallet undefined',
      };
    }

    const actionData = {
      ...request,
      displayData: sanitizeRequestParams(
        request.method,
        paramsToMessageParams(request)
      ),
      tabId: request.site.tabId,
    };
    try {
      const activeNetwork = this.networkService.activeNetwork;

      if (!activeNetwork) {
        return {
          ...request,
          error: ethErrors.rpc.invalidRequest({
            message: 'no active network found',
          }),
        };
      }

      ensureMessageIsValid(
        request.method,
        actionData.displayData.data,
        activeNetwork.chainId
      );
    } catch (err) {
      return {
        ...request,
        error: ethErrors.rpc.invalidParams({
          message: (err as unknown as Error).message,
        }),
      };
    }

    this.openApprovalWindow(actionData, `sign?id=${request.id}`);

    return { ...request, result: DEFERRED_RESPONSE };
  };

  onActionApproved = async (
    pendingAction: Action,
    result,
    onSuccess,
    onError
  ) => {
    try {
      const result = await this.walletService.signMessage(
        pendingAction.method as MessageType,
        pendingAction.displayData.data
      );
      onSuccess(result);
    } catch (e) {
      onError(e);
    }
  };
}
