import { NetworkContractToken } from '@avalabs/core-chains-sdk';
import {
  DAppRequestHandler,
  DAppProviderRequest,
  ColorTheme,
  TokensVisibility,
  CollectiblesVisibility,
  AnalyticsConsent,
  Languages,
  ViewMode,
} from '@core/types';
import { injectable } from 'tsyringe';
import { SettingsService } from '../SettingsService';

type CustomTokens = {
  [networkCaipId: string]: {
    [tokenAddress: string]: NetworkContractToken;
  };
};

interface WalletGetSettingsHandlerResult {
  currency: string;
  customTokens: CustomTokens;
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
@injectable()
export class WalletGetSettingsHandler extends DAppRequestHandler<
  [],
  WalletGetSettingsHandlerResult
> {
  methods = [DAppProviderRequest.WALLET_GET_SETTINGS];

  constructor(private settingsService: SettingsService) {
    super();
  }

  handleAuthenticated = async ({ request }) => {
    try {
      const settings = await this.settingsService.getSettings();
      return {
        ...request,
        result: {
          currency: settings.currency,
          customTokens: settings.customTokens,
          showTokensWithoutBalances: settings.showTokensWithoutBalances,
          theme: settings.theme,
          tokensVisibility: settings.tokensVisibility,
          collectiblesVisibility: settings.collectiblesVisibility,
          analyticsConsent: settings.analyticsConsent,
          language: settings.language,
          coreAssistant: settings.coreAssistant,
          preferredView: settings.preferredView,
          showTrendingTokens: settings.showTrendingTokens,
        },
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
