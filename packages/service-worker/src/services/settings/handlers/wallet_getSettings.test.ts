import {
  DAppProviderRequest,
  Languages,
  CURRENCIES,
  SettingsState,
  AnalyticsConsent,
} from '@core/types';
import { WalletGetSettingsHandler } from './wallet_getSettings';
import { buildRpcCall } from '@shared/tests/test-utils';
import { SettingsService } from '../SettingsService';

describe('packages/service-worker/src/services/settings/handlers/avalanche_getSettings', () => {
  const getSettingsMock = jest.fn();
  const settingsServiceMock = {
    getSettings: getSettingsMock,
  } as unknown as SettingsService;

  const handler = new WalletGetSettingsHandler(settingsServiceMock);

  const createRequest = () => ({
    id: '123',
    method: DAppProviderRequest.WALLET_GET_SETTINGS,
  });

  const mockSettingsState: SettingsState = {
    currency: CURRENCIES.USD,
    customTokens: {},
    showTokensWithoutBalances: true,
    theme: 'LIGHT',
    tokensVisibility: {},
    collectiblesVisibility: {},
    analyticsConsent: AnalyticsConsent.Approved,
    language: Languages.EN,
    coreAssistant: true,
    preferredView: 'floating',
    showTrendingTokens: true,
    privacyMode: false,
    filterSmallUtxos: false,
  };

  // The handler returns a filtered response that excludes filterSmallUtxos
  const getExpectedResponse = (settings: SettingsState) => {
    const { filterSmallUtxos, ...rest } = settings;
    return rest;
  };

  beforeEach(() => {
    jest.resetAllMocks();
  });

  describe('handleAuthenticated', () => {
    it('should successfully return settings', async () => {
      const request = createRequest();
      getSettingsMock.mockResolvedValueOnce(mockSettingsState);

      const result = await handler.handleAuthenticated(buildRpcCall(request));

      expect(getSettingsMock).toHaveBeenCalledTimes(1);
      expect(getSettingsMock).toHaveBeenCalledWith();
      expect(result).toEqual({
        ...request,
        result: getExpectedResponse(mockSettingsState),
      });
    });

    it('should return settings with EUR currency', async () => {
      const request = createRequest();
      const settingsWithEur = {
        ...mockSettingsState,
        currency: CURRENCIES.EUR,
      };
      getSettingsMock.mockResolvedValueOnce(settingsWithEur);

      const result = await handler.handleAuthenticated(buildRpcCall(request));

      expect(result).toEqual({
        ...request,
        result: getExpectedResponse(settingsWithEur),
      });
    });

    it('should return settings with dark theme', async () => {
      const request = createRequest();
      const settingsWithDarkTheme = {
        ...mockSettingsState,
        theme: 'DARK',
      };
      getSettingsMock.mockResolvedValueOnce(settingsWithDarkTheme);

      const result = await handler.handleAuthenticated(buildRpcCall(request));

      expect(result).toEqual({
        ...request,
        result: getExpectedResponse(settingsWithDarkTheme),
      });
    });

    it('should return settings with different language', async () => {
      const request = createRequest();
      const settingsWithSpanish = {
        ...mockSettingsState,
        language: Languages.ES,
      };
      getSettingsMock.mockResolvedValueOnce(settingsWithSpanish);

      const result = await handler.handleAuthenticated(buildRpcCall(request));

      expect(result).toEqual({
        ...request,
        result: getExpectedResponse(settingsWithSpanish),
      });
    });

    it('should return settings with showTokensWithoutBalances false', async () => {
      const request = createRequest();
      const settingsWithHiddenTokens = {
        ...mockSettingsState,
        showTokensWithoutBalances: false,
      };
      getSettingsMock.mockResolvedValueOnce(settingsWithHiddenTokens);

      const result = await handler.handleAuthenticated(buildRpcCall(request));

      expect(result).toEqual({
        ...request,
        result: getExpectedResponse(settingsWithHiddenTokens),
      });
    });

    it('should return settings with coreAssistant disabled', async () => {
      const request = createRequest();
      const settingsWithoutAssistant = {
        ...mockSettingsState,
        coreAssistant: false,
      };
      getSettingsMock.mockResolvedValueOnce(settingsWithoutAssistant);

      const result = await handler.handleAuthenticated(buildRpcCall(request));

      expect(result).toEqual({
        ...request,
        result: getExpectedResponse(settingsWithoutAssistant),
      });
    });

    it('should return settings with showTrendingTokens false', async () => {
      const request = createRequest();
      const settingsWithoutTrending = {
        ...mockSettingsState,
        showTrendingTokens: false,
      };
      getSettingsMock.mockResolvedValueOnce(settingsWithoutTrending);

      const result = await handler.handleAuthenticated(buildRpcCall(request));

      expect(result).toEqual({
        ...request,
        result: getExpectedResponse(settingsWithoutTrending),
      });
    });

    it('should return settings with analytics consent denied', async () => {
      const request = createRequest();
      const settingsWithDeniedConsent = {
        ...mockSettingsState,
        analyticsConsent: AnalyticsConsent.Denied,
      };
      getSettingsMock.mockResolvedValueOnce(settingsWithDeniedConsent);

      const result = await handler.handleAuthenticated(buildRpcCall(request));

      expect(result).toEqual({
        ...request,
        result: getExpectedResponse(settingsWithDeniedConsent),
      });
    });

    it('should return settings with analytics consent pending', async () => {
      const request = createRequest();
      const settingsWithPendingConsent = {
        ...mockSettingsState,
        analyticsConsent: AnalyticsConsent.Pending,
      };
      getSettingsMock.mockResolvedValueOnce(settingsWithPendingConsent);

      const result = await handler.handleAuthenticated(buildRpcCall(request));

      expect(result).toEqual({
        ...request,
        result: getExpectedResponse(settingsWithPendingConsent),
      });
    });

    it('should return settings with custom tokens', async () => {
      const request = createRequest();
      const settingsWithCustomTokens = {
        ...mockSettingsState,
        customTokens: {
          '43114': {
            '0x123': {
              address: '0x123',
              symbol: 'TEST',
              decimals: 18,
            },
          },
        },
      };
      getSettingsMock.mockResolvedValueOnce(settingsWithCustomTokens);

      const result = await handler.handleAuthenticated(buildRpcCall(request));

      expect(result).toEqual({
        ...request,
        result: getExpectedResponse(settingsWithCustomTokens),
      });
    });

    it('should return settings with tokens visibility configuration', async () => {
      const request = createRequest();
      const settingsWithVisibility = {
        ...mockSettingsState,
        tokensVisibility: {
          '43114': {
            '0x123': false,
          },
        },
      };
      getSettingsMock.mockResolvedValueOnce(settingsWithVisibility);

      const result = await handler.handleAuthenticated(buildRpcCall(request));

      expect(result).toEqual({
        ...request,
        result: getExpectedResponse(settingsWithVisibility),
      });
    });

    it('should return settings with collectibles visibility configuration', async () => {
      const request = createRequest();
      const settingsWithCollectiblesVisibility = {
        ...mockSettingsState,
        collectiblesVisibility: {
          '43114': {
            '0xabc': false,
          },
        },
      };
      getSettingsMock.mockResolvedValueOnce(settingsWithCollectiblesVisibility);

      const result = await handler.handleAuthenticated(buildRpcCall(request));

      expect(result).toEqual({
        ...request,
        result: getExpectedResponse(settingsWithCollectiblesVisibility),
      });
    });

    it('should return error when settingsService.getSettings throws an error', async () => {
      const request = createRequest();
      const error = new Error('Failed to retrieve settings');
      getSettingsMock.mockRejectedValueOnce(error);

      const result = await handler.handleAuthenticated(buildRpcCall(request));

      expect(getSettingsMock).toHaveBeenCalledTimes(1);
      expect(result).toEqual({
        ...request,
        error: error.toString(),
      });
    });
  });

  describe('handleUnauthenticated', () => {
    it('should return error when account is not connected', async () => {
      const request = createRequest();
      const result = await handler.handleUnauthenticated(buildRpcCall(request));

      expect(getSettingsMock).not.toHaveBeenCalled();
      expect(result).toEqual({
        ...request,
        error: 'account not connected',
      });
    });

    it('should not call getSettings when unauthenticated', async () => {
      const request = createRequest();
      await handler.handleUnauthenticated(buildRpcCall(request));

      expect(getSettingsMock).not.toHaveBeenCalled();
    });
  });
});
