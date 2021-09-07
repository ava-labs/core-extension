import { BehaviorSubject, switchMap } from 'rxjs';
import { WalletLockedState, WalletState } from './models';
import { walletLocked$ } from './walletLocked';
import { walletState$ as walletStateSDK$ } from '@avalabs/wallet-react-components';

export const walletState$ = new BehaviorSubject<
  WalletState | WalletLockedState | undefined
>(undefined);

walletLocked$
  .pipe(
    switchMap((state) => {
      return state && state.locked
        ? Promise.resolve({ locked: true })
        : walletStateSDK$;
    })
  )
  .subscribe((state) => {
    walletState$.next(state);
  });
