import { ContextContainer } from '@src/hooks/useIsSpecificContextContainer';
import { EventEmitter } from 'events';
import { singleton } from 'tsyringe';
import browser from 'webextension-polyfill';
import { StorageService } from '../storage/StorageService';
import {
  OnboardingState,
  OnboardingEvents,
  ONBOARDING_STORAGE_KEY,
} from '@core/types';

/**
 * !!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!
 * Onboarding data is not encrypted in storage to provide a quicker onboarding experience
 * DO NOT STORE ANYTHING REMOTELY SENSITIVE DATA
 * IF THE DATA MODIFIED BY AN ATTACKER WILL CAUSE ANY ISSUES, DO NOT STORE IT HERE
 * !!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!
 */

const defaultState: OnboardingState = {
  isOnBoarded: false,
  reImportMnemonic: false,
  initialOpen: true,
};

@singleton()
export class OnboardingService {
  private eventEmitter = new EventEmitter();

  constructor(private storageService: StorageService) {}

  async activate() {
    const state = await this.loadFromStorage();
    if (state.reImportMnemonic) {
      // Reopen onboarding flow after the the user hit the "forgot password flow"
      // Need to open the page here since the extension gets reset after
      // wiping it's storage as the first step to ensure a clean state.
      browser.tabs.create({ url: ContextContainer.HOME });
      this.setReImportState(false);
    }
  }

  async getState() {
    return await this.loadFromStorage();
  }

  async setReImportState(reImportMnemonic: boolean) {
    const state = {
      ...defaultState,
      reImportMnemonic,
    };
    await this.storageService.saveUnencrypted(ONBOARDING_STORAGE_KEY, {
      ...state,
    });
  }

  async setInitialOpen(isInitialOpen: boolean) {
    const state = {
      ...defaultState,
      ...(await this.getState()),
      initialOpen: isInitialOpen,
    };
    await this.storageService.saveUnencrypted(ONBOARDING_STORAGE_KEY, {
      ...state,
    });
  }

  async setIsOnboarded(isOnBoarded: boolean) {
    const state = {
      ...defaultState,
      ...(await this.getState()),
      isOnBoarded: isOnBoarded,
    };
    await this.storageService.saveUnencrypted(ONBOARDING_STORAGE_KEY, {
      ...state,
    });
    this.eventEmitter.emit(OnboardingEvents.ONBOARDING_UPDATED_EVENT, state);
  }

  private async loadFromStorage(): Promise<OnboardingState> {
    const state = await this.storageService.loadUnencrypted<OnboardingState>(
      ONBOARDING_STORAGE_KEY,
    );
    return state || defaultState;
  }

  addListener(event: OnboardingEvents, callback: (data: unknown) => void) {
    this.eventEmitter.on(event, callback);
  }
}
