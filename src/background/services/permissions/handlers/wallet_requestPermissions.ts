import { DAppProviderRequest } from '@src/background/connections/dAppConnection/models';
import { DAppRequestHandler } from '@src/background/connections/models';
import { openExtensionNewWindow } from '@src/utils/extensionUtils';
import { firstValueFrom, map } from 'rxjs';
import { injectable } from 'tsyringe';
import { AccountsService } from '../../accounts/AccountsService';
import { PermissionsService } from '../PermissionsService';
import { getPermissionsConvertedToMetaMaskStructure } from '../utils/getPermissionsConvertedToMetaMaskStructure';

@injectable()
export class WalletRequestPermissionsHandler implements DAppRequestHandler {
  methods = [DAppProviderRequest.WALLET_PERMISSIONS];

  constructor(
    private permissionsService: PermissionsService,
    private accountsService: AccountsService
  ) {}

  handleUnauthenticated = async (request) => {
    const window = await openExtensionNewWindow(
      `permissions`,
      `domain=${request.site?.domain}`,
      request.meta?.coords
    );

    const currentPermissions = await this.permissionsService.getPermissions();

    /**
     * At this point the user has previously given permissions and we are possibly editing them
     * and/or adding more permissions.
     */
    await firstValueFrom(
      window.removed.pipe(
        map(() => currentPermissions[request.site?.domain || ''])
      )
    );

    return {
      ...request,
      result: getPermissionsConvertedToMetaMaskStructure(
        this.accountsService.activeAccount?.addressC,
        request.site?.domain,
        currentPermissions
      ),
    };
  };

  handleAuthenticated = async (request) => {
    return await this.handleUnauthenticated(request);
  };
}
