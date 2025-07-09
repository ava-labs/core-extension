import {
  Action,
  DAppProviderRequest,
  DAppRequestHandler,
  DEFERRED_RESPONSE,
} from '@core/types';
import { injectable } from 'tsyringe';
import { AccountsService } from '../../accounts/AccountsService';
import { PermissionsService } from '../PermissionsService';
import { getPermissionsConvertedToMetaMaskStructure } from '../utils/getPermissionsConvertedToMetaMaskStructure';
import { ethErrors } from 'eth-rpc-errors';
import { openApprovalWindow } from '../../../runtime/openApprovalWindow';
import { NetworkVMType } from '@avalabs/vm-module-types';

@injectable()
export class WalletRequestPermissionsHandler extends DAppRequestHandler {
  methods = [DAppProviderRequest.WALLET_PERMISSIONS];

  constructor(
    private permissionsService: PermissionsService,
    private accountsService: AccountsService,
  ) {
    super();
  }

  handleUnauthenticated = async (rpcCall) => {
    const { request } = rpcCall;

    await openApprovalWindow(
      {
        ...request,
        displayData: {
          domainName: request.site?.name,
          domainUrl: request.site?.domain,
          domainIcon: request.site?.icon,
        },
      },
      `permissions`,
    );

    return { ...request, result: DEFERRED_RESPONSE };
  };

  handleAuthenticated = async (rpcCall) => {
    return await this.handleUnauthenticated(rpcCall);
  };

  onActionApproved = async (
    pendingAction: Action,
    result: any,
    onSuccess: (result: unknown) => void,
    onError: (error: Error) => void,
  ) => {
    const selectedAccount = await this.accountsService.getAccountByID(result);
    if (!selectedAccount) {
      onError(ethErrors.rpc.internal('Selected account not found'));
      return;
    }

    if (!pendingAction.site?.domain) {
      onError(ethErrors.rpc.internal('Domain not set'));
      return;
    }

    const currentPermissions = await this.permissionsService.grantPermission(
      pendingAction.site.domain,
      selectedAccount.addressC,
      NetworkVMType.EVM,
    );

    await this.accountsService.activateAccount(result);

    onSuccess(
      getPermissionsConvertedToMetaMaskStructure(
        selectedAccount.addressC,
        pendingAction.site.domain,
        currentPermissions,
      ),
    );
  };
}
