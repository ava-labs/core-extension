import { ethErrors } from 'eth-rpc-errors';
import { injectable } from 'tsyringe';
import { DAppRequestHandler } from '@src/background/connections/dAppConnection/DAppRequestHandler';
import type { JsonRpcRequestParams } from '@src/background/connections/dAppConnection/models';
import { DAppProviderRequest } from '@src/background/connections/dAppConnection/models';
import { DEFERRED_RESPONSE } from '@src/background/connections/middlewares/models';
import { openApprovalWindow } from '@src/background/runtime/openApprovalWindow';
import type { AccountsService } from '../AccountsService';
import type { Account } from '../models';
import type { Action } from '../../actions/models';
import { buildActionForRequest } from '../../actions/models';
import type { PermissionsService } from '../../permissions/PermissionsService';
import { isPrimaryAccount } from '../utils/typeGuards';
import { canSkipApproval } from '@src/utils/canSkipApproval';

type Params = [selectedIndexOrID: number | string];

@injectable()
export class AvalancheSelectAccountHandler extends DAppRequestHandler<
  Params,
  null
> {
  methods = [DAppProviderRequest.ACCOUNT_SELECT];

  constructor(
    private accountsService: AccountsService,
    private permissionsService: PermissionsService,
  ) {
    super();
  }

  handleAuthenticated = async (
    rpcCall: JsonRpcRequestParams<DAppProviderRequest, Params>,
  ) => {
    const { request, scope } = rpcCall;
    const [selectedIndexOrID] = request.params;

    // until core web sends only IDs...
    const allAccounts = this.accountsService.getAccountList();

    const activeAccount = this.accountsService.activeAccount;

    const activeWalletId = isPrimaryAccount(activeAccount)
      ? activeAccount.walletId
      : null;

    const activeWalletAccounts = activeWalletId
      ? allAccounts.filter(
          (account) =>
            isPrimaryAccount(account) && account.walletId === activeWalletId,
        )
      : undefined;

    const predicate = (account: Account) => {
      const result = isPrimaryAccount(account)
        ? account.index === selectedIndexOrID ||
          account.id === selectedIndexOrID
        : account.id === selectedIndexOrID;

      return result;
    };
    const selectedAccount =
      activeWalletAccounts?.find(predicate) || allAccounts.find(predicate);

    if (!selectedAccount) {
      return {
        ...request,
        error: ethErrors.rpc.invalidParams({
          message: 'Account not found',
        }),
      };
    }

    const skipApproval = await canSkipApproval(
      request.site?.domain ?? '',
      request.site?.tabId ?? -1,
    );

    if (skipApproval) {
      await this.accountsService.activateAccount(selectedAccount.id);
      return { ...request, result: null };
    }

    const actionData = buildActionForRequest(request, {
      scope,
      displayData: {
        selectedAccount,
      },
    });

    await openApprovalWindow(actionData, `switchAccount`);

    return { ...request, result: DEFERRED_RESPONSE };
  };

  handleUnauthenticated = async ({ request }) => {
    return {
      ...request,
      error: ethErrors.provider.unauthorized(),
    };
  };

  onActionApproved = async (
    pendingAction: Action<{ selectedAccount: Account }>,
    _,
    onSuccess,
    onError,
  ) => {
    try {
      const { selectedAccount } = pendingAction.displayData;

      if (pendingAction.site?.domain) {
        await this.permissionsService.setAccountPermissionForDomain(
          pendingAction.site.domain,
          selectedAccount.addressC,
          true,
        );
      }
      await this.accountsService.activateAccount(selectedAccount.id);
      onSuccess(null);
    } catch (e) {
      onError(e);
    }
  };
}
