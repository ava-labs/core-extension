import { DAppProviderRequest, Languages } from '@core/types';
import { AvalancheSetLanguageHandler } from './avalanche_setLanguage';
import { buildRpcCall } from '@shared/tests/test-utils';
import { SettingsService } from '../SettingsService';

describe('packages/service-worker/src/services/settings/handlers/avalanche_setLanguage', () => {
  const setLanguageMock = jest.fn();
  const settingsServiceMock = {
    setLanguage: setLanguageMock,
  } as unknown as SettingsService;

  const handler = new AvalancheSetLanguageHandler(settingsServiceMock);

  const createRequest = (params?: [string?]) => ({
    id: '123',
    method: DAppProviderRequest.AVALANCHE_SET_LANGUAGE,
    params,
  });

  beforeEach(() => {
    jest.resetAllMocks();
  });

  describe('handleAuthenticated', () => {
    it('should successfully set a valid language', async () => {
      const request = createRequest([Languages.EN]);
      const result = await handler.handleAuthenticated(buildRpcCall(request));

      expect(setLanguageMock).toHaveBeenCalledWith(Languages.EN);
      expect(setLanguageMock).toHaveBeenCalledTimes(1);
      expect(result).toEqual({
        ...request,
        result: Languages.EN,
      });
    });

    it('should successfully set all valid languages', async () => {
      const validLanguages = Object.values(Languages);

      for (const language of validLanguages) {
        jest.resetAllMocks();
        const request = createRequest([language]);
        const result = await handler.handleAuthenticated(buildRpcCall(request));

        expect(setLanguageMock).toHaveBeenCalledWith(language);
        expect(result).toEqual({
          ...request,
          result: language,
        });
      }
    });

    it('should return error when language parameter is empty', async () => {
      const request = createRequest([]);
      const result = await handler.handleAuthenticated(buildRpcCall(request));

      expect(setLanguageMock).not.toHaveBeenCalled();
      expect(result).toEqual({
        ...request,
        error: 'Error: Empty language parameter',
      });
    });

    it('should return error when language parameter is undefined', async () => {
      const request = createRequest([undefined]);
      const result = await handler.handleAuthenticated(buildRpcCall(request));

      expect(setLanguageMock).not.toHaveBeenCalled();
      expect(result).toEqual({
        ...request,
        error: 'Error: Empty language parameter',
      });
    });

    it('should return error when params array is undefined', async () => {
      const request = createRequest(undefined);
      const result = await handler.handleAuthenticated(buildRpcCall(request));

      expect(setLanguageMock).not.toHaveBeenCalled();
      expect(result).toEqual({
        ...request,
        error: 'Error: Empty language parameter',
      });
    });

    it('should return error when language parameter is invalid', async () => {
      const request = createRequest(['invalid-language']);
      const result = await handler.handleAuthenticated(buildRpcCall(request));

      expect(setLanguageMock).not.toHaveBeenCalled();
      expect(result).toEqual({
        ...request,
        error: 'Error: Invalid language parameter',
      });
    });

    it('should return error when language parameter is an empty string', async () => {
      const request = createRequest(['']);
      const result = await handler.handleAuthenticated(buildRpcCall(request));

      expect(setLanguageMock).not.toHaveBeenCalled();
      expect(result).toEqual({
        ...request,
        error: 'Error: Empty language parameter',
      });
    });

    it('should return error when settingsService.setLanguage throws an error', async () => {
      const request = createRequest([Languages.EN]);
      const error = new Error('Failed to save language');
      setLanguageMock.mockRejectedValueOnce(error);

      const result = await handler.handleAuthenticated(buildRpcCall(request));

      expect(setLanguageMock).toHaveBeenCalledWith(Languages.EN);
      expect(result).toEqual({
        ...request,
        error: error.toString(),
      });
    });

    it('should handle case-sensitive language codes correctly', async () => {
      const request = createRequest(['EN']); // Wrong case
      const result = await handler.handleAuthenticated(buildRpcCall(request));

      expect(setLanguageMock).not.toHaveBeenCalled();
      expect(result).toEqual({
        ...request,
        error: 'Error: Invalid language parameter',
      });
    });
  });

  describe('handleUnauthenticated', () => {
    it('should return error when account is not connected', async () => {
      const request = createRequest([Languages.EN]);
      const result = await handler.handleUnauthenticated(buildRpcCall(request));

      expect(setLanguageMock).not.toHaveBeenCalled();
      expect(result).toEqual({
        ...request,
        error: 'account not connected',
      });
    });
  });
});
