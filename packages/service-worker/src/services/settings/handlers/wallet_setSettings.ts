import {
  DAppRequestHandler,
  DAppProviderRequest,
  JsonRpcRequestParams,
  SettingsState,
  Languages,
  CURRENCIES,
  AnalyticsConsent,
  ColorTheme,
  ViewMode,
} from '@core/types';
import { injectable } from 'tsyringe';
import { SettingsService } from '../SettingsService';

type PartialSettings = Omit<SettingsState, 'customTokens'>;
type Params = [settings?: PartialSettings];

@injectable()
export class WalletSetSettingsHandler extends DAppRequestHandler<
  Params,
  SettingsState
> {
  methods = [DAppProviderRequest.WALLET_SET_SETTINGS];

  constructor(private settingsService: SettingsService) {
    super();
  }

  private validateSettings(settings: PartialSettings): {
    valid: boolean;
    error?: string;
  } {
    // Validate language if provided
    if (settings.language !== undefined) {
      const availableLanguages = Object.values(Languages);
      if (!availableLanguages.includes(settings.language)) {
        return { valid: false, error: 'Invalid language parameter' };
      }
    }

    // Validate currency if provided
    if (settings.currency !== undefined) {
      const availableCurrencies = Object.values(CURRENCIES);
      if (!availableCurrencies.includes(settings.currency as CURRENCIES)) {
        return { valid: false, error: 'Invalid currency parameter' };
      }
    }

    // Validate analyticsConsent if provided
    if (settings.analyticsConsent !== undefined) {
      const validConsents = Object.values(AnalyticsConsent);
      if (!validConsents.includes(settings.analyticsConsent)) {
        return { valid: false, error: 'Invalid analyticsConsent parameter' };
      }
    }

    // Validate theme if provided
    if (settings.theme !== undefined) {
      const validThemes = ['LIGHT', 'DARK', 'SYSTEM'] as ColorTheme[];
      if (!validThemes.includes(settings.theme)) {
        return { valid: false, error: 'Invalid theme parameter' };
      }
    }

    // Validate preferredView if provided
    if (settings.preferredView !== undefined) {
      const validViews = ['floating', 'sidebar'] as ViewMode[];
      if (!validViews.includes(settings.preferredView)) {
        return { valid: false, error: 'Invalid preferredView parameter' };
      }
    }

    // Validate showTokensWithoutBalances if provided
    if (
      settings.showTokensWithoutBalances !== undefined &&
      typeof settings.showTokensWithoutBalances !== 'boolean'
    ) {
      return {
        valid: false,
        error: 'Invalid showTokensWithoutBalances parameter',
      };
    }

    // Validate coreAssistant if provided
    if (
      settings.coreAssistant !== undefined &&
      typeof settings.coreAssistant !== 'boolean'
    ) {
      return { valid: false, error: 'Invalid coreAssistant parameter' };
    }

    // Validate showTrendingTokens if provided
    if (
      settings.showTrendingTokens !== undefined &&
      typeof settings.showTrendingTokens !== 'boolean'
    ) {
      return { valid: false, error: 'Invalid showTrendingTokens parameter' };
    }

    return { valid: true };
  }

  handleAuthenticated = async (
    rpcCall: JsonRpcRequestParams<DAppProviderRequest, Params>,
  ) => {
    const { request } = rpcCall;

    try {
      const [newSettings] = request.params || [];

      if (!newSettings || Object.keys(newSettings).length === 0) {
        throw new Error('No settings provided');
      }

      // Validate the settings
      const validation = this.validateSettings(newSettings);
      if (!validation.valid) {
        throw new Error(validation.error);
      }

      // Update each setting individually using service methods
      if (newSettings.language !== undefined) {
        await this.settingsService.setLanguage(newSettings.language);
      }

      if (newSettings.currency !== undefined) {
        await this.settingsService.setCurrencty(newSettings.currency);
      }

      if (newSettings.showTokensWithoutBalances !== undefined) {
        await this.settingsService.setShowTokensWithNoBalance(
          newSettings.showTokensWithoutBalances,
        );
      }

      if (newSettings.theme !== undefined) {
        await this.settingsService.setTheme(newSettings.theme);
      }

      if (newSettings.tokensVisibility !== undefined) {
        await this.settingsService.setTokensVisibility(
          newSettings.tokensVisibility,
        );
      }

      if (newSettings.collectiblesVisibility !== undefined) {
        await this.settingsService.setCollectiblesVisibility(
          newSettings.collectiblesVisibility,
        );
      }

      if (newSettings.analyticsConsent !== undefined) {
        await this.settingsService.setAnalyticsConsent(
          newSettings.analyticsConsent === AnalyticsConsent.Approved,
        );
      }

      if (newSettings.coreAssistant !== undefined) {
        await this.settingsService.setCoreAssistant(newSettings.coreAssistant);
      }

      if (newSettings.preferredView !== undefined) {
        await this.settingsService.setPreferredView(newSettings.preferredView);
      }

      if (newSettings.showTrendingTokens !== undefined) {
        await this.settingsService.setShowTrendingTokens(
          newSettings.showTrendingTokens,
        );
      }

      // Get the final updated settings
      const finalSettings = await this.settingsService.getSettings();

      return {
        ...request,
        result: finalSettings,
      };
    } catch (e: any) {
      return {
        ...request,
        error: e.toString(),
      };
    }
  };

  handleUnauthenticated = ({ request }) => {
    return {
      ...request,
      error: 'account not connected',
    };
  };
}
