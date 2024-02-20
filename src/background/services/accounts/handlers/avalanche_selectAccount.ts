import { ethErrors } from 'eth-rpc-errors';
import { injectable } from 'tsyringe';
import { DAppRequestHandler } from '@src/background/connections/dAppConnection/DAppRequestHandler';
import { DAppProviderRequest } from '@src/background/connections/dAppConnection/models';
import { DEFERRED_RESPONSE } from '@src/background/connections/middlewares/models';
import { AccountsService } from '../AccountsService';
import { Account, AccountType, WalletId } from '../models';
import { Action } from '../../actions/models';
import { PermissionsService } from '../../permissions/PermissionsService';

@injectable()
export class AvalancheSelectAccountHandler extends DAppRequestHandler {
  methods = [DAppProviderRequest.ACCOUNT_SELECT];

  constructor(
    private accountsService: AccountsService,
    private permissionsService: PermissionsService
  ) {
    super();
  }

  handleAuthenticated = async (request) => {
    const [selectedIndexOrID] = request.params;

    // until core web sends only IDs...
    const allAccounts = this.accountsService.getAccountList();

    const selectedAccount = allAccounts.find((account) =>
      account.type === AccountType.PRIMARY
        ? account.index === selectedIndexOrID ||
          account.id === selectedIndexOrID
        : account.id === selectedIndexOrID
    );

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
      selectedAccount: selectedAccount,
    };

    await this.openApprovalWindow(actionData, `switchAccount`);

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
        inactiveWalletId?: WalletId;
      };
      if (pendingAction.site?.domain) {
        await this.permissionsService.setAccountPermissionForDomain(
          pendingAction.site.domain,
          selectedAccount.addressC,
          true
        );
      }
      await this.accountsService.activateAccount(selectedAccount.id);
      onSuccess(null);
    } catch (e) {
      onError(e);
    }
  };
}
