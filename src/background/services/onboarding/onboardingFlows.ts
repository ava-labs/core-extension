import { Subject, combineLatest } from 'rxjs';
import { exhaustMap, shareReplay, take, tap, map } from 'rxjs/operators';
import { OnboardingPhase } from './models';

const _mnemonic = new Subject<string>();
const _mnemonicCache = _mnemonic.pipe(shareReplay());

const cacheSubscription = _mnemonicCache.subscribe();
const _mnemonicConfirmed = new Subject<boolean>();
const _password = new Subject<string>();
const _finalized = new Subject<boolean>();
const _onboardingPhase = new Subject<OnboardingPhase>();

const onboardingFlowWalletCreation = combineLatest([
  _mnemonicCache,
  _mnemonicConfirmed,
  _password,
  _finalized,
]).pipe(
  map(([mnemonic, _confirmed, password]) => {
    return [mnemonic, password];
  })
);

const onboardingFlowWalletImport = combineLatest([
  _mnemonicCache,
  _password,
  _finalized,
]).pipe(
  map(([mnemonic, password]) => {
    return [mnemonic, password];
  })
);

/**
 * After they choose what type of wallet they want to setup
 * we cancel the last flow and start listening to the new one
 */
export const onboardingFlow = _onboardingPhase.pipe(
  exhaustMap((phase) => {
    return phase === OnboardingPhase.CREATE_WALLET
      ? onboardingFlowWalletCreation
      : onboardingFlowWalletImport;
  }),
  take(1),
  tap(() => cacheSubscription.unsubscribe())
);

export function setMnemonic(mnemonic: string) {
  _mnemonic.next(mnemonic);
}

export function setMnemonicConfirmed(confirmed: boolean) {
  _mnemonicConfirmed.next(confirmed);
}

export function setPassword(pass: string) {
  _password.next(pass);
}

export function setFinalized(finalized: boolean) {
  _finalized.next(finalized);
}

export function setOnboardingPhase(phase: OnboardingPhase) {
  _onboardingPhase.next(phase);
}

export const onboardingPhase = _onboardingPhase.asObservable();
export const mnemonic = _mnemonicCache;
