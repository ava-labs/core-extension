import { DAppProviderRequest } from '@src/background/connections/dAppConnection/models';
import { AccountType } from '../models';
import { AvalancheGetAccountsHandler } from './avalanche_getAccounts';

describe('background/services/accounts/handlers/avalanche_getAccounts.ts', () => {
  const accounts = [
    {
      index: 1,
      id: 'uuid1',
      addressC: '0xeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeee',
      type: AccountType.PRIMARY,
    },
    {
      index: 2,
      id: 'uuid2',
      addressC: '0x11111eeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeee',
      type: AccountType.PRIMARY,
    },
    {
      id: 'uuid3',
      addressC: '0x222222eeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeee',
      type: AccountType.IMPORTED,
    },
    {
      id: 'uuid4',
      addressC: '0333333eeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeg',
      type: AccountType.IMPORTED,
    },
  ];

  const accountServiceMock = {
    getAccountList: () => accounts,
    activeAccount: accounts[0],
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
    const expectedResult = accounts.map((acc, i) => ({
      ...acc,
      active: i === 0,
    }));

    expect(result).toEqual({ ...request, result: expectedResult });
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
