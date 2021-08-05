import { OnboardingPhase, OnboardingState } from './models';
import {
  Subject,
  firstValueFrom,
  from,
  concat,
  zip,
  take,
  tap,
  Observable,
} from 'rxjs';
import {
  onboardingPhase,
  onboardingFlow,
  setPassword,
  setOnboardingPhase,
  setMnemonic,
  setFinalized,
  mnemonic,
  setMnemonicConfirmed,
} from './onboardingFlows';
import { setMnemonicAndCreateWallet } from '../wallet/mnemonic';
import { onboardingFromStorage, removeOnboardingFromStorage } from './storage';
import { formatAndLog } from '@src/background/utils/logging';

const _onboarding = new Subject<OnboardingState>();
class OnboardingService {
  onboarding = concat(onboardingFromStorage(), _onboarding).pipe(
    tap((state) => {
      formatAndLog('onboarding state', state);
    })
  );

  phase = onboardingPhase;
  mnemonic = mnemonic;

  constructor() {
    const watchForOnboaridngFinalized = onboardingFlow.pipe(
      tap(([mnemonic, password]) => {
        setMnemonicAndCreateWallet(mnemonic, password);
        // walletService.createFromMnemonic(mnemonic);
        // saveToStorage({ [ONBOARDING_STORAGE_KEY]: { isOnBoarded: false } });
      })
    );

    /**
     * read from onboarding state, if the flow has been completed then
     * dont subscribe, otherwise subscribe and listen for wallet setup flow selection.
     * We probably need to check that wallet is setup complete as well. If it is not
     * and we have onboard as complete then we have bad state and need to redo the flow
     */
    firstValueFrom<OnboardingState>(this.onboarding).then((state) => {
      return (
        !state.isOnBoarded && firstValueFrom<any>(watchForOnboaridngFinalized)
      );
    });
  }

  async setPassword(password: string) {
    setPassword(password);
    setOnboardingPhase(OnboardingPhase.FINALIZE);
  }

  async setMnemonic(mnemonic: string) {
    setMnemonic(mnemonic);
    setOnboardingPhase(OnboardingPhase.PASSWORD);
  }

  setImportWallet() {
    setOnboardingPhase(OnboardingPhase.IMPORT_WALLET);
  }

  setCreateWallet(mnemonic: string) {
    setMnemonic(mnemonic);
    setOnboardingPhase(OnboardingPhase.CREATE_WALLET);
  }

  setMnemonicConfirmed() {
    setMnemonicConfirmed(true);
    setOnboardingPhase(OnboardingPhase.PASSWORD);
  }

  async setFinalized() {
    setFinalized(true);
  }

  async removeAll() {
    return removeOnboardingFromStorage();
  }
}

export const onboardingService = new OnboardingService();
