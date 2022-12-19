import { DAppProviderRequest } from '@src/background/connections/dAppConnection/models';
import { AccountsService } from '../../accounts/AccountsService';
import { injectable } from 'tsyringe';
import { DEFERRED_RESPONSE } from '@src/background/connections/middlewares/models';
import { PermissionsService } from '../../permissions/PermissionsService';
import { ethErrors } from 'eth-rpc-errors';
import { Action } from '../../actions/models';
import { DAppRequestHandler } from '@src/background/connections/dAppConnection/DAppRequestHandler';

/**
 * This is called when the user requests to connect the via dapp. We need
 * to popup the permissions window, get permissions for the given domain
 * and then respond accordingly.
 *
 * @param data the rpc request
 * @returns
 */

@injectable()
export class ConnectRequestHandler extends DAppRequestHandler {
  methods = [DAppProviderRequest.CONNECT_METHOD];

  constructor(
    private accountsService: AccountsService,
    private permissionsService: PermissionsService
  ) {
    super();
  }

  handleAuthenticated = async (request) => {
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
  };

  handleUnauthenticated = async (request) => {
    if (!request.site?.domain) {
      return {
        ...request,
        error: ethErrors.rpc.invalidRequest('domain unknown'),
      };
    }

    await this.openApprovalWindow(
      {
        ...request,
        displayData: {
          domainName: request.site?.name,
          domainUrl: request.site?.domain,
          domainIcon: request.site?.icon,
        },
        tabId: request.site.tabId,
      },
      `permissions?id=${request.id}`
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

    await this.permissionsService.setAccountPermissionForDomain(
      pendingAction.site.domain,
      selectedAccount.addressC,
      true
    );

    await this.accountsService.activateAccount(result);

    onSuccess([selectedAccount.addressC]);
  };
}
