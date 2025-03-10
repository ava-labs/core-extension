import {
  DAppProviderRequest,
  JsonRpcRequestParams,
} from '@src/background/connections/dAppConnection/models';
import { AccountsService } from '../../accounts/AccountsService';
import { injectable } from 'tsyringe';
import { DEFERRED_RESPONSE } from '@src/background/connections/middlewares/models';
import { PermissionsService } from '../../permissions/PermissionsService';
import { ethErrors } from 'eth-rpc-errors';
import { Action, ActionType } from '../../actions/models';
import { DAppRequestHandler } from '@src/background/connections/dAppConnection/DAppRequestHandler';
import { openApprovalWindow } from '@src/background/runtime/openApprovalWindow';
import { NetworkVMType } from '@avalabs/vm-module-types';
import { getAddressByVMType } from '@src/utils/address';

/**
 * This is called when the user requests to connect the via dapp. We need
 * to popup the permissions window, get permissions for the given domain
 * and then respond accordingly.
 *
 * @param data the rpc request
 * @returns
 */

type Params = {
  addressVM?: NetworkVMType;
  onlyIfTrusted?: boolean;
};

@injectable()
export class ConnectRequestHandler implements DAppRequestHandler<Params> {
  methods = [
    DAppProviderRequest.CONNECT_METHOD,
    DAppProviderRequest.WALLET_CONNECT,
  ];

  constructor(
    private accountsService: AccountsService,
    private permissionsService: PermissionsService,
  ) {}

  async handleAuthenticated(
    rpcCall: JsonRpcRequestParams<DAppProviderRequest, Params>,
  ) {
    const { request } = rpcCall;

    if (!this.accountsService.activeAccount) {
      return {
        ...request,
        error: ethErrors.rpc.internal('wallet locked, undefined or malformed'),
      };
    }

    const address = getAddressByVMType(
      this.accountsService.activeAccount,
      request.params.addressVM ?? NetworkVMType.EVM,
    );

    if (!address) {
      return {
        ...request,
        error: ethErrors.rpc.internal(
          'The selected account does not support the selected VM',
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
        error: ethErrors.rpc.invalidRequest('domain unknown'),
      };
    }

    if (request.params.onlyIfTrusted) {
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
          addressVM: request.params.addressVM || NetworkVMType.EVM, // Default to EVM
          domainName: request.site?.name,
          domainUrl: request.site?.domain,
          domainIcon: request.site?.icon,
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
    const vm = pendingAction.params.addressVM;
    const selectedAccount = this.accountsService.getAccountByID(result);

    if (!selectedAccount) {
      onError(ethErrors.rpc.internal('Selected account not found'));
      return;
    }

    if (!pendingAction?.site?.domain) {
      onError(ethErrors.rpc.internal('Domain not set'));
      return;
    }

    const address = getAddressByVMType(selectedAccount, vm);

    if (!address) {
      onError(
        ethErrors.rpc.internal(
          'The selected account does not support the selected VM',
        ),
      );
      return;
    }

    // The site was already approved
    // We usually get here when an already approved site attempts to connect and the extension was locked
    if (
      this.accountsService.activeAccount?.id === result &&
      (await this.permissionsService.hasDomainPermissionForAccount(
        pendingAction.site.domain,
        address,
      ))
    ) {
      onSuccess([address]);
      return;
    }

    await this.permissionsService.setAccountPermissionForDomain(
      pendingAction.site.domain,
      address,
      vm,
      true,
    );

    await this.accountsService.activateAccount(result);

    if (!address) {
      onError(
        ethErrors.rpc.internal(
          'The active account does not support the selected VM',
        ),
      );
      return;
    }

    onSuccess([address]);
  };
}
