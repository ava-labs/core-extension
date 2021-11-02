import {
  ConnectionRequestHandler,
  ExtensionConnectionMessage,
  ExtensionRequest,
} from '@src/background/connections/models';
import { firstValueFrom } from 'rxjs';
import { accounts$ } from '../accounts';

export async function getAccounts(request: ExtensionConnectionMessage) {
  const result = await firstValueFrom(accounts$);

  return {
    ...request,
    result,
  };
}

export const GetAccountsRequest: [ExtensionRequest, ConnectionRequestHandler] =
  [ExtensionRequest.ACCOUNT_GET_ACCOUNTS, getAccounts];
