import { DAppProviderRequest } from '@src/background/connections/dAppConnection/models';
import {
  ConnectionRequestHandler,
  ExtensionConnectionMessage,
} from '@src/background/connections/models';
import { firstValueFrom } from 'rxjs';
import { permissions$ } from '../../permissions/permissions';
import { getPermissionsConvertedToMetaMaskStructure } from '../../permissions/utils/getPermissionsConvertedToMetaMaskStructure';

export async function wallet_getPermissions(data: ExtensionConnectionMessage) {
  const currentPermissions = await firstValueFrom(permissions$);

  return {
    ...data,
    result: getPermissionsConvertedToMetaMaskStructure(
      data.domain!,
      currentPermissions
    ),
  };
}

export const WalletGetPermissionsRequest: [
  DAppProviderRequest,
  ConnectionRequestHandler
] = [DAppProviderRequest.WALLET_GET_PERMISSIONS, wallet_getPermissions];
