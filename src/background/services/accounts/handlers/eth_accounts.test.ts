import { DAppProviderRequest } from '@src/background/connections/dAppConnection/models';
import { EthAccountsHandler } from './eth_accounts';

describe('background/services/accounts/handlers/eth_accounts.ts', () => {
  const accountServiceMock = {
    activeAccount: {
      index: 1,
      addressC: '0xeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeee',
    },
  } as any;

  beforeEach(() => {
    jest.resetAllMocks();
  });

  describe('handleAuthenticated', () => {
    it('error, no active account', async () => {
      const handler = new EthAccountsHandler({
        activeAccount: undefined,
      } as any);
      const request = {
        id: '123',
        method: DAppProviderRequest.ETH_ACCOUNTS,
      } as any;

      const result = await handler.handleAuthenticated(request);

      expect(result).toEqual({
        ...request,
        error: 'wallet locked, undefined or malformed',
      });
    });

    it('returns the active account EVM address', async () => {
      const handler = new EthAccountsHandler(accountServiceMock);
      const request = {
        id: '123',
        method: DAppProviderRequest.ETH_ACCOUNTS,
      } as any;

      const result = await handler.handleAuthenticated(request);

      expect(result).toEqual({
        ...request,
        result: ['0xeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeee'],
      });
    });
  });

  it('handleUnauthenticated', async () => {
    const handler = new EthAccountsHandler(accountServiceMock);
    const request = {
      id: '123',
      method: DAppProviderRequest.ETH_ACCOUNTS,
    } as any;

    const result = await handler.handleUnauthenticated(request);
    expect(result).toEqual({
      ...request,
      result: [],
    });
  });
});
