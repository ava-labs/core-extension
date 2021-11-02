import {
  ConnectionRequestHandler,
  ExtensionConnectionMessage,
  ExtensionRequest,
} from '@src/background/connections/models';
import { activateAccount } from '@avalabs/wallet-react-components';
import { resolve } from '@src/utils/promiseResolver';
import { saveAccountsToStorage } from '../storage';
import { firstValueFrom } from 'rxjs';
import { accounts$ } from '../accounts';

export async function selectAccount(selectedIndex?: number) {
  if (selectedIndex === undefined) {
    return {
      error: 'account index missing in params',
    };
  }

  let accounts = await firstValueFrom(accounts$);

  if (selectedIndex >= accounts.length) {
    return {
      error: 'account not added',
    };
  }

  await activateAccount(selectedIndex);

  accounts = accounts.map((a) => ({
    ...a,
    active: a.index === selectedIndex,
  }));

  accounts$.next(accounts);
  const [_, err] = await resolve(saveAccountsToStorage(accounts));

  return {
    result: 'success',
  };
}

async function selectAccountHandler(
  request: ExtensionConnectionMessage<number>
) {
  const selectedIndex = request.params?.pop();
  const result = await selectAccount(selectedIndex);
  return { ...request, ...result };
}

export const SelectAccountRequest: [
  ExtensionRequest,
  ConnectionRequestHandler
] = [ExtensionRequest.ACCOUNT_SELECT, selectAccountHandler];
