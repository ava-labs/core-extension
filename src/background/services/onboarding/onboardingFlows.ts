import { ContextContainer } from '@src/hooks/useIsSpecificContextContainer';
import { isDevelopment } from '@src/utils/isDevelopment';
import { formatAndLog, toLogger } from '@src/utils/logging';
import { saveToSessionStorage } from '@src/utils/storage/session-storage';
import { combineLatest, EMPTY, BehaviorSubject, merge, Observable } from 'rxjs';
import { take, map, switchMap, filter, tap } from 'rxjs/operators';
import nacl from 'tweetnacl';
import { browser } from 'webextension-polyfill-ts';
import { initialAccountName$ } from '../accounts/accounts';
import { setPublicKeyAndCreateWallet } from '../ledger/ledger';
import { setMnemonicAndCreateWallet } from '../wallet/mnemonic';
import { SessionAuthData, SESSION_AUTH_DATA_KEY } from '../wallet/models';
import { storageKey$ } from '../wallet/storageKey';
import { OnboardingPhase, OnboardingState } from './models';
import {
  getOnboardingFromStorage,
  saveOnboardingToStorage,
  saveReImportStateToStorage,
} from './storage';

export const onboardingStatus$ = new BehaviorSubject<
  OnboardingState | undefined
>(undefined);

getOnboardingFromStorage().then((onboarding) => {
  if (onboarding.reImportMnemonic) {
    // Reopen onboarding flow after the the user hit the "forgot password flow"
    // Need to open the page here since the extension gets reset after
    // wiping it's storage as the first step to ensure a clean state.
    browser.tabs.create({ url: ContextContainer.HOME });
    saveReImportStateToStorage(false);
  }
  onboardingStatus$.next(onboarding);
});

export const onboardingMnemonic$ = new BehaviorSubject<string>('');
export const onboardingPassword$ = new BehaviorSubject<string>('');
export const onboardingAccountName$ = new BehaviorSubject<string>('');
export const onboardingFinalized$ = new BehaviorSubject<boolean>(false);
export const onboardingPublicKey$ = new BehaviorSubject<string>('');
export const onboardingCurrentPhase$ = new BehaviorSubject<
  OnboardingPhase | undefined
>(undefined);

function resetStates() {
  onboardingMnemonic$.next('');
  onboardingPassword$.next('');
  onboardingAccountName$.next('Account 1');
  onboardingFinalized$.next(false);
  onboardingCurrentPhase$.next(undefined);
  onboardingPublicKey$.next('');
}

// Make sure logs are disabled for production releases to prevent logging sensitive information
const showLogs = isDevelopment();
/**
 * After they choose what type of wallet they want to setup
 * we cancel the last flow and start listening to the new one
 */
export const onboardingFlow = onboardingCurrentPhase$
  .pipe(
    filter(
      (phase) =>
        phase === OnboardingPhase.CREATE_WALLET ||
        phase === OnboardingPhase.IMPORT_WALLET ||
        phase === OnboardingPhase.LEDGER ||
        phase === OnboardingPhase.RESTART
    ),
    tap((phase) => {
      phase === OnboardingPhase.RESTART && resetStates();
    }),
    switchMap((phase) => {
      return OnboardingPhase.RESTART === phase
        ? EMPTY
        : combineLatest([
            merge(
              onboardingMnemonic$.pipe(
                filter((res) => !!res),
                toLogger<string>('mnemonic onboarding set', showLogs),
                map((mnemonic) => ({ mnemonic }))
              ),
              (onboardingPublicKey$ as any).pipe(
                filter((res) => !!res),
                toLogger<string>('public key onboarding set', showLogs),
                map((pubKey) => ({ pubKey }))
              )
            ) as Observable<{ mnemonic?: string; pubKey?: string }>,
            onboardingPassword$.pipe(
              toLogger<string>('password onboarding set', showLogs)
            ),
            onboardingAccountName$.pipe(
              toLogger<string>('account name onboarding set', showLogs)
            ),
            onboardingFinalized$.pipe(
              toLogger<boolean | undefined>(
                'finalized onboarding set',
                showLogs
              )
            ),
          ]);
    }),
    filter((results) => results.every((val) => !!val)),
    take(1),

    switchMap(async ([secret, password, accountName]) => {
      const { mnemonic, pubKey } = secret;
      const storageKey = Buffer.from(nacl.box.keyPair().secretKey).toString(
        'hex'
      );
      mnemonic
        ? setMnemonicAndCreateWallet(mnemonic, password, storageKey)
        : pubKey && setPublicKeyAndCreateWallet(pubKey, password, storageKey);
      await saveOnboardingToStorage(true);
      const sessionData: SessionAuthData = {
        password,
        loginTime: Date.now(),
      };
      await saveToSessionStorage(SESSION_AUTH_DATA_KEY, sessionData);
      storageKey$.next(storageKey); // set storage key so the app can load data from and to the storage
      onboardingStatus$.next({ isOnBoarded: true, initialOpen: true });
      initialAccountName$.next(accountName);
    })
  )
  .subscribe(() => {
    formatAndLog('onboarding flow finalized', true);
    onboardingCurrentPhase$.next(OnboardingPhase.FINALIZE);
    resetStates();
  });
