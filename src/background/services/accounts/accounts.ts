import {
  accounts$ as sdkAccount$,
  addAccount as addAccountSDK,
  wallet$,
} from '@avalabs/wallet-react-components';
import { BehaviorSubject, filter, firstValueFrom } from 'rxjs';
import { addAccount } from './handlers/addAccount';
import { selectAccount } from './handlers/selectAccount';
import { Account } from './models';
import { getAccountsFromStorage } from './storage';

export const accounts$ = new BehaviorSubject<Account[]>([]);

getAccountsFromStorage().then((values) => {
  accounts$.next(values?.accounts || []);
});

export async function initAccounts() {
  const sdkAccounts = await firstValueFrom(sdkAccount$);
  const accounts = await firstValueFrom(accounts$);

  // create first account after initialization
  if (accounts.length === 0) {
    await addAccount();
    await selectAccount(0);
    return;
  }

  // add missing accounts
  for (let i = sdkAccounts.length; i < accounts.length; i++) {
    addAccountSDK();
  }

  // activate account
  const activeIndex = accounts.find((a) => a.active)?.index || 0;
  await selectAccount(activeIndex);
}
