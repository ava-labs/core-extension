import {
  ConnectionRequestHandler,
  ExtensionConnectionMessage,
  ExtensionRequest,
} from '@src/background/connections/models';
import { firstValueFrom } from 'rxjs';
import { getAccountsFromWallet } from '../../wallet/utils/getAccountsFromWallet';
import { wallet$, accounts$ } from '@avalabs/wallet-react-components';
import { Account } from '../../accounts/models';

export async function getAccountsForPermissions(
  request: ExtensionConnectionMessage
) {
  const allAccounts = await firstValueFrom(accounts$);
  const walletResult = await firstValueFrom(wallet$);

  if (!allAccounts) {
    return {
      ...request,
      error: 'accounts missing or malformed',
    };
  }

  if (!walletResult) {
    return {
      ...request,
      error: 'wallet undefined or malformed',
    };
  }

  return {
    ...request,
    result:
      allAccounts.map((account) => {
        return {
          index: account.index,
          /**
           * We want to use address c instead of name since address C wont change, but
           * the names can be changed
           */
          name: account.wallet.getAddressC(),
          /** the UI keeps track of which is selected so this request doesnt care */
          active: false,
        } as Account;
      }) ??
      getAccountsFromWallet(walletResult).map((accountAddC) => {
        return {
          index: 0,
          name: accountAddC,
          active: true,
        };
      }),
  };
}

export const GetAccountsForPermissionsRequest: [
  ExtensionRequest,
  ConnectionRequestHandler
] = [ExtensionRequest.PERMISSIONS_GET_ACCOUNTS, getAccountsForPermissions];
