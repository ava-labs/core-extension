import { DAppProviderRequest } from '@src/background/connections/dAppConnection/models';
import {
  ConnectionRequestHandler,
  ExtensionConnectionMessage,
} from '@src/background/connections/models';
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
export async function connect(data: ExtensionConnectionMessage) {
  const walletResult = await firstValueFrom(wallet$);

  if (!walletResult) {
    return {
      ...data,
      error: 'wallet locked, undefined or malformed',
    };
  }

  const permissions = await firstValueFrom(permissions$);

  if (domainHasAccountsPermissions(data.site?.domain, permissions)) {
    return {
      ...data,
      result: walletResult ? getAccountsFromWallet(walletResult) : [],
    };
  }

  const window = await openExtensionNewWindow(
    `permissions`,
    `domain=${data.site?.domain}`,
    data.meta?.coords
  );
  /**
   * If the user updates permissions and then closes the window then the permissions are written and this
   * promise is resolved. If not and the window is closed before then the promise will also be resolved and
   * the consumer will be notified that the window closed prematurely
   */
  const permissionsSet = permissions$.pipe(
    filter(
      (currentPermissions) =>
        domainPermissionsExist(data.site?.domain, currentPermissions) &&
        domainHasAccountsPermissions(data.site?.domain, currentPermissions)
    ),
    map((hasPermissions) => ({
      ...data,
      result:
        hasPermissions && walletResult
          ? getAccountsFromWallet(walletResult)
          : [],
    }))
  );

  const windowClosed = window.removed.pipe(
    map(() => ({
      ...data,
      error: 'window removed before permissions set',
    }))
  );

  return firstValueFrom(merge(permissionsSet, windowClosed));
}

export const ConnectRequest: [DAppProviderRequest, ConnectionRequestHandler] = [
  DAppProviderRequest.CONNECT_METHOD,
  connect,
];
