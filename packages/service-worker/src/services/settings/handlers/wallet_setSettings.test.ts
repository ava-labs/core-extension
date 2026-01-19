import {
  DAppProviderRequest,
  Languages,
  CURRENCIES,
  SettingsState,
  AnalyticsConsent,
  ColorTheme,
} from '@core/types';
import {
  WalletSetSettingsHandler,
  WalletSetSettingsResponse,
} from './wallet_setSettings';
import { buildRpcCall } from '@shared/tests/test-utils';
import { SettingsService } from '../SettingsService';
import { ethErrors } from 'eth-rpc-errors';

describe('packages/service-worker/src/services/settings/handlers/wallet_setSettings', () => {
  const getSettingsMock = jest.fn();
  const setLanguageMock = jest.fn();
  const setCurrencyMock = jest.fn();
  const setShowTokensWithNoBalanceMock = jest.fn();
  const setThemeMock = jest.fn();
  const setTokensVisibilityMock = jest.fn();
  const setCollectiblesVisibilityMock = jest.fn();
  const setAnalyticsConsentMock = jest.fn();
  const setCoreAssistantMock = jest.fn();
  const setPreferredViewMock = jest.fn();
  const setShowTrendingTokensMock = jest.fn();

  const settingsServiceMock = {
    getSettings: getSettingsMock,
    setLanguage: setLanguageMock,
    setCurrency: setCurrencyMock,
    setShowTokensWithNoBalance: setShowTokensWithNoBalanceMock,
    setTheme: setThemeMock,
    setTokensVisibility: setTokensVisibilityMock,
    setCollectiblesVisibility: setCollectiblesVisibilityMock,
    setAnalyticsConsent: setAnalyticsConsentMock,
    setCoreAssistant: setCoreAssistantMock,
    setPreferredView: setPreferredViewMock,
    setShowTrendingTokens: setShowTrendingTokensMock,
  } as unknown as SettingsService;

  const handler = new WalletSetSettingsHandler(settingsServiceMock);

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
  };

  const mockSettingsResponse: WalletSetSettingsResponse = {
    currency: CURRENCIES.USD,
    showTokensWithoutBalances: true,
    theme: 'LIGHT',
    tokensVisibility: {},
    collectiblesVisibility: {},
    analyticsConsent: AnalyticsConsent.Approved,
    language: Languages.EN,
    coreAssistant: true,
    preferredView: 'floating',
    showTrendingTokens: true,
  };

  const createRequest = (params?: [Partial<SettingsState>?]) => ({
    id: '123',
    method: DAppProviderRequest.WALLET_SET_SETTINGS,
    params,
  });

  beforeEach(() => {
    jest.resetAllMocks();
    getSettingsMock.mockResolvedValue(mockSettingsState);
  });

  describe('handleAuthenticated', () => {
    it('should successfully update language setting', async () => {
      const request = createRequest([{ language: Languages.ES }]);
      const updatedResponse = {
        ...mockSettingsResponse,
        language: Languages.ES,
      };
      getSettingsMock.mockResolvedValueOnce({
        ...mockSettingsState,
        language: Languages.ES,
      });

      const result = await handler.handleAuthenticated(buildRpcCall(request));

      expect(setLanguageMock).toHaveBeenCalledWith(Languages.ES);
      expect(setLanguageMock).toHaveBeenCalledTimes(1);
      expect(result).toEqual({
        ...request,
        result: updatedResponse,
      });
    });

    it('should successfully update currency setting', async () => {
      const request = createRequest([{ currency: CURRENCIES.EUR }]);
      const updatedResponse = {
        ...mockSettingsResponse,
        currency: CURRENCIES.EUR,
      };
      getSettingsMock.mockResolvedValueOnce({
        ...mockSettingsState,
        currency: CURRENCIES.EUR,
      });

      const result = await handler.handleAuthenticated(buildRpcCall(request));

      expect(setCurrencyMock).toHaveBeenCalledWith(CURRENCIES.EUR);
      expect(result).toEqual({
        ...request,
        result: updatedResponse,
      });
    });

    it('should successfully update theme setting', async () => {
      const request = createRequest([{ theme: 'DARK' }]);
      const updatedResponse = { ...mockSettingsResponse, theme: 'DARK' };
      getSettingsMock.mockResolvedValueOnce({
        ...mockSettingsState,
        theme: 'DARK',
      });

      const result = await handler.handleAuthenticated(buildRpcCall(request));

      expect(setThemeMock).toHaveBeenCalledWith('DARK');
      expect(result).toEqual({
        ...request,
        result: updatedResponse,
      });
    });

    it('should successfully update multiple settings', async () => {
      const request = createRequest([
        {
          language: Languages.FR,
          currency: CURRENCIES.EUR,
          theme: 'DARK',
          coreAssistant: false,
        },
      ]);
      const updatedResponse = {
        ...mockSettingsResponse,
        language: Languages.FR,
        currency: CURRENCIES.EUR,
        theme: 'DARK',
        coreAssistant: false,
      };
      getSettingsMock.mockResolvedValueOnce({
        ...mockSettingsState,
        language: Languages.FR,
        currency: CURRENCIES.EUR,
        theme: 'DARK',
        coreAssistant: false,
      });

      const result = await handler.handleAuthenticated(buildRpcCall(request));

      expect(setLanguageMock).toHaveBeenCalledWith(Languages.FR);
      expect(setCurrencyMock).toHaveBeenCalledWith(CURRENCIES.EUR);
      expect(setThemeMock).toHaveBeenCalledWith('DARK');
      expect(setCoreAssistantMock).toHaveBeenCalledWith(false);
      expect(result).toEqual({
        ...request,
        result: updatedResponse,
      });
    });

    it('should successfully update showTokensWithoutBalances', async () => {
      const request = createRequest([{ showTokensWithoutBalances: false }]);
      const updatedResponse = {
        ...mockSettingsResponse,
        showTokensWithoutBalances: false,
      };
      getSettingsMock.mockResolvedValueOnce({
        ...mockSettingsState,
        showTokensWithoutBalances: false,
      });

      const result = await handler.handleAuthenticated(buildRpcCall(request));

      expect(setShowTokensWithNoBalanceMock).toHaveBeenCalledWith(false);
      expect(result).toEqual({
        ...request,
        result: updatedResponse,
      });
    });

    it('should successfully update analytics consent', async () => {
      const request = createRequest([
        { analyticsConsent: AnalyticsConsent.Denied },
      ]);
      const updatedResponse = {
        ...mockSettingsResponse,
        analyticsConsent: AnalyticsConsent.Denied,
      };
      getSettingsMock.mockResolvedValueOnce({
        ...mockSettingsState,
        analyticsConsent: AnalyticsConsent.Denied,
      });

      const result = await handler.handleAuthenticated(buildRpcCall(request));

      expect(setAnalyticsConsentMock).toHaveBeenCalledWith(false);
      expect(result).toEqual({
        ...request,
        result: updatedResponse,
      });
    });

    it('should return error when no settings provided', async () => {
      const request = createRequest([]);
      const result = await handler.handleAuthenticated(buildRpcCall(request));

      expect(result).toEqual({
        ...request,
        error: ethErrors.rpc.invalidRequest({
          message: 'Error: No settings provided',
        }),
      });
    });

    it('should return error when settings object is empty', async () => {
      const request = createRequest([{}]);
      const result = await handler.handleAuthenticated(buildRpcCall(request));

      expect(result).toEqual({
        ...request,
        error: ethErrors.rpc.invalidRequest({
          message: 'Error: No settings provided',
        }),
      });
    });

    it('should return error when params are undefined', async () => {
      const request = createRequest(undefined);
      const result = await handler.handleAuthenticated(buildRpcCall(request));

      expect(result).toEqual({
        ...request,
        error: ethErrors.rpc.invalidRequest({
          message: 'Error: No settings provided',
        }),
      });
    });

    it('should return error for invalid language', async () => {
      const request = createRequest([{ language: 'invalid' as Languages }]);
      const result = await handler.handleAuthenticated(buildRpcCall(request));

      expect(setLanguageMock).not.toHaveBeenCalled();
      expect('error' in result).toBe(true);
      if ('error' in result) {
        expect(result.error.message).toContain('Error: Invalid settings:');
        expect(result.error.message).toContain('language');
      }
    });

    it('should return error for invalid currency', async () => {
      const request = createRequest([{ currency: 'INVALID' as CURRENCIES }]);
      const result = await handler.handleAuthenticated(buildRpcCall(request));

      expect(setCurrencyMock).not.toHaveBeenCalled();
      expect('error' in result).toBe(true);
      if ('error' in result) {
        expect(result.error.message).toContain('Error: Invalid settings:');
        expect(result.error.message).toContain('currency');
      }
    });

    it('should return error for invalid theme', async () => {
      const request = createRequest([{ theme: 'INVALID' as ColorTheme }]);
      const result = await handler.handleAuthenticated(buildRpcCall(request));

      expect(setThemeMock).not.toHaveBeenCalled();
      expect('error' in result).toBe(true);
      if ('error' in result) {
        expect(result.error.message).toContain('Error: Invalid settings:');
        expect(result.error.message).toContain('theme');
      }
    });

    it('should return error for invalid analyticsConsent', async () => {
      const request = createRequest([
        { analyticsConsent: 'invalid' as AnalyticsConsent },
      ]);
      const result = await handler.handleAuthenticated(buildRpcCall(request));

      expect(setAnalyticsConsentMock).not.toHaveBeenCalled();
      expect('error' in result).toBe(true);
      if ('error' in result) {
        expect(result.error.message).toContain('Error: Invalid settings:');
        expect(result.error.message).toContain('analyticsConsent');
      }
    });

    it('should return error when service throws an error', async () => {
      const request = createRequest([{ language: Languages.EN }]);
      const error = new Error('Failed to save settings');
      setLanguageMock.mockRejectedValueOnce(error);

      const result = await handler.handleAuthenticated(buildRpcCall(request));

      expect(result).toEqual({
        ...request,
        error: ethErrors.rpc.invalidRequest({
          message: error.toString(),
        }),
      });
    });
  });

  describe('handleUnauthenticated', () => {
    it('should return error when account is not connected', async () => {
      const request = createRequest([{ language: Languages.EN }]);
      const result = await handler.handleUnauthenticated(buildRpcCall(request));

      expect(getSettingsMock).not.toHaveBeenCalled();
      expect(setLanguageMock).not.toHaveBeenCalled();
      expect(result).toEqual({
        ...request,
        error: 'account not connected',
      });
    });
  });
});
