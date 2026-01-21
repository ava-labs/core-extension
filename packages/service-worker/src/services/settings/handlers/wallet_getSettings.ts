import { NetworkContractToken } from '@avalabs/core-chains-sdk';
import { DAppRequestHandler, DAppProviderRequest } from '@core/types';
import { injectable } from 'tsyringe';
import { SettingsService } from '../SettingsService';

type Currency = 'USD' | 'EUR' | 'GBP' | 'AUD' | 'CAD' | 'CHF' | 'HKD';

interface WalletGetSettingsHandlerResult {
  currency: Currency;
  customTokens: {
    [networkCaipId: string]: {
      [tokenAddress: string]: NetworkContractToken;
    };
  };
  showTokensWithoutBalances: boolean;
  theme: 'DARK' | 'LIGHT' | 'SYSTEM';
  tokensVisibility: {
    [networkCaipId: string]: {
      [tokenAddress: string]: boolean;
    };
  };
  collectiblesVisibility: {
    [networkCaipId: string]: {
      [tokenAddress: string]: boolean;
    };
  };
  analyticsConsent: 'pending' | 'approved' | 'denied';
  language:
    | 'en'
    | 'de-DE'
    | 'es-EM'
    | 'fr-FR'
    | 'ja-JP'
    | 'hi-IN'
    | 'ko-KR'
    | 'ru-RU'
    | 'tr-TR'
    | 'zh-CN'
    | 'zh-TW';
  coreAssistant: boolean;
  preferredView: 'floating' | 'sidebar';
  showTrendingTokens: boolean;
  isDegenMode: boolean;
  feeSetting: 'low' | 'medium' | 'high';
  maxBuy: '1000' | '5000' | '10000' | '50000' | 'unlimited';
  privacyMode: boolean;
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
      const response: WalletGetSettingsHandlerResult = {
        customTokens: settings.customTokens,
        currency: settings.currency as Currency,
        showTokensWithoutBalances: settings.showTokensWithoutBalances,
        theme: settings.theme,
        tokensVisibility: settings.tokensVisibility,
        collectiblesVisibility: settings.collectiblesVisibility,
        analyticsConsent: settings.analyticsConsent,
        language: settings.language,
        coreAssistant: settings.coreAssistant,
        preferredView: settings.preferredView,
        showTrendingTokens: settings.showTrendingTokens,
        isDegenMode: settings.isDegenMode,
        feeSetting: settings.feeSetting,
        maxBuy: settings.maxBuy,
        privacyMode: settings.privacyMode,
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
