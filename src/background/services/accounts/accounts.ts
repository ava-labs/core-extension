import {
  accounts$ as sdkAccount$,
  addAccount as addAccountSDK,
} from '@avalabs/wallet-react-components';
import { BehaviorSubject, firstValueFrom } from 'rxjs';
import { addAccount } from './handlers/addAccount';
import { selectAccount } from './handlers/selectAccount';
import { Account } from './models';
import { getAccountsFromStorage } from './storage';

export const accounts$ = new BehaviorSubject<Account[]>([]);

// stores the name of the first account when no accounts are created at all
// the onboarding flow updates this value to the user selected one
export const initialAccountName$ = new BehaviorSubject<string>('Account 1');

getAccountsFromStorage().then((values) => {
  accounts$.next(values?.accounts || []);
});

export async function initAccounts() {
  const sdkAccounts = await firstValueFrom(sdkAccount$);
  const accounts = await firstValueFrom(accounts$);
  const initialAccountName = await firstValueFrom(initialAccountName$);

  // create first account after initialization
  if (accounts.length === 0) {
    await addAccount(initialAccountName);
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
