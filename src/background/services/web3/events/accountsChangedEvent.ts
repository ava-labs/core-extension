import { combineLatest, map, withLatestFrom, zip } from 'rxjs';
import { network$ } from '@avalabs/wallet-react-components';
import { getAccountsFromWallet } from '../../wallet/utils/getAccountsFromWallet';
import { walletInitializedFilter } from '../../wallet/utils/walletInitializedFilter';
import { wallet$ } from '@avalabs/wallet-react-components';
import { Web3Event } from './models';
import { permissions$ } from '../../permissions/permissions';
import { domainHasAccountsPermissions } from '../../permissions/utils/domainHasAccountPermissions';

export function accountsChangedEvents(domain?: string) {
  return combineLatest([
    wallet$.pipe(walletInitializedFilter()),
    network$,
  ]).pipe(
    withLatestFrom(permissions$),
    map(([[wallet], permissions]) => {
      const hasAccessTodApp =
        domain &&
        domainHasAccountsPermissions(wallet.getAddressC(), domain, permissions);

      return {
        params: hasAccessTodApp ? getAccountsFromWallet(wallet) : [],
        method: Web3Event.ACCOUNTS_CHANGED,
      };
    })
  );
}
