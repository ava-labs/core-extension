import { ethErrors } from 'eth-rpc-errors';
import { injectable } from 'tsyringe';
import { DAppRequestHandler } from '@src/background/connections/dAppConnection/DAppRequestHandler';
import { DAppProviderRequest } from '@src/background/connections/dAppConnection/models';
import { DEFERRED_RESPONSE } from '@src/background/connections/middlewares/models';
import { AccountsService } from '../AccountsService';
import { Account } from '../models';
import { Action } from '../../actions/models';

@injectable()
export class AvalancheSelectAccountHandler extends DAppRequestHandler {
  methods = [DAppProviderRequest.ACCOUNT_SELECT];

  constructor(private accountsService: AccountsService) {
    super();
  }

  handleAuthenticated = async (request) => {
    const [selectedIndex] = request.params;

    const selectedAccount = this.accountsService
      .getAccounts()
      .find((account) => account.index === Number(selectedIndex));

    if (!selectedAccount) {
      return {
        ...request,
        error: ethErrors.rpc.invalidParams({
          message: 'Account not found',
        }),
      };
    }

    const actionData = {
      ...request,
      tabId: request.site.tabId,
      selectedAccount,
    };
    await this.openApprovalWindow(actionData, `switchAccount?id=${request.id}`);

    return { ...request, result: DEFERRED_RESPONSE };
  };

  handleUnauthenticated = async (request) => {
    return {
      ...request,
      error: ethErrors.provider.unauthorized(),
    };
  };

  onActionApproved = async (
    pendingAction: Action,
    result,
    onSuccess,
    onError
  ) => {
    try {
      const { selectedAccount } = pendingAction as Action & {
        selectedAccount: Account;
      };
      await this.accountsService.activateAccount(selectedAccount.index);
      onSuccess(null);
    } catch (e) {
      onError(e);
    }
  };
}
