import { NetworkContractToken } from '@avalabs/core-chains-sdk';
import {
  AnalyticsConsent,
  CollectiblesVisibility,
  ColorTheme,
  CURRENCIES,
  EnsureDefined,
  FeatureGates,
  FeeSetting,
  Languages,
  MaxBuyOption,
  SETTINGS_STORAGE_KEY,
  SETTINGS_UNENCRYPTED_STORAGE_KEY,
  SettingsEvents,
  SettingsState,
  TokensVisibility,
  ViewMode,
} from '@core/types';
import { EventEmitter } from 'events';
import { changeLanguage } from 'i18next';
import { singleton } from 'tsyringe';
import { OnLock, OnStorageReady } from '../../runtime/lifecycleCallbacks';
import { FeatureFlagService } from '../featureFlags/FeatureFlagService';
import { NetworkService } from '../network/NetworkService';
import { StorageService } from '../storage/StorageService';
import { isTokenSupported } from '../tokens/utils/isTokenSupported';

const DEFAULT_SETTINGS_STATE: SettingsState = {
  currency: 'USD',
  customTokens: {},
  showTokensWithoutBalances: false,
  theme: 'SYSTEM',
  tokensVisibility: {},
  collectiblesVisibility: {},
  analyticsConsent: AnalyticsConsent.Approved,
  language: Languages.EN,
  coreAssistant: true,
  preferredView: 'floating',
  showTrendingTokens: false,
  isQuickSwapsEnabled: false,
  feeSetting: 'medium',
  maxBuy: 'unlimited',
  privacyMode: false,
  filterSmallUtxos: true,
};

@singleton()
export class SettingsService implements OnStorageReady, OnLock {
  private eventEmitter = new EventEmitter();
  private _cachedSettings: SettingsState | null = null;
  private needToRetryFetch = false;

  constructor(
    private storageService: StorageService,
    private networkService: NetworkService,
    private featureFlagService: FeatureFlagService,
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
      let settingsToReturn = this._cachedSettings;
      // If language feature flag is disabled, force English even for cached settings
      if (!this.featureFlagService.featureFlags[FeatureGates.LANGUAGES]) {
        settingsToReturn = {
          ...settingsToReturn,
          language: Languages.EN,
        };
      }
      // If balance service integration feature flag is disabled, force USD even for cached settings
      if (
        !this.featureFlagService.featureFlags[
          FeatureGates.BALANCE_SERVICE_INTEGRATION
        ]
      ) {
        settingsToReturn = {
          ...settingsToReturn,
          currency: CURRENCIES.USD,
        };
      }
      return settingsToReturn;
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

      // If language feature flag is disabled, force English
      if (!this.featureFlagService.featureFlags[FeatureGates.LANGUAGES]) {
        settings.language = Languages.EN;
      }

      // If balance service integration feature flag is disabled, force USD
      if (
        !this.featureFlagService.featureFlags[
          FeatureGates.BALANCE_SERVICE_INTEGRATION
        ]
      ) {
        settings.currency = CURRENCIES.USD;
      }

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

      // If language feature flag is disabled, force English
      if (!this.featureFlagService.featureFlags[FeatureGates.LANGUAGES]) {
        settings.language = Languages.EN;
      }

      // If balance service integration feature flag is disabled, force USD
      if (
        !this.featureFlagService.featureFlags[
          FeatureGates.BALANCE_SERVICE_INTEGRATION
        ]
      ) {
        settings.currency = CURRENCIES.USD;
      }

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

  async setCurrency(currency: string) {
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

  async setTheme(theme: ColorTheme) {
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

  async getTokensVisibility() {
    const settings = await this.getSettings();
    return settings.tokensVisibility;
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
    const newSettings: SettingsState = {
      ...settings,
      language,
    };
    await this.saveSettings(newSettings);
  }

  async setCoreAssistant(state: boolean) {
    const settings = await this.getSettings();
    await this.saveSettings({
      ...settings,
      coreAssistant: state,
    });
  }

  async setPreferredView(viewMode: ViewMode) {
    const settings = await this.getSettings();
    await this.saveSettings({
      ...settings,
      preferredView: viewMode,
    });
  }

  async setShowTrendingTokens(show: boolean) {
    const settings = await this.getSettings();
    await this.saveSettings({
      ...settings,
      showTrendingTokens: show,
    });
  }

  async setQuickSwapsEnabled(enabled: boolean) {
    const settings = await this.getSettings();
    await this.saveSettings({
      ...settings,
      isQuickSwapsEnabled: enabled,
    });
  }

  async setFeeSetting(feeSetting: FeeSetting) {
    const settings = await this.getSettings();
    await this.saveSettings({
      ...settings,
      feeSetting,
    });
  }

  async setMaxBuy(maxBuy: MaxBuyOption) {
    const settings = await this.getSettings();
    await this.saveSettings({
      ...settings,
      maxBuy,
    });
  }

  async setPrivacyMode(enabled: boolean) {
    const settings = await this.getSettings();
    await this.saveSettings({
      ...settings,
      privacyMode: enabled,
    });
  }

  async setFilterSmallUtxos(filter: boolean) {
    const settings = await this.getSettings();
    await this.saveSettings({
      ...settings,
      filterSmallUtxos: filter,
    });
  }

  private async saveSettings(state: SettingsState) {
    const { language, preferredView, ...encryptedState } = state;
    const unencryptedState = {
      language,
      preferredView,
    };
    await this.storageService.saveUnencrypted(
      SETTINGS_UNENCRYPTED_STORAGE_KEY,
      unencryptedState,
    );
    try {
      await this.storageService.save(SETTINGS_STORAGE_KEY, encryptedState);
      this._cachedSettings = state;
      this.eventEmitter.emit(SettingsEvents.SETTINGS_UPDATED, state);
    } catch {
      this._cachedSettings = {
        ...this._cachedSettings,
        ...unencryptedState,
      } as SettingsState;
      this.eventEmitter.emit(SettingsEvents.SETTINGS_UPDATED, unencryptedState);
    }
  }

  addListener<T>(event: SettingsEvents, callback: (data: T) => void) {
    this.eventEmitter.on(event, callback);
  }
}
