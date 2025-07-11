import { NetworkVMType } from '@avalabs/vm-module-types';
import { canSkipApproval, isPrimaryAccount } from '@core/common';
import {
  Account,
  Action,
  buildActionForRequest,
  DAppProviderRequest,
  DAppRequestHandler,
  DEFERRED_RESPONSE,
  JsonRpcRequestParams,
} from '@core/types';
import { ethErrors } from 'eth-rpc-errors';
import { injectable } from 'tsyringe';
import { openApprovalWindow } from '~/runtime/openApprovalWindow';
import { PermissionsService } from '../../permissions/PermissionsService';
import { AccountsService } from '../AccountsService';

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
    const allAccounts = await this.accountsService.getAccountList();

    const activeAccount = await this.accountsService.getActiveAccount();

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
        await this.permissionsService.grantPermission(
          pendingAction.site.domain,
          selectedAccount.addressC,
          NetworkVMType.EVM,
        );
      }
      await this.accountsService.activateAccount(selectedAccount.id);
      onSuccess(null);
    } catch (e) {
      onError(e);
    }
  };
}
