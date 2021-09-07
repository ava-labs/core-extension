import {
  BehaviorSubject,
  EMPTY,
  firstValueFrom,
  interval,
  merge,
  of,
  Subject,
  switchMap,
} from 'rxjs';
import { onboardingStatus$ } from '../onboarding/onboardingFlows';
import { getMnemonicFromStorage } from './storage';
import { wallet$ } from '@avalabs/wallet-react-components';

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

merge(of({}), restartWalletLock$)
  .pipe(switchMap(() => interval(HOURS_12)))
  .subscribe(() => wallet$.next(undefined));

lockWallet$.subscribe(() => wallet$.next(undefined));
