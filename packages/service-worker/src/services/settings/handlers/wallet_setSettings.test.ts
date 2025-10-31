import {
  DAppProviderRequest,
  Languages,
  CURRENCIES,
  SettingsState,
  AnalyticsConsent,
  ColorTheme,
} from '@core/types';
import { WalletSetSettingsHandler } from './wallet_setSettings';
import { buildRpcCall } from '@shared/tests/test-utils';
import { SettingsService } from '../SettingsService';

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
    setCurrencty: setCurrencyMock,
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
      const updatedSettings = { ...mockSettingsState, language: Languages.ES };
      getSettingsMock.mockResolvedValueOnce(updatedSettings);

      const result = await handler.handleAuthenticated(buildRpcCall(request));

      expect(setLanguageMock).toHaveBeenCalledWith(Languages.ES);
      expect(setLanguageMock).toHaveBeenCalledTimes(1);
      expect(result).toEqual({
        ...request,
        result: updatedSettings,
      });
    });

    it('should successfully update currency setting', async () => {
      const request = createRequest([{ currency: CURRENCIES.EUR }]);
      const updatedSettings = {
        ...mockSettingsState,
        currency: CURRENCIES.EUR,
      };
      getSettingsMock.mockResolvedValueOnce(updatedSettings);

      const result = await handler.handleAuthenticated(buildRpcCall(request));

      expect(setCurrencyMock).toHaveBeenCalledWith(CURRENCIES.EUR);
      expect(result).toEqual({
        ...request,
        result: updatedSettings,
      });
    });

    it('should successfully update theme setting', async () => {
      const request = createRequest([{ theme: 'DARK' }]);
      const updatedSettings = { ...mockSettingsState, theme: 'DARK' };
      getSettingsMock.mockResolvedValueOnce(updatedSettings);

      const result = await handler.handleAuthenticated(buildRpcCall(request));

      expect(setThemeMock).toHaveBeenCalledWith('DARK');
      expect(result).toEqual({
        ...request,
        result: updatedSettings,
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
      const updatedSettings = {
        ...mockSettingsState,
        language: Languages.FR,
        currency: CURRENCIES.EUR,
        theme: 'DARK',
        coreAssistant: false,
      };
      getSettingsMock.mockResolvedValueOnce(updatedSettings);

      const result = await handler.handleAuthenticated(buildRpcCall(request));

      expect(setLanguageMock).toHaveBeenCalledWith(Languages.FR);
      expect(setCurrencyMock).toHaveBeenCalledWith(CURRENCIES.EUR);
      expect(setThemeMock).toHaveBeenCalledWith('DARK');
      expect(setCoreAssistantMock).toHaveBeenCalledWith(false);
      expect(result).toEqual({
        ...request,
        result: updatedSettings,
      });
    });

    it('should successfully update showTokensWithoutBalances', async () => {
      const request = createRequest([{ showTokensWithoutBalances: false }]);
      const updatedSettings = {
        ...mockSettingsState,
        showTokensWithoutBalances: false,
      };
      getSettingsMock.mockResolvedValueOnce(updatedSettings);

      const result = await handler.handleAuthenticated(buildRpcCall(request));

      expect(setShowTokensWithNoBalanceMock).toHaveBeenCalledWith(false);
      expect(result).toEqual({
        ...request,
        result: updatedSettings,
      });
    });

    it('should successfully update analytics consent', async () => {
      const request = createRequest([
        { analyticsConsent: AnalyticsConsent.Denied },
      ]);
      const updatedSettings = {
        ...mockSettingsState,
        analyticsConsent: AnalyticsConsent.Denied,
      };
      getSettingsMock.mockResolvedValueOnce(updatedSettings);

      const result = await handler.handleAuthenticated(buildRpcCall(request));

      expect(setAnalyticsConsentMock).toHaveBeenCalledWith(false);
      expect(result).toEqual({
        ...request,
        result: updatedSettings,
      });
    });

    it('should return error when no settings provided', async () => {
      const request = createRequest([]);
      const result = await handler.handleAuthenticated(buildRpcCall(request));

      expect(result).toEqual({
        ...request,
        error: 'Error: No settings provided',
      });
    });

    it('should return error when settings object is empty', async () => {
      const request = createRequest([{}]);
      const result = await handler.handleAuthenticated(buildRpcCall(request));

      expect(result).toEqual({
        ...request,
        error: 'Error: No settings provided',
      });
    });

    it('should return error when params are undefined', async () => {
      const request = createRequest(undefined);
      const result = await handler.handleAuthenticated(buildRpcCall(request));

      expect(result).toEqual({
        ...request,
        error: 'Error: No settings provided',
      });
    });

    it('should return error for invalid language', async () => {
      const request = createRequest([{ language: 'invalid' as Languages }]);
      const result = await handler.handleAuthenticated(buildRpcCall(request));

      expect(setLanguageMock).not.toHaveBeenCalled();
      expect(result).toEqual({
        ...request,
        error: 'Error: Invalid language parameter',
      });
    });

    it('should return error for invalid currency', async () => {
      const request = createRequest([{ currency: 'INVALID' as CURRENCIES }]);
      const result = await handler.handleAuthenticated(buildRpcCall(request));

      expect(setCurrencyMock).not.toHaveBeenCalled();
      expect(result).toEqual({
        ...request,
        error: 'Error: Invalid currency parameter',
      });
    });

    it('should return error for invalid theme', async () => {
      const request = createRequest([{ theme: 'INVALID' as ColorTheme }]);
      const result = await handler.handleAuthenticated(buildRpcCall(request));

      expect(setThemeMock).not.toHaveBeenCalled();
      expect(result).toEqual({
        ...request,
        error: 'Error: Invalid theme parameter',
      });
    });

    it('should return error for invalid analyticsConsent', async () => {
      const request = createRequest([
        { analyticsConsent: 'invalid' as AnalyticsConsent },
      ]);
      const result = await handler.handleAuthenticated(buildRpcCall(request));

      expect(setAnalyticsConsentMock).not.toHaveBeenCalled();
      expect(result).toEqual({
        ...request,
        error: 'Error: Invalid analyticsConsent parameter',
      });
    });

    it('should return error when service throws an error', async () => {
      const request = createRequest([{ language: Languages.EN }]);
      const error = new Error('Failed to save settings');
      setLanguageMock.mockRejectedValueOnce(error);

      const result = await handler.handleAuthenticated(buildRpcCall(request));

      expect(result).toEqual({
        ...request,
        error: error.toString(),
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
