import { injectable } from 'tsyringe';
import { ethErrors } from 'eth-rpc-errors';

import {
  DAppProviderRequest,
  DAppRequestHandler,
  JsonRpcRequestParams,
} from '@core/types';
import { DEFERRED_RESPONSE, Account } from '@core/types';
import { openApprovalWindow } from '../../../runtime/openApprovalWindow';
import { canSkipApproval } from '@core/common';

import { AccountsService } from '../AccountsService';
import { Action, buildActionForRequest } from '@core/types';

type Params = [accountId: string, newName: string];

@injectable()
export class AvalancheRenameAccountHandler extends DAppRequestHandler<
  Params,
  null
> {
  methods = [DAppProviderRequest.ACCOUNT_RENAME];

  constructor(private accountsService: AccountsService) {
    super();
  }

  handleAuthenticated = async (
    rpcCall: JsonRpcRequestParams<DAppProviderRequest, Params>,
  ) => {
    const { request, scope } = rpcCall;
    const [accountId, newName] = request.params;

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

    const account = await this.accountsService.getAccountByID(accountId);

    if (!account) {
      return {
        ...request,
        error: ethErrors.rpc.invalidParams({
          message: 'No account with specified ID',
        }),
      };
    }

    if (await canSkipApproval(request.site.domain, request.site.tabId)) {
      try {
        await this.accountsService.setAccountName(accountId, newName);

        return {
          ...request,
          result: null,
        };
      } catch (_err) {
        return {
          ...request,
          error: ethErrors.rpc.internal('Account renaming failed'),
        };
      }
    }

    const actionData = buildActionForRequest(request, {
      scope,
      displayData: {
        account,
        newName,
      },
    });

    await openApprovalWindow(actionData, 'renameAccount');

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
    pendingAction: Action<{ account: Account; newName: string }>,
    _,
    onSuccess,
    onError,
  ) => {
    try {
      const { account, newName } = pendingAction.displayData;

      await this.accountsService.setAccountName(account.id, newName);

      onSuccess(null);
    } catch (e) {
      onError(e);
    }
  };
}
