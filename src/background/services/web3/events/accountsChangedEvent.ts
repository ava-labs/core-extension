import { combineLatest, map, tap } from 'rxjs';
import { network$ } from '@avalabs/wallet-react-components';
import { getAccountsFromWallet } from '../../wallet/utils/getAccountsFromWallet';
import { walletInitializedFilter } from '../../wallet/utils/walletInitializedFilter';
import { wallet$ } from '@avalabs/wallet-react-components';
import { Web3Event } from './models';

export function accountsChangedEvents() {
  return combineLatest([
    wallet$.pipe(walletInitializedFilter()),
    network$,
  ]).pipe(
    map(([wallet]) => {
      return {
        params: getAccountsFromWallet(wallet),
        method: Web3Event.ACCOUNTS_CHANGED,
      };
    })
  );
}
