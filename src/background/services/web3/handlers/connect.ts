import { DAppProviderRequest } from '@src/background/connections/dAppConnection/models';
import { DappRequestHandler } from '@src/background/connections/models';
import { openExtensionNewWindow } from '@src/utils/extensionUtils';
import { filter, firstValueFrom, map, merge } from 'rxjs';
import { permissions$ } from '../../permissions/permissions';
import { domainHasAccountsPermissions } from '../../permissions/utils/domainHasAccountPermissions';
import { domainPermissionsExist } from '../../permissions/utils/domainPermissionsExist';
import { getAccountsFromWallet } from '../../wallet/utils/getAccountsFromWallet';
import { wallet$ } from '@avalabs/wallet-react-components';

/**
 * This is called when the user requests to connect the via dapp. We need
 * to popup the permissions window, get permissions for the given domain
 * and then respond accordingly.
 *
 * @param data the rpc request
 * @returns
 */

class ConnectRequestHandler implements DappRequestHandler {
  handleAuthenticated = async (request) => {
    const walletResult = await firstValueFrom(wallet$);

    if (!walletResult) {
      return {
        ...request,
        error: 'wallet locked, undefined or malformed',
      };
    }

    return {
      ...request,
      result: walletResult ? getAccountsFromWallet(walletResult) : [],
    };
  };

  handleUnauthenticated = async (request) => {
    const walletResult = await firstValueFrom(wallet$);

    if (!walletResult) {
      return {
        ...request,
        error: 'wallet locked, undefined or malformed',
      };
    }

    const window = await openExtensionNewWindow(
      `permissions`,
      `domainName=${request.site?.name}&domainUrl=${request.site?.domain}&domainIcon=${request.site?.icon}`,
      request.meta?.coords
    );

    /**
     * If the user updates permissions and then closes the window then the permissions are written and this
     * promise is resolved. If not and the window is closed before then the promise will also be resolved and
     * the consumer will be notified that the window closed prematurely
     */
    const permissionsSet = permissions$.pipe(
      filter(
        (currentPermissions) =>
          domainPermissionsExist(request.site?.domain, currentPermissions) &&
          domainHasAccountsPermissions(
            walletResult.getAddressC(),
            request.site?.domain,
            currentPermissions
          )
      ),
      map((hasPermissions) => ({
        ...request,
        result:
          hasPermissions && walletResult
            ? getAccountsFromWallet(walletResult)
            : [],
      }))
    );

    // detect if users closes the window and take it as a rejection
    const windowClosed = window.removed.pipe(
      map(() => ({
        ...request,
        error: 'window removed before permissions set',
      }))
    );

    return firstValueFrom(merge(permissionsSet, windowClosed));
  };
}

export const ConnectRequest: [DAppProviderRequest, DappRequestHandler] = [
  DAppProviderRequest.CONNECT_METHOD,
  new ConnectRequestHandler(),
];
