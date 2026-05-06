import {
  AnalyticsConsent,
  BalanceNotificationTypes,
  CURRENCIES,
  DAppProviderRequest,
  DAppRequestHandler,
  JsonRpcRequestParams,
  Languages,
  NewsNotificationTypes,
} from '@core/types';
import { ethErrors } from 'eth-rpc-errors';
import { injectable } from 'tsyringe';
import { z } from 'zod';
import { BalanceNotificationService } from '../../notifications/BalanceNotificationService';
import { NewsNotificationService } from '../../notifications/NewsNotificationService';
import { SettingsService } from '../SettingsService';

const SettingsSchema = z.object({
  language: z.nativeEnum(Languages).optional(),
  currency: z.nativeEnum(CURRENCIES).optional(),
  analyticsConsent: z.nativeEnum(AnalyticsConsent).optional(),
  theme: z.enum(['LIGHT', 'DARK', 'SYSTEM']).optional(),
  preferredView: z.enum(['floating', 'sidebar']).optional(),
  showTokensWithoutBalances: z.boolean().optional(),
  coreAssistant: z.boolean().optional(),
  showHighlightBanners: z.boolean().optional(),
  tokensVisibility: z
    .record(z.string(), z.record(z.string(), z.boolean()))
    .optional(),
  collectiblesVisibility: z
    .record(z.string(), z.record(z.string(), z.boolean()))
    .optional(),
  isQuickSwapsEnabled: z.boolean().optional(),
  feeSetting: z.enum(['low', 'medium', 'high']).optional(),
  maxBuy: z.enum(['1000', '5000', '10000', '50000', 'unlimited']).optional(),
  privacyMode: z.boolean().optional(),
  filterSmallUtxos: z.boolean().optional(),
  isBridgeDevEnv: z.boolean().optional(),
  notificationSubscriptions: z
    .record(
      z.union([
        z.nativeEnum(BalanceNotificationTypes),
        z.nativeEnum(NewsNotificationTypes),
      ]),
      // z.record with enum keys requires ALL keys to be present, but callers
      // send partial updates (only the changed key). .optional() permits absent
      // keys; we skip undefined values during processing below.
      z.boolean().optional(),
    )
    .optional(),
});

type PartialSettings = z.infer<typeof SettingsSchema>;
type Params = [settings?: PartialSettings];

type Currency = 'USD' | 'EUR' | 'GBP' | 'AUD' | 'CAD' | 'CHF' | 'HKD';
export interface WalletSetSettingsResponse {
  currency: Currency;
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
}

@injectable()
export class WalletSetSettingsHandler extends DAppRequestHandler<
  Params,
  WalletSetSettingsResponse
> {
  methods = [DAppProviderRequest.WALLET_SET_SETTINGS];

  constructor(
    private settingsService: SettingsService,
    private balanceNotificationService: BalanceNotificationService,
    private newsNotificationService: NewsNotificationService,
  ) {
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
        const errorMessage = validationResult.error.issues
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
        await this.settingsService.setCurrency(validatedSettings.currency);
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

      if (validatedSettings.showHighlightBanners !== undefined) {
        await this.settingsService.setShowHighlightBanners(
          validatedSettings.showHighlightBanners,
        );
      }

      if (validatedSettings.isQuickSwapsEnabled !== undefined) {
        await this.settingsService.setQuickSwapsEnabled(
          validatedSettings.isQuickSwapsEnabled,
        );
      }

      if (validatedSettings.feeSetting !== undefined) {
        await this.settingsService.setFeeSetting(validatedSettings.feeSetting);
      }

      if (validatedSettings.maxBuy !== undefined) {
        await this.settingsService.setMaxBuy(validatedSettings.maxBuy);
      }

      if (validatedSettings.privacyMode !== undefined) {
        await this.settingsService.setPrivacyMode(
          validatedSettings.privacyMode,
        );
      }

      if (validatedSettings.filterSmallUtxos !== undefined) {
        await this.settingsService.setFilterSmallUtxos(
          validatedSettings.filterSmallUtxos,
        );
      }

      if (validatedSettings.isBridgeDevEnv !== undefined) {
        await this.settingsService.setBridgeDevEnv(
          validatedSettings.isBridgeDevEnv,
        );
      }

      if (validatedSettings.notificationSubscriptions !== undefined) {
        const { notificationSubscriptions } = validatedSettings;

        const ops: Promise<void>[] = [];
        const entries = Object.entries(notificationSubscriptions) as [
          BalanceNotificationTypes | NewsNotificationTypes,
          boolean | undefined,
        ][];

        for (const [key, enabled] of entries) {
          if (enabled === undefined) continue;

          if (key === BalanceNotificationTypes.BALANCE_CHANGES) {
            ops.push(
              enabled
                ? this.balanceNotificationService.subscribe()
                : this.balanceNotificationService.unsubscribe(),
            );
          } else {
            ops.push(
              enabled
                ? this.newsNotificationService.subscribe([key])
                : this.newsNotificationService.unsubscribe(key),
            );
          }
        }

        const results = await Promise.allSettled(ops);
        const failures = results.filter((r) => r.status === 'rejected');

        if (failures.length > 0) {
          throw new Error(
            failures
              .map((r) => (r as PromiseRejectedResult).reason?.message ?? r)
              .join(', '),
          );
        }
      }

      // Get the final updated settings
      const finalSettings = await this.settingsService.getSettings();

      // Map internal state to API response (excluding customTokens)
      const response: WalletSetSettingsResponse = {
        currency: finalSettings.currency as Currency,
        showTokensWithoutBalances: finalSettings.showTokensWithoutBalances,
        theme: finalSettings.theme,
        tokensVisibility: finalSettings.tokensVisibility,
        collectiblesVisibility: finalSettings.collectiblesVisibility,
        analyticsConsent: finalSettings.analyticsConsent,
        language: finalSettings.language,
        coreAssistant: finalSettings.coreAssistant,
        preferredView: finalSettings.preferredView,
        showHighlightBanners: finalSettings.showHighlightBanners,
        isQuickSwapsEnabled: finalSettings.isQuickSwapsEnabled,
        feeSetting: finalSettings.feeSetting,
        maxBuy: finalSettings.maxBuy,
        privacyMode: finalSettings.privacyMode,
        filterSmallUtxos: finalSettings.filterSmallUtxos,
        isBridgeDevEnv: finalSettings.isBridgeDevEnv,
      };

      return {
        ...request,
        result: response,
      };
    } catch (e: any) {
      return {
        ...request,
        error: ethErrors.rpc.invalidRequest({
          message: e.toString(),
        }),
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
