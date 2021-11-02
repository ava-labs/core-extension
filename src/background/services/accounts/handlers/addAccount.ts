import {
  ConnectionRequestHandler,
  ExtensionConnectionMessage,
  ExtensionRequest,
} from '@src/background/connections/models';
import { addAccount as addAccountSDK } from '@avalabs/wallet-react-components';
import { resolve } from '@src/utils/promiseResolver';
import { saveAccountsToStorage } from '../storage';
import { firstValueFrom } from 'rxjs';
import { accounts$ } from '../accounts';

export async function addAccount() {
  const accounts = await firstValueFrom(accounts$);

  const newAccount = addAccountSDK();
  accounts.push({
    index: newAccount.index,
    name: `Account ${newAccount.index + 1}`,
    active: false,
  });

  accounts$.next(accounts);
  const [_, err] = await resolve(saveAccountsToStorage(accounts));

  return {
    result: 'success',
  };
}

async function addAccountHandler(request: ExtensionConnectionMessage) {
  const result = await addAccount();
  return { ...request, ...result };
}

export const AddAccountRequest: [ExtensionRequest, ConnectionRequestHandler] = [
  ExtensionRequest.ACCOUNT_ADD,
  addAccountHandler,
];
