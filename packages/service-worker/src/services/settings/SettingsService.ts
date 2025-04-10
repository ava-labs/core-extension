import { NetworkContractToken } from '@avalabs/core-chains-sdk';
import { OnLock, OnStorageReady } from '../../runtime/lifecycleCallbacks';
import { EventEmitter } from 'events';
import { singleton } from 'tsyringe';
import { NetworkService } from '../network/NetworkService';
import { StorageService } from '../storage/StorageService';
import { isTokenSupported } from '../tokens/utils/isTokenSupported';
import {
  Languages,
  SettingsEvents,
  SETTINGS_UNENCRYPTED_STORAGE_KEY,
  TokensVisibility,
  CollectiblesVisibility,
  AnalyticsConsent,
} from './models';
import { SettingsState, SETTINGS_STORAGE_KEY, ThemeVariant } from './models';
import { changeLanguage } from 'i18next';
import { EnsureDefined } from '../../models';

const DEFAULT_SETTINGS_STATE: SettingsState = {
  currency: 'USD',
  customTokens: {},
  showTokensWithoutBalances: false,
  theme: ThemeVariant.DARK,
  tokensVisibility: {},
  collectiblesVisibility: {},
  analyticsConsent: AnalyticsConsent.Approved,
  language: Languages.EN,
};

@singleton()
export class SettingsService implements OnStorageReady, OnLock {
  private eventEmitter = new EventEmitter();
  private _cachedSettings: SettingsState | null = null;
  private needToRetryFetch = false;

  constructor(
    private storageService: StorageService,
    private networkService: NetworkService,
  ) {
    this.networkService.uiActiveNetworkChanged.add(() => {
      this.applySettings();
    });
  }

  async onStorageReady(): Promise<void> {
    await this.applySettings();
  }

  onLock() {
    this._cachedSettings = null;
  }

  private async applySettings() {
    let settings: SettingsState;
    try {
      settings = await this.getSettings();
      changeLanguage(settings.language);
    } catch (_err) {
      return;
    }

    this.eventEmitter.emit(SettingsEvents.SETTINGS_UPDATED, settings);
  }

  async getSettings(): Promise<SettingsState> {
    if (this._cachedSettings && !this.needToRetryFetch) {
      return this._cachedSettings;
    }

    try {
      const state =
        await this.storageService.load<SettingsState>(SETTINGS_STORAGE_KEY);
      const unEncryptedState =
        await this.storageService.loadUnencrypted<SettingsState>(
          SETTINGS_UNENCRYPTED_STORAGE_KEY,
        );

      const settings = {
        ...DEFAULT_SETTINGS_STATE,
        ...unEncryptedState,
        ...state,
      };

      this.needToRetryFetch = false;
      this._cachedSettings = settings;

      return settings;
    } catch {
      this.needToRetryFetch = true;
      const unEncryptedState =
        await this.storageService.loadUnencrypted<SettingsState>(
          SETTINGS_UNENCRYPTED_STORAGE_KEY,
        );

      const settings = {
        ...DEFAULT_SETTINGS_STATE,
        ...unEncryptedState,
      };

      this._cachedSettings = settings;

      return settings;
    }
  }

  async addCustomToken(token: EnsureDefined<NetworkContractToken, 'chainId'>) {
    const settings = await this.getSettings();

    const network = await this.networkService.getNetwork(token.chainId);

    if (!network) {
      throw new Error('Unable to detect current network selection.');
    }

    const tokenAlreadyExists = await isTokenSupported(
      token.address,
      network,
      settings,
    );

    if (tokenAlreadyExists) {
      throw new Error('Token already exists in the wallet.');
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

  async setAnalyticsConsent(approved: boolean) {
    const settings = await this.getSettings();
    await this.saveSettings({
      ...settings,
      analyticsConsent: approved
        ? AnalyticsConsent.Approved
        : AnalyticsConsent.Denied,
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

  async setCollectiblesVisibility(visibility: CollectiblesVisibility) {
    const settings = await this.getSettings();
    await this.saveSettings({
      ...settings,
      collectiblesVisibility: visibility,
    });
  }

  async setLanguage(language: Languages) {
    changeLanguage(language);
    const settings = await this.getSettings();
    const newSettings = {
      ...settings,
      language,
    };
    await this.saveSettings(newSettings);
  }

  private async saveSettings(state: SettingsState) {
    const language = state.language;
    await this.storageService.saveUnencrypted(
      SETTINGS_UNENCRYPTED_STORAGE_KEY,
      {
        language: state.language,
      },
    );
    try {
      await this.storageService.save(SETTINGS_STORAGE_KEY, state);
      this._cachedSettings = state;
      this.eventEmitter.emit(SettingsEvents.SETTINGS_UPDATED, state);
    } catch {
      this._cachedSettings = {
        ...this._cachedSettings,
        language,
      } as SettingsState;
      this.eventEmitter.emit(SettingsEvents.SETTINGS_UPDATED, { language });
    }
  }

  addListener(event: SettingsEvents, callback: (data: unknown) => void) {
    this.eventEmitter.on(event, callback);
  }
}
