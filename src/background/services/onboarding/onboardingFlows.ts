import { Subject, combineLatest, from, EMPTY } from 'rxjs';
import { take, map, switchMap, filter, tap } from 'rxjs/operators';
import { setMnemonicAndCreateWallet } from '../wallet/mnemonic';
import { OnboardingPhase } from './models';
import { saveOnboardingToStorage } from './storage';

export const onboardingMnemonic = new Subject<string>();
export const onboardingPassword = new Subject<string>();
export const onboardingFinalized = new Subject<boolean>();
export const onboardingCurrentPhase = new Subject<OnboardingPhase>();

/**
 * After they choose what type of wallet they want to setup
 * we cancel the last flow and start listening to the new one
 */
export const onboardingFlow = onboardingCurrentPhase.pipe(
  filter(
    (phase) =>
      phase === OnboardingPhase.CREATE_WALLET ||
      phase === OnboardingPhase.IMPORT_WALLET ||
      phase === OnboardingPhase.RESTART
  ),
  switchMap((phase) => {
    return OnboardingPhase.RESTART === phase
      ? EMPTY
      : combineLatest([
          onboardingMnemonic,
          onboardingPassword,
          onboardingFinalized,
        ]);
  }),
  map(([mnemonic, password]) => {
    return [mnemonic, password];
  }),
  take(1),
  switchMap(async ([mnemonic, password]) => {
    setMnemonicAndCreateWallet(mnemonic, password);
    await from(saveOnboardingToStorage(true));
    return { isOnBoarded: true };
  })
);
