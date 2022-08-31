import { DAppRequestHandler } from '@src/background/connections/dAppConnection/DAppRequestHandler';
import { DAppProviderRequest } from '@src/background/connections/dAppConnection/models';
import { DEFERRED_RESPONSE } from '@src/background/connections/middlewares/models';
import { injectable } from 'tsyringe';
import { AccountsService } from '../../accounts/AccountsService';
import { Action } from '../../actions/models';
import { PermissionsService } from '../PermissionsService';
import { getPermissionsConvertedToMetaMaskStructure } from '../utils/getPermissionsConvertedToMetaMaskStructure';

@injectable()
export class WalletRequestPermissionsHandler extends DAppRequestHandler {
  methods = [DAppProviderRequest.WALLET_PERMISSIONS];

  constructor(
    private permissionsService: PermissionsService,
    private accountsService: AccountsService
  ) {
    super();
  }

  handleUnauthenticated = async (request) => {
    await this.openApprovalWindow(
      request,
      `permissions?domain=${request.site?.domain}`
    );

    return { ...request, result: DEFERRED_RESPONSE };
  };

  handleAuthenticated = async (request) => {
    return await this.handleUnauthenticated(request);
  };

  onActionApproved = async (
    pendingAction: Action,
    result: any,
    onSuccess: (result: unknown) => void
  ) => {
    const currentPermissions = await this.permissionsService.getPermissions();
    onSuccess({
      ...pendingAction,
      result: getPermissionsConvertedToMetaMaskStructure(
        this.accountsService.activeAccount?.addressC,
        pendingAction.site?.domain,
        currentPermissions
      ),
    });
  };
}
