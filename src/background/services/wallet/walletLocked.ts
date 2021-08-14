import { formatAndLog } from '@src/background/utils/logging';
import {
  BehaviorSubject,
  concat,
  exhaustMap,
  filter,
  firstValueFrom,
  from,
  interval,
  map,
  merge,
  of,
  pairwise,
  Subject,
  switchMap,
} from 'rxjs';
import { onboardingFlow } from '../onboarding/onboardingFlows';
import { onboardingFromStorage } from '../onboarding/storage';
import { getMnemonicFromStorage } from './storage';
import { wallet } from './wallet';

export const mnemonicWalletUnlock = new Subject<{ mnemonic: string }>();
export const restartWalletLock = new Subject<boolean>();
/**
 * locked means:
 * IsOnboarded is false OR
 * 1. IsOnboarded is true
 * 2. A mnemonic is in storage
 * 3. There is no wallet instance
 */
export const walletLocked = new BehaviorSubject<
  { locked: boolean } | undefined
>(undefined);

from(onboardingFromStorage())
  .pipe(
    switchMap(async (state) => {
      if (!state.isOnBoarded) {
        return concat(of(state), onboardingFlow).pipe(
          map(() => ({ locked: true }))
        );
      }

      // only getting this as a precaution
      const encryptedMnemonic = getMnemonicFromStorage();

      if (!encryptedMnemonic) {
        // this is a problem, state got out of sync somehow. We should be pushing this to
        // some kind of analytics platform
      }

      // see if there is already a wallet instance if so that means its not locked
      const walletResult = await firstValueFrom(wallet);

      return merge(
        // immediately fir wallet state
        of({ locked: !walletResult }),
        // if this ever fires it means it was locked and we were waiting on user to unlock
        mnemonicWalletUnlock.pipe(map(() => ({ locked: false }))),
        // if this fires it means the wallet was initialized and now its not
        // this will happen if the logout timer kicks the wallet instance out
        wallet.pipe(
          pairwise(),
          filter(
            ([oldWalletState, newWalletState]) =>
              !!(oldWalletState && !newWalletState)
          ),
          map(() => ({ locked: true }))
        )
      );
    }),
    exhaustMap((result) => result)
  )
  .subscribe((state) => {
    formatAndLog('wallet locked state', state);
    walletLocked.next(state);
  });

const HOURS_12 = 1000 * 60 * 60 * 12;

merge(of({}), restartWalletLock)
  .pipe(switchMap(() => interval(HOURS_12)))
  .subscribe(() => wallet.next(undefined));
