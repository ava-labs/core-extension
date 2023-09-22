import { ExtensionRequest } from '@src/background/connections/extensionConnection/models';
import { WalletConnectImportAccount } from './walletConnectImportAccount';

describe('background/services/walletConnect/handlers/walletConnectImportAccount.ts', () => {
  const getAccountsMock = jest.fn();
  const connectMock = jest.fn();
  const activateAccountMock = undefined;
  const wcServiceMock = {
    connect: connectMock,
  } as any;
  const networkServiceMock = {
    activeNetwork: activateAccountMock,
  } as any;
  const accountServiceMock = {
    getAccounts: getAccountsMock,
  } as any;

  beforeEach(() => {
    jest.resetAllMocks();
  });

  it('if there is no active network, returns with error', async () => {
    const handler = new WalletConnectImportAccount(
      wcServiceMock,
      networkServiceMock,
      accountServiceMock
    );
    const request = {
      method: ExtensionRequest.WALLET_CONNECT_IMPORT_ACCOUNT,
    } as any;
    const result = await handler.handle(request);

    expect(networkServiceMock.activeNetwork).toBe(undefined);
    expect(result).toEqual({
      ...request,
      error: 'No network is active',
    });
  });

  it('returns true on successful connection', async () => {
    const networkWithAccountMock = {
      activeNetwork: { network: 'network', chainId: 44 },
    } as any;

    const accountsServiceWithAccountsMock = {
      getAccounts: jest.fn().mockReturnValueOnce({
        active: { name: 'account 1', type: 'primary' },
        imported: { 'some-key': { id: 'some-key' } },
      }),
      addAccount: jest.fn().mockReturnValueOnce('some-key-string-returned'),
      activateAccount: jest.fn(),
    } as any;

    const wcServiceWithReturnMock = {
      connect: jest.fn().mockReturnValueOnce({
        addresses: ['mockreturnaddress'],
        chains: [1],
        walletApp: {
          walletId: 'abcd-1234',
        },
      }),
    } as any;

    const handler = new WalletConnectImportAccount(
      wcServiceWithReturnMock,
      networkWithAccountMock,
      accountsServiceWithAccountsMock
    );
    const request = {
      method: ExtensionRequest.WALLET_CONNECT_IMPORT_ACCOUNT,
    } as any;
    const result = await handler.handle(request);

    expect(wcServiceWithReturnMock.connect).toHaveBeenCalledTimes(1);
    expect(wcServiceWithReturnMock.connect).toBeCalledWith({
      chainId: 44,
      tabId: undefined,
    });
    expect(accountsServiceWithAccountsMock.getAccounts).toHaveBeenCalledTimes(
      1
    );
    expect(accountsServiceWithAccountsMock.addAccount).toHaveBeenCalledTimes(1);
    expect(accountsServiceWithAccountsMock.addAccount).toHaveBeenCalledWith(
      'WalletConnect #1',
      {
        data: {
          addresses: { addressC: 'mockreturnaddress' },
          pubKey: undefined,
        },
        importType: 'walletConnect',
      }
    );
    expect(accountsServiceWithAccountsMock.addAccount).toReturnWith(
      'some-key-string-returned'
    );
    expect(accountsServiceWithAccountsMock.activateAccount).toBeCalledTimes(1);
    expect(result).toEqual({
      ...request,
      result: true,
    });
  });

  it('if there is error with the connection, return with error', async () => {
    const wcServiceWithReturnMock = {
      connect: jest.fn().mockRejectedValueOnce('this is the error'),
    } as any;

    const networkWithAccountMock = {
      activeNetwork: { network: 'network', chainId: 44 },
    } as any;

    const handler = new WalletConnectImportAccount(
      wcServiceWithReturnMock,
      networkWithAccountMock,
      accountServiceMock
    );
    const request = {
      method: ExtensionRequest.WALLET_CONNECT_IMPORT_ACCOUNT,
    } as any;
    const result = await handler.handle(request);
    expect(wcServiceWithReturnMock.connect).toBeCalledTimes(1);
    expect(result).toEqual({
      ...request,
      error: 'this is the error',
    });
  });
});
