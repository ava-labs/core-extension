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
import {
  getDappConnector,
  getLegacyDappConnector,
} from './utils/connectToDapp';

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
          // TODO: clean up domain* props for Legacy app
          domainName: request.site?.name,
          domainUrl: request.site?.domain,
          domainIcon: request.site?.icon,
          dappUrl: request.site?.url,
          dappIcon: request.site?.icon,
          dappDomain: request.site?.domain,
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
    const connectorArgs = {
      accountsService: this.accountsService,
      permissionsService: this.permissionsService,
      vm: pendingAction.params.addressVM || NetworkVMType.EVM,
    };
    const baseCallbackArgs = {
      pendingAction,
      onSuccess,
      onError,
    };

    if (Array.isArray(result)) {
      return getDappConnector(connectorArgs)({ ...baseCallbackArgs, result });
    }

    return getLegacyDappConnector(connectorArgs)({
      ...baseCallbackArgs,
      result,
    });
  };
}
