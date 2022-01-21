import {
  ConnectionRequestHandler,
  ExtensionConnectionMessage,
  ExtensionRequest,
} from '@src/background/connections/models';
import { resolve } from '@src/utils/promiseResolver';
import { saveAccountsToStorage } from '../storage';
import { firstValueFrom } from 'rxjs';
import { accounts$ } from '../accounts';

export async function renameAccount(request: ExtensionConnectionMessage) {
  const [index, name] = request.params || [];

  if (index === undefined) {
    return {
      ...request,
      error: 'account index missing in params',
    };
  }

  if (!name) {
    return {
      ...request,
      error: 'account name missing in params',
    };
  }

  const accounts = await firstValueFrom(accounts$);

  if (index >= accounts.length) {
    return {
      ...request,
      error: 'account not added',
    };
  }

  accounts[index].name = name;

  accounts$.next(accounts);
  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  const [_, err] = await resolve(saveAccountsToStorage(accounts));

  return {
    ...request,
    result: 'success',
  };
}

export const RenameAccountRequest: [
  ExtensionRequest,
  ConnectionRequestHandler
] = [ExtensionRequest.ACCOUNT_RENAME, renameAccount];
