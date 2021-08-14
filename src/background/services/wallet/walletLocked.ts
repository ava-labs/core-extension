import { formatAndLog } from '@src/background/utils/logging';
import {
  BehaviorSubject,
  concat,
  exhaustMap,
  filter,
  firstValueFrom,
  from,
  map,
  merge,
  of,
  pairwise,
  shareReplay,
  Subject,
  switchMap,
  tap,
} from 'rxjs';
import { onboardingFlow } from '../onboarding/onboardingFlows';
import { onboardingFromStorage } from '../onboarding/storage';
import { getMnemonicFromStorage } from './storage';
import { wallet } from './wallet';

export const mnemonicWalletUnlock = new Subject<{ mnemonic: string }>();

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

      const encryptedMnemonic = getMnemonicFromStorage();
      formatAndLog(
        `wallet locked (${
          !!encryptedMnemonic ? `mnemonic is in storage` : `no mnemonic found`
        })`,
        !!encryptedMnemonic
      );
      if (!encryptedMnemonic) {
        // this is a problem, state got out of sync somehow. We should be pushing this to
        // some kind of analytics platform
      }

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
