import { DAppProviderRequest } from '@src/background/connections/dAppConnection/models';
import { AccountType } from '../models';
import { AvalancheGetAccountsHandler } from './avalanche_getAccounts';
import { SecretType } from '../../secrets/models';

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

  const walletServiceMock = {
    wallets: [
      {
        type: SecretType.Mnemonic,
      },
    ],
  } as any;

  beforeEach(() => {
    jest.resetAllMocks();
  });

  it('handleAuthenticated', async () => {
    const handler = new AvalancheGetAccountsHandler(
      accountServiceMock,
      walletServiceMock
    );
    const request = {
      id: '123',
      method: DAppProviderRequest.AVALANCHE_GET_ACCOUNTS,
    } as any;

    const result = await handler.handleAuthenticated(request);
    expect(result).toEqual({
      ...request,
      result: [
        {
          index: 1,
          id: 'uuid1',
          addressC: '0xeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeee',
          type: AccountType.PRIMARY,
          walletType: SecretType.Mnemonic,
          active: true,
        },
        {
          index: 2,
          id: 'uuid2',
          addressC: '0x11111eeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeee',
          type: AccountType.PRIMARY,
          walletType: SecretType.Mnemonic,
          active: false,
        },
        {
          id: 'uuid3',
          addressC: '0x222222eeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeee',
          type: AccountType.IMPORTED,
          active: false,
        },
        {
          id: 'uuid4',
          addressC: '0333333eeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeg',
          type: AccountType.IMPORTED,
          active: false,
        },
      ],
    });
  });

  it('handleUnauthenticated', async () => {
    const handler = new AvalancheGetAccountsHandler(
      accountServiceMock,
      walletServiceMock
    );
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
