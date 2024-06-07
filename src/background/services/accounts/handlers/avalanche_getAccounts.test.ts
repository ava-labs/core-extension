import { DAppProviderRequest } from '@src/background/connections/dAppConnection/models';
import { AccountType } from '../models';
import { AvalancheGetAccountsHandler } from './avalanche_getAccounts';
import { SecretType } from '../../secrets/models';
import { buildRpcCall } from '@src/tests/test-utils';

const walletName = 'Wallet-Name-001';
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
        name: walletName,
      },
    ],
  } as any;

  const request = {
    id: '123',
    method: DAppProviderRequest.AVALANCHE_GET_ACCOUNTS,
  } as const;

  beforeEach(() => {
    jest.resetAllMocks();
  });

  it('handleAuthenticated', async () => {
    const handler = new AvalancheGetAccountsHandler(
      accountServiceMock,
      walletServiceMock
    );
    const result = await handler.handleAuthenticated(buildRpcCall(request));

    expect(result).toEqual({
      ...request,
      result: [
        {
          index: 1,
          id: 'uuid1',
          addressC: '0xeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeee',
          type: AccountType.PRIMARY,
          walletType: SecretType.Mnemonic,
          walletName,
          active: true,
        },
        {
          index: 2,
          id: 'uuid2',
          addressC: '0x11111eeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeee',
          type: AccountType.PRIMARY,
          walletType: SecretType.Mnemonic,
          walletName,
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
    const result = await handler.handleUnauthenticated(buildRpcCall(request));

    expect(result).toEqual({
      ...request,
      error: 'account not connected',
    });
  });
});
