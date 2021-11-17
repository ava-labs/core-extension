import {
  ConnectionRequestHandler,
  ExtensionConnectionMessage,
  ExtensionRequest,
} from '@src/background/connections/models';
import { filter, firstValueFrom } from 'rxjs';
import { accounts$ } from '../accounts';
import { accounts$ as sdkAccount$ } from '@avalabs/wallet-react-components';

export async function getAccounts(request: ExtensionConnectionMessage) {
  const accounts = await firstValueFrom(accounts$);
  const sdkAccounts = await firstValueFrom(
    sdkAccount$.pipe(filter((acs) => !!(acs.length === accounts.length)))
  );

  const addressesIndexed = sdkAccounts.reduce((acc, { wallet, index }) => {
    return { ...acc, [index]: wallet.getAddressC() };
  }, {});

  return {
    ...request,
    result: accounts.map((acc) => ({
      ...acc,
      addressC: addressesIndexed[acc.index],
    })),
  };
}

export const GetAccountsRequest: [ExtensionRequest, ConnectionRequestHandler] =
  [ExtensionRequest.ACCOUNT_GET_ACCOUNTS, getAccounts];
