import {
  ConnectionRequestHandler,
  ExtensionConnectionMessage,
  ExtensionRequest,
} from '@src/background/connections/models';
import { firstValueFrom } from 'rxjs';
import { getAccountsFromWallet } from '../../wallet/utils/getAccountsFromWallet';
import { wallet } from '../../wallet/wallet';
import { permissions } from '../permissions';

export async function getAccountsForPermissions(
  request: ExtensionConnectionMessage
) {
  const walletResult = await firstValueFrom(wallet);

  if (!walletResult) {
    return {
      ...request,
      error: new Error('wallet locked or malformed'),
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
