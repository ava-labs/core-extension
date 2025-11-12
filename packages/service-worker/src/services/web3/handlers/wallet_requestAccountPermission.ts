import {
  DAppProviderRequest,
  DAppRequestHandler,
  JsonRpcRequestParams,
  DEFERRED_RESPONSE,
  Action,
  ActionType,
} from '@core/types';
import { AccountsService } from '../../accounts/AccountsService';
import { injectable } from 'tsyringe';
import { PermissionsService } from '../../permissions/PermissionsService';
import { ethErrors } from 'eth-rpc-errors';
import { openApprovalWindow } from '~/runtime/openApprovalWindow';
import { NetworkVMType } from '@avalabs/vm-module-types';
import { getAddressByVMType } from '@core/common';
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

type Params =
  | {
      addressVM?: NetworkVMType;
      onlyIfTrusted?: boolean;
    }
  | undefined;

@injectable()
export class RequestAccountPermissionHandler
  implements DAppRequestHandler<Params>
{
  methods = [DAppProviderRequest.WALLET_CONNECT];

  constructor(
    private accountsService: AccountsService,
    private permissionsService: PermissionsService,
  ) {}

  async handleAuthenticated(
    rpcCall: JsonRpcRequestParams<DAppProviderRequest, Params>,
  ) {
    const { request } = rpcCall;

    const activeAccount = await this.accountsService.getActiveAccount();

    if (!activeAccount) {
      return {
        ...request,
        error: ethErrors.rpc.internal('wallet locked, undefined or malformed'),
      };
    }

    const address = getAddressByVMType(
      activeAccount,
      request.params?.addressVM ?? NetworkVMType.EVM,
    );

    if (!address) {
      return {
        ...request,
        error: ethErrors.rpc.internal(
          'The active account does not support the requested VM',
        ),
      };
    }

    return {
      ...request,
      result: [address],
    };
  }

  handleUnauthenticated = async (
    rpcCall: JsonRpcRequestParams<DAppProviderRequest, Params>,
  ) => {
    const { request, scope } = rpcCall;

    if (!request.site?.domain) {
      return {
        ...request,
        error: ethErrors.rpc.invalidRequest('Unspecified dApp domain'),
      };
    }

    if (request.params?.onlyIfTrusted) {
      return {
        ...request,
        error: ethErrors.provider.unauthorized(),
      };
    }

    await openApprovalWindow(
      {
        ...request,
        scope,
        type: ActionType.Single,
        displayData: {
          addressVM: request.params?.addressVM || NetworkVMType.EVM, // Default to EVM
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
    result: string | { id: string; enabled: boolean }[],
    onSuccess: (result: unknown) => Promise<void>,
    onError: (error: Error) => Promise<void>,
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
