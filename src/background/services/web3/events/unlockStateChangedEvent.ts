import { firstValueFrom, switchMap } from 'rxjs';
import { getAccountsFromWallet } from '../../wallet/utils/getAccountsFromWallet';
import { wallet$ } from '@avalabs/wallet-react-components';
import { walletLocked$ } from '../../wallet/walletLocked';
import { Web3Event } from './models';

export function unlockStateChangedEvents() {
  return walletLocked$.pipe(
    switchMap(async (lockedState) => {
      const isUnlocked = lockedState?.locked;
      const wallet = await firstValueFrom(wallet$);

      const accounts =
        isUnlocked && wallet ? getAccountsFromWallet(wallet) : [];

      return {
        method: Web3Event.UNLOCK_STATE_CHANGED,
        params: {
          isUnlocked,
          ...(isUnlocked ? { accounts } : {}),
        },
      };
    })
  );
}
