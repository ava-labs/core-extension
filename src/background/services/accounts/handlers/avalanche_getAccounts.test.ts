import { DAppProviderRequest } from '@src/background/connections/dAppConnection/models';
import { AvalancheGetAccountsHandler } from './avalanche_getAccounts';

describe('background/services/accounts/handlers/avalanche_getAccounts.ts', () => {
  const accounts = [
    {
      index: 1,
      addressC: '0xeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeee',
    },
    {
      index: 2,
      addressC: '0x11111eeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeee',
    },
  ];
  const accountServiceMock = {
    getAccounts: () => accounts,
  } as any;

  beforeEach(() => {
    jest.resetAllMocks();
  });

  it('handleAuthenticated', async () => {
    const handler = new AvalancheGetAccountsHandler(accountServiceMock);
    const request = {
      id: '123',
      method: DAppProviderRequest.AVALANCHE_GET_ACCOUNTS,
    } as any;

    const result = await handler.handleAuthenticated(request);

    expect(result).toEqual({ ...request, result: accounts });
  });

  it('handleUnauthenticated', async () => {
    const handler = new AvalancheGetAccountsHandler(accountServiceMock);
    const request = {
      id: '123',
      method: DAppProviderRequest.AVALANCHE_GET_ACCOUNTS,
    } as any;

    const result = await handler.handleUnauthenticated(request);
    expect(result).toEqual({
      ...request,
      error: 'account not connected',
    });
  });
});
