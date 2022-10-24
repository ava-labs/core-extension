import { ExtensionRequest } from '@src/background/connections/extensionConnection/models';
import { GetAccountsHandler } from './getAccounts';

describe('background/services/accounts/handlers/getAccounts.ts', () => {
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

  it('ACCOUNT_GET_ACCOUNTS', async () => {
    const handler = new GetAccountsHandler(accountServiceMock);
    const request = {
      id: '123',
      method: ExtensionRequest.ACCOUNT_GET_ACCOUNTS,
    } as any;

    const result = await handler.handle(request);
    expect(result).toEqual({ ...request, result: accounts });
  });
});
