import {
  DAppProviderRequest,
  DAppRequestHandler,
  DEFERRED_RESPONSE,
  Action,
} from '@core/types';
import { AccountsService } from '../../accounts/AccountsService';
import { injectable } from 'tsyringe';
import { PermissionsService } from '../../permissions/PermissionsService';
import { ethErrors } from 'eth-rpc-errors';
import { openApprovalWindow } from '~/runtime/openApprovalWindow';
import { NetworkVMType } from '@avalabs/vm-module-types';

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
    private permissionsService: PermissionsService,
  ) {}

  async handleAuthenticated(rpcCall) {
    const { request } = rpcCall;

    const activeAccount = await this.accountsService.getActiveAccount();

    if (!activeAccount) {
      return {
        ...request,
        error: ethErrors.rpc.internal('wallet locked, undefined or malformed'),
      };
    }

    return {
      ...request,
      result: [activeAccount.addressC],
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
          addressVM: NetworkVMType.EVM,
          domainName: request.site?.name,
          domainUrl: request.site?.domain,
          domainIcon: request.site?.icon,
          dappUrl: request.site?.url,
          dappIcon: request.site?.icon,
        },
      },
      `permissions`,
    );

    return { ...request, result: DEFERRED_RESPONSE };
  };

  onActionApproved = async (
    pendingAction: Action,
    result,
    onSuccess,
    onError,
  ) => {
    const selectedAccount = await this.accountsService.getAccountByID(result);

    if (!selectedAccount) {
      onError(ethErrors.rpc.internal('Selected account not found'));
      return;
    }

    if (!pendingAction?.site?.domain) {
      onError(ethErrors.rpc.internal('Domain not set'));
      return;
    }

    const activeAccount = await this.accountsService.getActiveAccount();
    // The site was already approved
    // We usually get here when an already approved site attempts to connect and the extension was locked
    if (
      activeAccount &&
      activeAccount.id === result &&
      (await this.permissionsService.hasDomainPermissionForAccount(
        pendingAction.site.domain,
        activeAccount,
      ))
    ) {
      onSuccess([selectedAccount.addressC]);
      return;
    }

    await this.permissionsService.grantPermission(
      pendingAction.site.domain,
      selectedAccount.addressC,
      NetworkVMType.EVM,
    );

    await this.accountsService.activateAccount(result);

    onSuccess([selectedAccount.addressC]);
  };
}
