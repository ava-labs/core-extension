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
    const vm = pendingAction.params.addressVM || NetworkVMType.EVM;
    const selectedAccount = await this.accountsService.getAccountByID(result);

    if (!selectedAccount) {
      onError(ethErrors.rpc.internal('Selected account not found'));
      return;
    }

    if (!pendingAction?.site?.domain) {
      onError(ethErrors.rpc.internal('Unspecified dApp domain'));
      return;
    }

    const address = getAddressByVMType(selectedAccount, vm);

    if (!address) {
      onError(
        ethErrors.rpc.internal(
          'The active account does not support the requested VM',
        ),
      );
      return;
    }

    const activeAccount = await this.accountsService.getActiveAccount();
    // The site was already approved
    // We usually get here when an already approved site attempts to connect
    // and the extension was locked in the meantime
    if (
      activeAccount &&
      activeAccount.id === result &&
      (await this.permissionsService.hasDomainPermissionForAccount(
        pendingAction.site.domain,
        activeAccount,
        vm,
      ))
    ) {
      onSuccess([address]);
      return;
    }

    await this.permissionsService.grantPermission(
      pendingAction.site.domain,
      address,
      vm,
    );

    await this.accountsService.activateAccount(result);

    onSuccess([address]);
  };
}
