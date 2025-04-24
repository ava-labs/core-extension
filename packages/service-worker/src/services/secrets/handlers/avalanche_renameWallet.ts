import { injectable } from 'tsyringe';
import { ethErrors } from 'eth-rpc-errors';

import { DAppRequestHandler } from '../../../connections/dAppConnection/DAppRequestHandler';
import {
  DAppProviderRequest,
  JsonRpcRequestParams,
} from '@core/types/src/models';
import { DEFERRED_RESPONSE } from '../../../connections/middlewares/models';
import { openApprovalWindow } from '../../../runtime/openApprovalWindow';
import { canSkipApproval } from '@core/utils';

import { Action, ActionType } from '@core/types/src/models';
import { SecretsService } from '../SecretsService';

type Params = [walletId: string, newName: string];

@injectable()
export class AvalancheRenameWalletHandler extends DAppRequestHandler<
  Params,
  null
> {
  methods = [DAppProviderRequest.WALLET_RENAME];

  constructor(private secretsService: SecretsService) {
    super();
  }

  handleAuthenticated = async (
    rpcCall: JsonRpcRequestParams<DAppProviderRequest, Params>,
  ) => {
    const { request, scope } = rpcCall;
    const [walletId, newName] = request.params;

    if (!request.site?.domain || !request.site?.tabId) {
      return {
        ...request,
        error: ethErrors.rpc.invalidRequest({
          message: 'Missing dApp domain information',
        }),
      };
    }

    if (newName.trim().length === 0) {
      return {
        ...request,
        error: ethErrors.rpc.invalidParams({
          message: 'Invalid new name',
        }),
      };
    }

    const wallet =
      await this.secretsService.getWalletAccountsSecretsById(walletId);

    if (!wallet) {
      return {
        ...request,
        error: ethErrors.rpc.invalidParams({
          message: 'No wallet with specified ID',
        }),
      };
    }

    const canSkip = await canSkipApproval(
      request.site.domain,
      request.site.tabId,
    );
    if (canSkip) {
      try {
        await this.secretsService.updateSecrets(
          { ...wallet, name: newName },
          walletId,
        );

        return {
          ...request,
          result: null,
        };
      } catch (_err) {
        return {
          ...request,
          error: ethErrors.rpc.internal('Wallet renaming failed'),
        };
      }
    }

    const actionData: Action<{
      walletId: string;
      newName: string;
      walletName: string;
    }> = {
      ...request,
      type: ActionType.Single,
      scope,
      displayData: {
        walletId,
        newName,
        walletName: wallet.name,
      },
    };

    await openApprovalWindow(actionData, 'renameWallet');

    return {
      ...request,
      result: DEFERRED_RESPONSE,
    };
  };

  handleUnauthenticated = async ({ request }) => {
    return {
      ...request,
      error: ethErrors.provider.unauthorized(),
    };
  };

  onActionApproved = async (
    pendingAction: Action<{ walletId: string; newName: string }>,
    _,
    onSuccess,
    onError,
  ) => {
    try {
      const { walletId, newName } = pendingAction.displayData;

      const wallet =
        await this.secretsService.getWalletAccountsSecretsById(walletId);

      await this.secretsService.updateSecrets(
        { ...wallet, name: newName },
        walletId,
      );

      onSuccess(null);
    } catch (e) {
      onError(e);
    }
  };
}
