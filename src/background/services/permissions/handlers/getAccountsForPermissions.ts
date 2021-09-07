import {
  ConnectionRequestHandler,
  ExtensionConnectionMessage,
  ExtensionRequest,
} from '@src/background/connections/models';
import { firstValueFrom } from 'rxjs';
import { getAccountsFromWallet } from '../../wallet/utils/getAccountsFromWallet';
import { wallet$ } from '@avalabs/wallet-react-components';

export async function getAccountsForPermissions(
  request: ExtensionConnectionMessage
) {
  const walletResult = await firstValueFrom(wallet$);

  if (!walletResult) {
    return {
      ...request,
      error: 'wallet locked or malformed',
    };
  }

  return {
    ...request,
    result: getAccountsFromWallet(walletResult),
  };
}

export const GetAccountsForPermissionsRequest: [
  ExtensionRequest,
  ConnectionRequestHandler
] = [ExtensionRequest.PERMISSIONS_GET_ACCOUNTS, getAccountsForPermissions];
