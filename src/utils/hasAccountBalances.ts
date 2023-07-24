import { Account } from '@src/background/services/accounts/models';
import { Balances } from '@src/background/services/balances/models';

export function hasAccountBalances(balances: Balances, account: Account) {
  return Object.values(balances).some((item) => {
    if (!item) {
      return false;
    }
    const addresses = Object.keys(item);
    return (
      addresses.includes(account.addressC) ||
      addresses.includes(account.addressBTC)
    );
  });
}
