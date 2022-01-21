import { wallet$ } from '@avalabs/wallet-react-components';
import { DAppProviderRequest } from '@src/background/connections/dAppConnection/models';
import { DappRequestHandler } from '@src/background/connections/models';
import { openExtensionNewWindow } from '@src/utils/extensionUtils';
import { firstValueFrom, map } from 'rxjs';
import { permissions$ } from '../../permissions/permissions';
import { getPermissionsConvertedToMetaMaskStructure } from '../../permissions/utils/getPermissionsConvertedToMetaMaskStructure';

class WalletRequestPermissionsHandler implements DappRequestHandler {
  handleUnauthenticated = async (request) => {
    const window = await openExtensionNewWindow(
      `permissions`,
      `domain=${request.site?.domain}`,
      request.meta?.coords
    );

    const currentPermissions = await firstValueFrom(permissions$);
    const walletResult = await firstValueFrom(wallet$);

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
        walletResult?.getAddressC() as string,
        request.site?.domain,
        currentPermissions
      ),
    };
  };

  handleAuthenticated = async (request) => {
    return await this.handleUnauthenticated(request);
  };
}

export const WalletPermissionsRequest: [
  DAppProviderRequest,
  DappRequestHandler
] = [
  DAppProviderRequest.WALLET_PERMISSIONS,
  new WalletRequestPermissionsHandler(),
];
