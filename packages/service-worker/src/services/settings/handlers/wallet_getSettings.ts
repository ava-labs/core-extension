import { NetworkContractToken } from '@avalabs/core-chains-sdk';
import { DAppProviderRequest, DAppRequestHandler } from '@core/types';
import { injectable } from 'tsyringe';
import { BalanceNotificationService } from '../../notifications/BalanceNotificationService';
import { NewsNotificationService } from '../../notifications/NewsNotificationService';
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
    | 'es-ES'
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
  showHighlightBanners: boolean;
  isQuickSwapsEnabled: boolean;
  feeSetting: 'low' | 'medium' | 'high';
  maxBuy: '1000' | '5000' | '10000' | '50000' | 'unlimited';
  privacyMode: boolean;
  filterSmallUtxos: boolean;
  isBridgeDevEnv: boolean;
  notificationSubscriptions: Record<string, boolean>;
}
@injectable()
export class WalletGetSettingsHandler extends DAppRequestHandler<
  [],
  WalletGetSettingsHandlerResult
> {
  methods = [DAppProviderRequest.WALLET_GET_SETTINGS];

  constructor(
    private settingsService: SettingsService,
    private balanceNotificationService: BalanceNotificationService,
    private newsNotificationService: NewsNotificationService,
  ) {
    super();
  }

  handleAuthenticated = async ({ request }) => {
    try {
      const settings = await this.settingsService.getSettings();
      const [balanceSubscriptionsResult, newsSubscriptionsResult] =
        await Promise.allSettled([
          this.balanceNotificationService.getSubscriptions(),
          this.newsNotificationService.getSubscriptions(),
        ]);

      const balanceSubscriptions =
        balanceSubscriptionsResult.status === 'fulfilled'
          ? balanceSubscriptionsResult.value
          : {};
      const newsSubscriptions =
        newsSubscriptionsResult.status === 'fulfilled'
          ? newsSubscriptionsResult.value
          : {};

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
        showHighlightBanners: settings.showHighlightBanners,
        isQuickSwapsEnabled: settings.isQuickSwapsEnabled,
        feeSetting: settings.feeSetting,
        maxBuy: settings.maxBuy,
        privacyMode: settings.privacyMode,
        filterSmallUtxos: settings.filterSmallUtxos,
        isBridgeDevEnv: settings.isBridgeDevEnv,
        notificationSubscriptions: {
          ...balanceSubscriptions,
          ...newsSubscriptions,
        },
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
