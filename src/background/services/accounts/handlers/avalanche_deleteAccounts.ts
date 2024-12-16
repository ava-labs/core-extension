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

import { AccountsService } from '../AccountsService';
import { Action } from '../../actions/models';
import { Account, ImportedAccount, PrimaryAccount } from '../models';

type Params = [accountIds: string[]];

@injectable()
export class AvalancheDeleteAccountsHandler extends DAppRequestHandler<
  Params,
  null
> {
  methods = [DAppProviderRequest.ACCOUNTS_DELETE];

  constructor(private accountsService: AccountsService) {
    super();
  }

  handleAuthenticated = async (
    rpcCall: JsonRpcRequestParams<DAppProviderRequest, Params>
  ) => {
    const { request, scope } = rpcCall;
    const [accountIds] = request.params;

    if (!request.site?.domain || !request.site?.tabId) {
      return {
        ...request,
        error: ethErrors.rpc.invalidRequest({
          message: 'Missing dApp domain information',
        }),
      };
    }
    console.log({ accountIds });
    const accounts = accountIds.reduce((accumulator, accountId) => {
      const account = this.accountsService.getAccountByID(accountId);
      if (account) {
        accumulator[accountId] = account;
      }

      return accumulator;
    }, {} as Record<string, ImportedAccount | PrimaryAccount>);
    console.log({ accounts });

    if (!Object.keys(accounts).length) {
      return {
        ...request,
        error: ethErrors.rpc.invalidParams({
          message: 'No account with specified IDs',
        }),
      };
    }

    if (await canSkipApproval(request.site.domain, request.site.tabId)) {
      try {
        await this.accountsService.deleteAccounts(Object.keys(accounts));

        return {
          ...request,
          result: null,
        };
      } catch (err) {
        console.log(err);
        return {
          ...request,
          error: ethErrors.rpc.internal('Account removing failed'),
        };
      }
    }

    const actionData: Action<{
      accounts: Record<string, ImportedAccount | PrimaryAccount>;
    }> = {
      ...request,
      scope,
      displayData: {
        accounts,
      },
    };

    await openApprovalWindow(actionData, 'deleteAccounts');

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
    pendingAction: Action<{
      accounts: Record<string, ImportedAccount | PrimaryAccount>;
    }>,
    _,
    onSuccess,
    onError
  ) => {
    try {
      const { accounts } = pendingAction.displayData;

      await this.accountsService.deleteAccounts(Object.keys(accounts));

      onSuccess(null);
    } catch (e) {
      onError(e);
    }
  };
}
