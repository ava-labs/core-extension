import { map } from 'rxjs';
import { AccountsEvents } from './models';
import { accounts$ } from '@src/background/services/accounts/accounts';

export function accountsUpdateEvents() {
  // test comment
  return accounts$.pipe(
    map((accounts) => {
      return {
        name: AccountsEvents.ACCOUNTS_UPDATE_EVENT,
        value: accounts,
      };
    })
  );
}
