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
  TokensVisibility,
  CollectiblesVisibility,
} from '@core/types';
import { injectable } from 'tsyringe';
import { SettingsService } from '../SettingsService';
import { z } from 'zod';

type PartialSettings = Omit<SettingsState, 'customTokens'>;
type Params = [settings?: PartialSettings];

// Separate return type for the handler API response
export interface WalletSetSettingsResponse {
  currency: string;
  showTokensWithoutBalances: boolean;
  theme: ColorTheme;
  tokensVisibility: TokensVisibility;
  collectiblesVisibility: CollectiblesVisibility;
  analyticsConsent: AnalyticsConsent;
  language: Languages;
  coreAssistant: boolean;
  preferredView: ViewMode;
  showTrendingTokens: boolean;
}

const SettingsSchema = z.object({
  language: z.nativeEnum(Languages).optional(),
  currency: z.nativeEnum(CURRENCIES).optional(),
  analyticsConsent: z.nativeEnum(AnalyticsConsent).optional(),
  theme: z.enum(['LIGHT', 'DARK', 'SYSTEM']).optional(),
  preferredView: z.enum(['floating', 'sidebar']).optional(),
  showTokensWithoutBalances: z.boolean().optional(),
  coreAssistant: z.boolean().optional(),
  showTrendingTokens: z.boolean().optional(),
  tokensVisibility: z
    .record(z.string(), z.record(z.string(), z.boolean()))
    .optional(),
  collectiblesVisibility: z
    .record(z.string(), z.record(z.string(), z.boolean()))
    .optional(),
});

@injectable()
export class WalletSetSettingsHandler extends DAppRequestHandler<
  Params,
  WalletSetSettingsResponse
> {
  methods = [DAppProviderRequest.WALLET_SET_SETTINGS];

  constructor(private settingsService: SettingsService) {
    super();
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

      const validationResult = SettingsSchema.safeParse(newSettings);
      if (!validationResult.success) {
        const errorMessage = validationResult.error.errors
          .map((err) => `${err.path.join('.')}: ${err.message}`)
          .join(', ');
        throw new Error(`Invalid settings: ${errorMessage}`);
      }

      const validatedSettings = validationResult.data;

      // Update each setting individually using service methods
      if (validatedSettings.language !== undefined) {
        await this.settingsService.setLanguage(validatedSettings.language);
      }

      if (validatedSettings.currency !== undefined) {
        await this.settingsService.setCurrencty(validatedSettings.currency);
      }

      if (validatedSettings.showTokensWithoutBalances !== undefined) {
        await this.settingsService.setShowTokensWithNoBalance(
          validatedSettings.showTokensWithoutBalances,
        );
      }

      if (validatedSettings.theme !== undefined) {
        await this.settingsService.setTheme(validatedSettings.theme);
      }

      if (validatedSettings.tokensVisibility !== undefined) {
        await this.settingsService.setTokensVisibility(
          validatedSettings.tokensVisibility,
        );
      }

      if (validatedSettings.collectiblesVisibility !== undefined) {
        await this.settingsService.setCollectiblesVisibility(
          validatedSettings.collectiblesVisibility,
        );
      }

      if (validatedSettings.analyticsConsent !== undefined) {
        await this.settingsService.setAnalyticsConsent(
          validatedSettings.analyticsConsent === AnalyticsConsent.Approved,
        );
      }

      if (validatedSettings.coreAssistant !== undefined) {
        await this.settingsService.setCoreAssistant(
          validatedSettings.coreAssistant,
        );
      }

      if (validatedSettings.preferredView !== undefined) {
        await this.settingsService.setPreferredView(
          validatedSettings.preferredView,
        );
      }

      if (validatedSettings.showTrendingTokens !== undefined) {
        await this.settingsService.setShowTrendingTokens(
          validatedSettings.showTrendingTokens,
        );
      }

      // Get the final updated settings
      const finalSettings = await this.settingsService.getSettings();

      // Map internal state to API response (excluding customTokens)
      const response: WalletSetSettingsResponse = {
        currency: finalSettings.currency,
        showTokensWithoutBalances: finalSettings.showTokensWithoutBalances,
        theme: finalSettings.theme,
        tokensVisibility: finalSettings.tokensVisibility,
        collectiblesVisibility: finalSettings.collectiblesVisibility,
        analyticsConsent: finalSettings.analyticsConsent,
        language: finalSettings.language,
        coreAssistant: finalSettings.coreAssistant,
        preferredView: finalSettings.preferredView,
        showTrendingTokens: finalSettings.showTrendingTokens,
      };

      return {
        ...request,
        result: response,
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
