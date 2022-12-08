import { ExtensionRequest } from '@src/background/connections/extensionConnection/models';
import { AccountType } from '../models';
import { GetAccountsHandler } from './getAccounts';

describe('background/services/accounts/handlers/getAccounts.ts', () => {
  const accounts = {
    primary: [
      {
        index: 1,
        addressC: '0xeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeee',
        type: AccountType.PRIMARY,
      },
      {
        index: 2,
        addressC: '0x11111eeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeee',
        type: AccountType.PRIMARY,
      },
    ],
    imported: {
      '0x1': {
        addressC: '0x222222eeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeee',
        type: AccountType.IMPORTED,
      },
      '0x2': {
        addressC: '0333333eeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeg',
        type: AccountType.IMPORTED,
      },
    },
    active: undefined,
  };

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
