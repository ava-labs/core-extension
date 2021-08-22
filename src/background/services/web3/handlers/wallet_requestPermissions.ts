import { DAppProviderRequest } from '@src/background/connections/dAppConnection/models';
import {
  ConnectionRequestHandler,
  ExtensionConnectionMessage,
} from '@src/background/connections/models';
import { openExtensionNewWindow } from '@src/utils/extensionUtils';
import { firstValueFrom, map } from 'rxjs';
import { permissions$ } from '../../permissions/permissions';
import { getPermissionsConvertedToMetaMaskStructure } from '../../permissions/utils/getPermissionsConvertedToMetaMaskStructure';

export async function wallet_requestPermissions(
  data: ExtensionConnectionMessage
) {
  const window = await openExtensionNewWindow(
    `permissions`,
    `domain=${data.domain}`
  );

  const currentPermissions = await firstValueFrom(permissions$);

  /**
   * At this point the user has previously given permissions and we are possibly editing them
   * and/or adding more permissions.
   */
  await firstValueFrom(
    window.removed.pipe(map(() => currentPermissions[data.domain!]))
  );

  return {
    ...data,
    result: getPermissionsConvertedToMetaMaskStructure(
      data.domain!,
      currentPermissions
    ),
  };
}

export const WalletPermissionsRequest: [
  DAppProviderRequest,
  ConnectionRequestHandler
] = [DAppProviderRequest.WALLET_PERMISSIONS, wallet_requestPermissions];
