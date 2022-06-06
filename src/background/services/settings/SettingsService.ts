import { NetworkContractToken } from '@avalabs/chains-sdk';
import { OnStorageReady } from '@src/background/runtime/lifecycleCallbacks';
import { EventEmitter } from 'events';
import { singleton } from 'tsyringe';
import { NetworkService } from '../network/NetworkService';
import { StorageService } from '../storage/StorageService';
import { SettingsEvents, TokensVisibility } from './models';
import { SettingsState, SETTINGS_STORAGE_KEY, ThemeVariant } from './models';

const DEFAULT_SETTINGS_STATE: SettingsState = {
  currency: 'USD',
  customTokens: {},
  showTokensWithoutBalances: false,
  theme: ThemeVariant.DARK,
  tokensVisibility: {},
  isDefaultExtension: false,
  analyticsConsent: true,
};

@singleton()
export class SettingsService implements OnStorageReady {
  private eventEmitter = new EventEmitter();
  constructor(
    private storageService: StorageService,
    private networkService: NetworkService
  ) {
    this.applySettings();
    this.networkService.activeNetwork.add(() => {
      this.applySettings();
    });
  }

  onStorageReady(): void {
    this.applySettings();
  }

  private async applySettings() {
    let settings: SettingsState;
    try {
      settings = await this.getSettings();
    } catch (e) {
      return;
    }

    this.eventEmitter.emit(SettingsEvents.SETTINGS_UPDATED, settings);
  }

  async getSettings(): Promise<SettingsState> {
    const state = await this.storageService.load<SettingsState>(
      SETTINGS_STORAGE_KEY
    );

    return {
      ...DEFAULT_SETTINGS_STATE,
      ...state,
    };
  }

  async addCustomToken(token: NetworkContractToken) {
    const network = await this.networkService.activeNetwork.promisify();
    if (!network?.tokens) {
      throw new Error('No ERC20 tokens found in wallet.');
    }
    const tokenAlreadyExists = network.tokens.reduce(
      (exists, existingToken) =>
        exists ||
        existingToken.address.toLowerCase() === token.address.toLowerCase(),
      false
    );
    const settings = await this.getSettings();

    if (
      tokenAlreadyExists ||
      settings.customTokens?.[network.chainId]?.[token.address.toLowerCase()]
    ) {
      throw new Error('Token already exists in the wallet.');
    }

    if (!network?.chainId) {
      throw new Error('Unable to detect current network selection.');
    }

    const newSettings: SettingsState = {
      ...settings,
      customTokens: {
        ...settings.customTokens,
        [network?.chainId]: {
          ...settings.customTokens[network?.chainId],
          [token.address.toLowerCase()]: token,
        },
      },
    };
    await this.saveSettings(newSettings);
  }

  async setAnalyticsConsent(consent: boolean) {
    const settings = await this.getSettings();
    await this.saveSettings({
      ...settings,
      analyticsConsent: !!consent,
    });
  }

  async toggleIsDefaultExtension() {
    const settings = await this.getSettings();
    await this.saveSettings({
      ...settings,
      isDefaultExtension: !settings.isDefaultExtension,
    });
  }

  async setCurrencty(currency: string) {
    const settings = await this.getSettings();

    await this.saveSettings({
      ...settings,
      currency,
    });
  }

  async setShowTokensWithNoBalance(show: boolean) {
    const settings = await this.getSettings();
    await this.saveSettings({
      ...settings,
      showTokensWithoutBalances: show,
    });
  }

  async setTheme(theme: ThemeVariant) {
    const settings = await this.getSettings();
    await this.saveSettings({
      ...settings,
      theme,
    });
  }

  async setTokensVisibility(visibility: TokensVisibility) {
    const settings = await this.getSettings();
    await this.saveSettings({
      ...settings,
      tokensVisibility: visibility,
    });
  }

  private async saveSettings(state: SettingsState) {
    await this.storageService.save(SETTINGS_STORAGE_KEY, state);
    this.eventEmitter.emit(SettingsEvents.SETTINGS_UPDATED, state);
  }

  addListener(event: SettingsEvents, callback: (data: unknown) => void) {
    this.eventEmitter.on(event, callback);
  }
}
