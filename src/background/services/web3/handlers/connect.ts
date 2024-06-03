import { DAppProviderRequest } from '@src/background/connections/dAppConnection/models';
import { AccountsService } from '../../accounts/AccountsService';
import { injectable } from 'tsyringe';
import { DEFERRED_RESPONSE } from '@src/background/connections/middlewares/models';
import { PermissionsService } from '../../permissions/PermissionsService';
import { ethErrors } from 'eth-rpc-errors';
import { Action } from '../../actions/models';
import { DAppRequestHandler } from '@src/background/connections/dAppConnection/DAppRequestHandler';
import { openApprovalWindow } from '@src/background/runtime/openApprovalWindow';

/**
 * This is called when the user requests to connect the via dapp. We need
 * to popup the permissions window, get permissions for the given domain
 * and then respond accordingly.
 *
 * @param data the rpc request
 * @returns
 */

@injectable()
export class ConnectRequestHandler implements DAppRequestHandler {
  methods = [DAppProviderRequest.CONNECT_METHOD];

  constructor(
    private accountsService: AccountsService,
    private permissionsService: PermissionsService
  ) {}

  async handleAuthenticated(rpcCall) {
    const { request } = rpcCall;

    if (!this.accountsService.activeAccount) {
      return {
        ...request,
        error: ethErrors.rpc.internal('wallet locked, undefined or malformed'),
      };
    }

    return {
      ...request,
      result: [this.accountsService.activeAccount.addressC],
    };
  }

  handleUnauthenticated = async (rpcCall) => {
    const { request } = rpcCall;

    if (!request.site?.domain) {
      return {
        ...request,
        error: ethErrors.rpc.invalidRequest('domain unknown'),
      };
    }

    await openApprovalWindow(
      {
        ...request,
        displayData: {
          domainName: request.site?.name,
          domainUrl: request.site?.domain,
          domainIcon: request.site?.icon,
        },
      },
      `permissions`
    );

    return { ...request, result: DEFERRED_RESPONSE };
  };

  onActionApproved = async (
    pendingAction: Action,
    result,
    onSuccess,
    onError
  ) => {
    const selectedAccount = this.accountsService.getAccountByID(result);

    if (!selectedAccount) {
      onError(ethErrors.rpc.internal('Selected account not found'));
      return;
    }

    if (!pendingAction?.site?.domain) {
      onError(ethErrors.rpc.internal('Domain not set'));
      return;
    }

    // The site was already approved
    // We usually get here when an already approved site attempts to connect and the extension was locked
    if (
      this.accountsService.activeAccount?.id === result &&
      (await this.permissionsService.hasDomainPermissionForAccount(
        pendingAction.site.domain,
        selectedAccount.addressC
      ))
    ) {
      onSuccess([selectedAccount.addressC]);
      return;
    }

    await this.permissionsService.setAccountPermissionForDomain(
      pendingAction.site.domain,
      selectedAccount.addressC,
      true
    );

    await this.accountsService.activateAccount(result);

    onSuccess([selectedAccount.addressC]);
  };
}
