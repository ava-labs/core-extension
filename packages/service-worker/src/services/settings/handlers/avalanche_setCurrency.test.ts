import { DAppProviderRequest, CURRENCIES } from '@core/types';
import { AvalancheSetCurrencyHandler } from './avalanche_setCurrency';
import { buildRpcCall } from '@shared/tests/test-utils';
import { SettingsService } from '../SettingsService';

describe('packages/service-worker/src/services/settings/handlers/avalanche_setCurrency', () => {
  const setCurrencyMock = jest.fn();
  const settingsServiceMock = {
    setCurrencty: setCurrencyMock, // Note: matches the typo in the actual code
  } as unknown as SettingsService;

  const handler = new AvalancheSetCurrencyHandler(settingsServiceMock);

  const createRequest = (params?: [string?]) => ({
    id: '123',
    method: DAppProviderRequest.AVALANCHE_SET_CURRENCY,
    params,
  });

  beforeEach(() => {
    jest.resetAllMocks();
  });

  describe('handleAuthenticated', () => {
    it('should successfully set a valid currency', async () => {
      const request = createRequest([CURRENCIES.USD]);
      const result = await handler.handleAuthenticated(buildRpcCall(request));

      expect(setCurrencyMock).toHaveBeenCalledWith(CURRENCIES.USD);
      expect(setCurrencyMock).toHaveBeenCalledTimes(1);
      expect(result).toEqual({
        ...request,
        result: CURRENCIES.USD,
      });
    });

    it('should successfully set all valid currencies', async () => {
      const validCurrencies = Object.values(CURRENCIES);

      for (const currency of validCurrencies) {
        jest.resetAllMocks();
        const request = createRequest([currency]);
        const result = await handler.handleAuthenticated(buildRpcCall(request));

        expect(setCurrencyMock).toHaveBeenCalledWith(currency);
        expect(result).toEqual({
          ...request,
          result: currency,
        });
      }
    });

    it('should successfully set EUR currency', async () => {
      const request = createRequest([CURRENCIES.EUR]);
      const result = await handler.handleAuthenticated(buildRpcCall(request));

      expect(setCurrencyMock).toHaveBeenCalledWith(CURRENCIES.EUR);
      expect(result).toEqual({
        ...request,
        result: CURRENCIES.EUR,
      });
    });

    it('should successfully set GBP currency', async () => {
      const request = createRequest([CURRENCIES.GBP]);
      const result = await handler.handleAuthenticated(buildRpcCall(request));

      expect(setCurrencyMock).toHaveBeenCalledWith(CURRENCIES.GBP);
      expect(result).toEqual({
        ...request,
        result: CURRENCIES.GBP,
      });
    });

    it('should return error when currency parameter is empty', async () => {
      const request = createRequest([]);
      const result = await handler.handleAuthenticated(buildRpcCall(request));

      expect(setCurrencyMock).not.toHaveBeenCalled();
      expect(result).toEqual({
        ...request,
        error: 'Error: Empty currency parameter',
      });
    });

    it('should return error when currency parameter is undefined', async () => {
      const request = createRequest([undefined]);
      const result = await handler.handleAuthenticated(buildRpcCall(request));

      expect(setCurrencyMock).not.toHaveBeenCalled();
      expect(result).toEqual({
        ...request,
        error: 'Error: Empty currency parameter',
      });
    });

    it('should return error when params array is undefined', async () => {
      const request = createRequest(undefined);
      const result = await handler.handleAuthenticated(buildRpcCall(request));

      expect(setCurrencyMock).not.toHaveBeenCalled();
      expect(result).toEqual({
        ...request,
        error: 'Error: Empty currency parameter',
      });
    });

    it('should return error when currency parameter is invalid', async () => {
      const request = createRequest(['INVALID']);
      const result = await handler.handleAuthenticated(buildRpcCall(request));

      expect(setCurrencyMock).not.toHaveBeenCalled();
      expect(result).toEqual({
        ...request,
        error: 'Error: Invalid currency parameter',
      });
    });

    it('should return error when currency parameter is an empty string', async () => {
      const request = createRequest(['']);
      const result = await handler.handleAuthenticated(buildRpcCall(request));

      expect(setCurrencyMock).not.toHaveBeenCalled();
      expect(result).toEqual({
        ...request,
        error: 'Error: Empty currency parameter',
      });
    });

    it('should return error when currency code is lowercase', async () => {
      const request = createRequest(['usd']); // Wrong case - should be USD
      const result = await handler.handleAuthenticated(buildRpcCall(request));

      expect(setCurrencyMock).not.toHaveBeenCalled();
      expect(result).toEqual({
        ...request,
        error: 'Error: Invalid currency parameter',
      });
    });

    it('should return error when settingsService.setCurrency throws an error', async () => {
      const request = createRequest([CURRENCIES.USD]);
      const error = new Error('Failed to save currency');
      setCurrencyMock.mockRejectedValueOnce(error);

      const result = await handler.handleAuthenticated(buildRpcCall(request));

      expect(setCurrencyMock).toHaveBeenCalledWith(CURRENCIES.USD);
      expect(result).toEqual({
        ...request,
        error: error.toString(),
      });
    });
  });

  describe('handleUnauthenticated', () => {
    it('should return error when account is not connected', async () => {
      const request = createRequest([CURRENCIES.USD]);
      const result = await handler.handleUnauthenticated(buildRpcCall(request));

      expect(setCurrencyMock).not.toHaveBeenCalled();
      expect(result).toEqual({
        ...request,
        error: 'account not connected',
      });
    });

    it('should return error when account is not connected regardless of currency', async () => {
      const validCurrencies = Object.values(CURRENCIES);

      for (const currency of validCurrencies) {
        jest.resetAllMocks();
        const request = createRequest([currency]);
        const result = await handler.handleUnauthenticated(
          buildRpcCall(request),
        );

        expect(setCurrencyMock).not.toHaveBeenCalled();
        expect(result).toEqual({
          ...request,
          error: 'account not connected',
        });
      }
    });
  });
});
