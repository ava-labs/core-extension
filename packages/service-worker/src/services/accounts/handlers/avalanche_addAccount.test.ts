import { AccountType, DAppProviderRequest } from '@core/types';
import { AvalancheAddAccountHandler } from './avalanche_addAccount';
import { buildRpcCall } from '@shared/tests/test-utils';

const WALLET_ID = 'wallet-id';
const NEW_WALLET_ID = 'new-wallet-id';
const ACCOUNT_ID = 'new-account-uuid';

describe('background/services/accounts/handlers/avalanche_addAccount.ts', () => {
  const addPrimaryAccountMock = jest.fn();
  const getActiveAccountMock = jest.fn();

  const accountServiceMock = {
    addPrimaryAccount: addPrimaryAccountMock,
    getActiveAccount: getActiveAccountMock,
  } as any;

  const baseRequest = {
    id: '123',
    method: DAppProviderRequest.AVALANCHE_ADD_ACCOUNT,
  } as const;

  beforeEach(() => {
    jest.resetAllMocks();
    addPrimaryAccountMock.mockResolvedValue(ACCOUNT_ID);
    getActiveAccountMock.mockResolvedValue({
      walletId: WALLET_ID,
      type: AccountType.PRIMARY,
    });
  });

  describe('handleAuthenticated', () => {
    it('should add primary account without walletId param using active account walletId', async () => {
      const handler = new AvalancheAddAccountHandler(accountServiceMock);
      const request = {
        ...baseRequest,
        params: [],
      } as any;

      const result = await handler.handleAuthenticated(buildRpcCall(request));

      expect(getActiveAccountMock).toHaveBeenCalledTimes(1);
      expect(addPrimaryAccountMock).toHaveBeenCalledTimes(1);
      expect(addPrimaryAccountMock).toHaveBeenCalledWith({
        walletId: WALLET_ID,
      });
      expect(result).toEqual({
        ...request,
        result: ACCOUNT_ID,
      });
    });

    it('should add primary account with provided walletId param', async () => {
      const handler = new AvalancheAddAccountHandler(accountServiceMock);
      const request = {
        ...baseRequest,
        params: [NEW_WALLET_ID],
      } as any;

      const result = await handler.handleAuthenticated(buildRpcCall(request));

      expect(getActiveAccountMock).toHaveBeenCalledTimes(1);
      expect(addPrimaryAccountMock).toHaveBeenCalledTimes(1);
      expect(addPrimaryAccountMock).toHaveBeenCalledWith({
        walletId: NEW_WALLET_ID,
      });
      expect(result).toEqual({
        ...request,
        result: ACCOUNT_ID,
      });
    });

    it('should handle empty walletId param by using active account walletId', async () => {
      const handler = new AvalancheAddAccountHandler(accountServiceMock);
      const request = {
        ...baseRequest,
        params: [''],
      } as any;

      const result = await handler.handleAuthenticated(buildRpcCall(request));

      expect(getActiveAccountMock).toHaveBeenCalledTimes(1);
      expect(addPrimaryAccountMock).toHaveBeenCalledTimes(1);
      expect(addPrimaryAccountMock).toHaveBeenCalledWith({
        walletId: WALLET_ID,
      });
      expect(result).toEqual({
        ...request,
        result: ACCOUNT_ID,
      });
    });

    it('should handle undefined params by using active account walletId', async () => {
      const handler = new AvalancheAddAccountHandler(accountServiceMock);
      const request = {
        ...baseRequest,
        params: undefined,
      } as any;

      const result = await handler.handleAuthenticated(buildRpcCall(request));

      expect(getActiveAccountMock).toHaveBeenCalledTimes(1);
      expect(addPrimaryAccountMock).toHaveBeenCalledTimes(1);
      expect(addPrimaryAccountMock).toHaveBeenCalledWith({
        walletId: WALLET_ID,
      });
      expect(result).toEqual({
        ...request,
        result: ACCOUNT_ID,
      });
    });

    it('should return error when no active account exists', async () => {
      getActiveAccountMock.mockResolvedValue(null);
      const handler = new AvalancheAddAccountHandler(accountServiceMock);
      const request = {
        ...baseRequest,
        params: [],
      } as any;

      const result = await handler.handleAuthenticated(buildRpcCall(request));

      expect(getActiveAccountMock).toHaveBeenCalledTimes(1);
      expect(addPrimaryAccountMock).not.toHaveBeenCalled();
      expect(result).toEqual({
        ...request,
        error: 'Error: There is no wallet id for the new primary account',
      });
    });

    it('should return error when no walletId available and active account is not primary', async () => {
      getActiveAccountMock.mockResolvedValue({
        type: AccountType.IMPORTED,
        walletId: undefined,
      });
      const handler = new AvalancheAddAccountHandler(accountServiceMock);
      const request = {
        ...baseRequest,
        params: [],
      } as any;

      const result = await handler.handleAuthenticated(buildRpcCall(request));

      expect(getActiveAccountMock).toHaveBeenCalledTimes(1);
      expect(addPrimaryAccountMock).not.toHaveBeenCalled();
      expect(result).toEqual({
        ...request,
        error: 'Error: There is no wallet id for the new primary account',
      });
    });

    it('should return error when no walletId available and active account has no walletId', async () => {
      getActiveAccountMock.mockResolvedValue({
        type: AccountType.PRIMARY,
        walletId: undefined,
      });
      const handler = new AvalancheAddAccountHandler(accountServiceMock);
      const request = {
        ...baseRequest,
        params: [],
      } as any;

      const result = await handler.handleAuthenticated(buildRpcCall(request));

      expect(getActiveAccountMock).toHaveBeenCalledTimes(1);
      expect(addPrimaryAccountMock).not.toHaveBeenCalled();
      expect(result).toEqual({
        ...request,
        error: 'Error: There is no wallet id for the new primary account',
      });
    });

    it('should return error when addPrimaryAccount throws an error', async () => {
      const errorMessage = 'Failed to add account';
      addPrimaryAccountMock.mockRejectedValue(new Error(errorMessage));
      const handler = new AvalancheAddAccountHandler(accountServiceMock);
      const request = {
        ...baseRequest,
        params: [],
      } as any;

      const result = await handler.handleAuthenticated(buildRpcCall(request));

      expect(getActiveAccountMock).toHaveBeenCalledTimes(1);
      expect(addPrimaryAccountMock).toHaveBeenCalledTimes(1);
      expect(result).toEqual({
        ...request,
        error: `Error: ${errorMessage}`,
      });
    });

    it('should return error when getActiveAccount throws an error', async () => {
      const errorMessage = 'Failed to get active account';
      getActiveAccountMock.mockRejectedValue(new Error(errorMessage));
      const handler = new AvalancheAddAccountHandler(accountServiceMock);
      const request = {
        ...baseRequest,
        params: [],
      } as any;

      const result = await handler.handleAuthenticated(buildRpcCall(request));

      expect(getActiveAccountMock).toHaveBeenCalledTimes(1);
      expect(addPrimaryAccountMock).not.toHaveBeenCalled();
      expect(result).toEqual({
        ...request,
        error: `Error: ${errorMessage}`,
      });
    });
  });

  describe('handleUnauthenticated', () => {
    it('should return error for unauthenticated request', async () => {
      const handler = new AvalancheAddAccountHandler(accountServiceMock);
      const request = {
        ...baseRequest,
        params: [],
      } as any;

      const result = await handler.handleUnauthenticated(buildRpcCall(request));

      expect(getActiveAccountMock).not.toHaveBeenCalled();
      expect(addPrimaryAccountMock).not.toHaveBeenCalled();
      expect(result).toEqual({
        ...request,
        error: 'account not connected',
      });
    });

    it('should return error for unauthenticated request with walletId param', async () => {
      const handler = new AvalancheAddAccountHandler(accountServiceMock);
      const request = {
        ...baseRequest,
        params: [NEW_WALLET_ID],
      } as any;

      const result = await handler.handleUnauthenticated(buildRpcCall(request));

      expect(getActiveAccountMock).not.toHaveBeenCalled();
      expect(addPrimaryAccountMock).not.toHaveBeenCalled();
      expect(result).toEqual({
        ...request,
        error: 'account not connected',
      });
    });
  });

  describe('constructor and methods', () => {
    it('should have correct methods configured', () => {
      const handler = new AvalancheAddAccountHandler(accountServiceMock);
      expect(handler.methods).toEqual([
        DAppProviderRequest.AVALANCHE_ADD_ACCOUNT,
      ]);
    });
  });
});
