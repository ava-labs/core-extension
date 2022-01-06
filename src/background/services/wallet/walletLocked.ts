import {
  BehaviorSubject,
  EMPTY,
  filter,
  firstValueFrom,
  interval,
  map,
  startWith,
  Subject,
  switchMap,
} from 'rxjs';
import { onboardingStatus$ } from '../onboarding/onboardingFlows';
import { getMnemonicFromStorage } from './storage';
import { clearMnemonic, wallet$ } from '@avalabs/wallet-react-components';

export const restartWalletLock$ = new Subject<boolean>();
export const lockWallet$ = new Subject<boolean>();

/**
 * locked means:
 * 1. IsOnboarded is true
 * 2. A mnemonic is in storage
 * 3. There is no wallet instance
 */
export const walletLocked$ = new BehaviorSubject<
  { locked: boolean } | undefined
>(undefined);

wallet$
  .pipe(
    switchMap(async (wallet) => {
      const encryptedMnemonic = await getMnemonicFromStorage();
      const onboardingState = await firstValueFrom(onboardingStatus$);

      if (wallet) {
        return Promise.resolve({ locked: false });
      }

      if (onboardingState?.isOnBoarded && encryptedMnemonic) {
        return Promise.resolve({ locked: true });
      }

      return EMPTY;
    })
  )
  .subscribe((state) => {
    state && walletLocked$.next(state as any);
  });

const HOURS_12 = 1000 * 60 * 60 * 12;
// Since intervals get suspended when the computer is in sleep mode,
// instead of starting a 12 hour interval, check every minute if it's time to lock
restartWalletLock$
  .pipe(
    startWith({}),
    map(() => Date.now() + HOURS_12), // get the timestamp when the wallet should lock itself
    switchMap((timeToLock) =>
      interval(1000 * 60).pipe(filter(() => Date.now() > timeToLock))
    )
  )
  .subscribe(() => lockWallet$.next(true));

lockWallet$.subscribe(() => {
  clearMnemonic();
  wallet$.next(undefined);
});
