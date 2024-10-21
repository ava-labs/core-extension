import { injectable } from 'tsyringe';
import { ethErrors } from 'eth-rpc-errors';

import { DAppRequestHandler } from '@src/background/connections/dAppConnection/DAppRequestHandler';
import {
  DAppProviderRequest,
  JsonRpcRequestParams,
} from '@src/background/connections/dAppConnection/models';
import { DEFERRED_RESPONSE } from '@src/background/connections/middlewares/models';
import { openApprovalWindow } from '@src/background/runtime/openApprovalWindow';
import { canSkipApproval } from '@src/utils/canSkipApproval';

import { Action } from '../../actions/models';
import { SecretsService } from '../SecretsService';
import { WalletService } from '../../wallet/WalletService';

type Params = [walletId: string, newName: string];

@injectable()
export class AvalancheRenameWalletHandler extends DAppRequestHandler<
  Params,
  null
> {
  methods = [DAppProviderRequest.WALLET_RENAME];

  constructor(
    private secretsService: SecretsService,
    private walletService: WalletService
  ) {
    super();
  }

  handleAuthenticated = async (
    rpcCall: JsonRpcRequestParams<DAppProviderRequest, Params>
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

    console.log('newName.trim(): ', newName.trim().length);
    if (newName.trim().length === 0) {
      return {
        ...request,
        error: ethErrors.rpc.invalidParams({
          message: 'Invalid new name',
        }),
      };
    }

    const wallet = await this.secretsService.getWalletAccountsSecretsById(
      walletId
    );

    if (!wallet) {
      return {
        ...request,
        error: ethErrors.rpc.invalidParams({
          message: 'No wallet with specified ID',
        }),
      };
    }

    if (await canSkipApproval(request.site.domain, request.site.tabId)) {
      try {
        await this.secretsService.updateSecrets(
          { ...wallet, name: newName },
          walletId
        );

        const wallets = await this.secretsService.getPrimaryWalletsDetails();

        this.walletService.emitsWalletsInfo(wallets);

        return {
          ...request,
          result: null,
        };
      } catch (err) {
        return {
          ...request,
          error: ethErrors.rpc.internal('Wallet renaming failed'),
        };
      }
    }

    const actionData: Action<{
      walletId: string;
      newName: string;
    }> = {
      ...request,
      scope,
      displayData: {
        walletId,
        newName,
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
    onError
  ) => {
    try {
      const { walletId, newName } = pendingAction.displayData;

      const wallet = await this.secretsService.getWalletAccountsSecretsById(
        walletId
      );

      await this.secretsService.updateSecrets(
        { ...wallet, name: newName },
        walletId
      );

      const wallets = await this.secretsService.getPrimaryWalletsDetails();

      this.walletService.emitsWalletsInfo(wallets);

      onSuccess(null);
    } catch (e) {
      onError(e);
    }
  };
}
