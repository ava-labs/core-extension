import { ExtensionRequest } from '@src/background/connections/extensionConnection/models';
import { WalletConnectImportAccount } from './walletConnectImportAccount';

import { isCoreMobile } from '../utils';
import { buildRpcCall } from '@src/tests/test-utils';

jest.mock('../utils', () => {
  return {
    ...jest.requireActual('../utils'),
    isCoreMobile: jest.fn(),
  };
});

jest.mock('@src/monitoring/sentryCaptureException');

describe('background/services/walletConnect/handlers/walletConnectImportAccount.ts', () => {
  const getAccountsMock = jest.fn();
  const connectMock = jest.fn();
  const requestMock = jest.fn();
  const wcServiceMock = {
    connect: connectMock,
    request: requestMock,
  } as any;
  const networkServiceMock = {
    getNetwork: jest.fn(),
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
      accountServiceMock,
    );
    const request = {
      method: ExtensionRequest.WALLET_CONNECT_IMPORT_ACCOUNT,
      params: [],
    } as any;
    const result = await handler.handle(buildRpcCall(request));

    expect(result).toEqual({
      ...request,
      error: 'Unknown network',
    });
  });

  describe('when connected with Core Mobile, but extension is not recognized', () => {
    beforeEach(() => {
      jest.mocked(isCoreMobile).mockReturnValue(true);
      requestMock.mockRejectedValue(new Error('unknown error'));
    });

    it('continues without P/X/CoreEth/BTC addresses', async () => {
      jest
        .spyOn(networkServiceMock, 'getNetwork')
        .mockResolvedValue({ network: 'network', chainId: 44 });

      const importedAccountId = 'new-account-id';
      const accountsServiceWithAccountsMock = {
        getAccounts: jest.fn().mockReturnValueOnce({
          active: { name: 'account 1', type: 'primary' },
          imported: { 'some-key': { id: 'some-key' } },
        }),
        addImportedAccount: jest.fn().mockReturnValueOnce(importedAccountId),
        activateAccount: jest.fn(),
      } as any;

      const mockedSessionInfo = {
        addresses: ['mockreturnaddress'],
        chains: [1],
        walletApp: {
          walletId: 'abcd-1234',
        },
      };
      const wcService = {
        connect: jest.fn().mockReturnValueOnce(mockedSessionInfo),
      } as any;
      const handler = new WalletConnectImportAccount(
        wcService,
        networkServiceMock,
        accountsServiceWithAccountsMock,
      );
      const request = {
        method: ExtensionRequest.WALLET_CONNECT_IMPORT_ACCOUNT,
        params: [],
      } as any;
      const { result } = await handler.handle(buildRpcCall(request));

      expect(result).toEqual({
        accountId: importedAccountId,
        connectedApp: mockedSessionInfo.walletApp,
      });
      expect(
        accountsServiceWithAccountsMock.addImportedAccount,
      ).toHaveBeenCalledWith({
        name: 'WalletConnect #1',
        options: {
          data: {
            addresses: { addressC: 'mockreturnaddress' },
            pubKey: undefined,
          },
          importType: 'walletConnect',
        },
      });
    });
  });

  it('returns account ID and session info on successful connection', async () => {
    jest
      .spyOn(networkServiceMock, 'getNetwork')
      .mockResolvedValue({ network: 'network', chainId: 44 });

    const importedAccountId = 'new-account-key';
    const accountsServiceWithAccountsMock = {
      getAccounts: jest.fn().mockReturnValueOnce({
        active: { name: 'account 1', type: 'primary' },
        imported: { 'some-key': { id: 'some-key' } },
      }),
      addImportedAccount: jest.fn().mockReturnValueOnce(importedAccountId),
      activateAccount: jest.fn(),
    } as any;

    const sessionInfo = {
      addresses: ['mockreturnaddress'],
      chains: [1],
      walletApp: {
        walletId: 'abcd-1234',
      },
    };
    const wcServiceWithReturnMock = {
      connect: jest.fn().mockReturnValueOnce(sessionInfo),
    } as any;

    const handler = new WalletConnectImportAccount(
      wcServiceWithReturnMock,
      networkServiceMock,
      accountsServiceWithAccountsMock,
    );
    const request = {
      method: ExtensionRequest.WALLET_CONNECT_IMPORT_ACCOUNT,
      params: [],
    } as any;
    const result = await handler.handle(buildRpcCall(request));

    expect(wcServiceWithReturnMock.connect).toHaveBeenCalledTimes(1);
    expect(wcServiceWithReturnMock.connect).toBeCalledWith({
      chainId: 44,
      tabId: undefined,
    });
    expect(accountsServiceWithAccountsMock.getAccounts).toHaveBeenCalledTimes(
      1,
    );
    expect(
      accountsServiceWithAccountsMock.addImportedAccount,
    ).toHaveBeenCalledTimes(1);
    expect(
      accountsServiceWithAccountsMock.addImportedAccount,
    ).toHaveBeenCalledWith({
      name: 'WalletConnect #1',
      options: {
        data: {
          addresses: { addressC: 'mockreturnaddress' },
          pubKey: undefined,
        },
        importType: 'walletConnect',
      },
    });
    expect(accountsServiceWithAccountsMock.activateAccount).toBeCalledTimes(1);
    expect(result).toEqual({
      ...request,
      result: {
        accountId: importedAccountId,
        connectedApp: sessionInfo.walletApp,
      },
    });
  });

  it('if there is error with the connection, return with error', async () => {
    const wcServiceWithReturnMock = {
      connect: jest.fn().mockRejectedValueOnce('this is the error'),
    } as any;

    jest
      .spyOn(networkServiceMock, 'getNetwork')
      .mockResolvedValue({ network: 'network', chainId: 44 });

    const handler = new WalletConnectImportAccount(
      wcServiceWithReturnMock,
      networkServiceMock,
      accountServiceMock,
    );
    const request = {
      method: ExtensionRequest.WALLET_CONNECT_IMPORT_ACCOUNT,
      params: [],
    } as any;
    const result = await handler.handle(buildRpcCall(request));
    expect(wcServiceWithReturnMock.connect).toBeCalledTimes(1);
    expect(result).toEqual({
      ...request,
      error: 'this is the error',
    });
  });
});
