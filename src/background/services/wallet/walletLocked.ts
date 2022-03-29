import {
  BehaviorSubject,
  EMPTY,
  filter,
  firstValueFrom,
  from,
  interval,
  map,
  Subject,
  switchMap,
} from 'rxjs';
import { onboardingStatus$ } from '../onboarding/onboardingFlows';
import { getMnemonicFromStorage, getPublicKeyFromStorage } from './storage';
import { clearWallet, wallet$ } from '@avalabs/wallet-react-components';
import { resolve } from '@src/utils/promiseResolver';
import {
  clearSessionStorage,
  getFromSessionStorage,
} from '@src/utils/storage/session-storage';
import { LOCK_TIMEOUT, SessionAuthData, SESSION_AUTH_DATA_KEY } from './models';

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
      const [encryptedMnemonic] = await resolve(getMnemonicFromStorage());
      const [encryptedPubKey] = await resolve(getPublicKeyFromStorage());
      const onboardingState = await firstValueFrom(onboardingStatus$);

      if (wallet) {
        return Promise.resolve({ locked: false });
      }

      if (
        onboardingState?.isOnBoarded &&
        (encryptedMnemonic || encryptedPubKey)
      ) {
        return Promise.resolve({ locked: true });
      }

      return EMPTY;
    })
  )
  .subscribe((state) => {
    state && walletLocked$.next(state as any);
  });

// Since intervals get suspended when the computer is in sleep mode,
// instead of starting a 12 hour interval, check every minute if it's time to lock
restartWalletLock$
  .pipe(
    switchMap(() =>
      from(getFromSessionStorage<SessionAuthData>(SESSION_AUTH_DATA_KEY)).pipe(
        map((data) => data?.loginTime || Date.now())
      )
    ),
    map((loginTime) => loginTime + LOCK_TIMEOUT), // get the timestamp when the wallet should lock itself
    switchMap((timeToLock) =>
      interval(1000 * 60).pipe(filter(() => Date.now() > timeToLock))
    )
  )
  .subscribe(() => lockWallet$.next(true));

lockWallet$.subscribe(() => {
  clearWallet();
  clearSessionStorage();
  wallet$.next(undefined);
});
