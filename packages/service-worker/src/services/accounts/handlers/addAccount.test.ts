import { AccountType, ImportType, ExtensionRequest } from '@core/types';
import { AddAccountHandler } from './addAccount';
import { buildRpcCall } from '@src/tests/test-utils';

const WALLET_ID = 'wallet-id';
const ACCOUNT_NAME = 'account-name';
describe('background/services/accounts/handlers/addAccount.ts', () => {
  const uuid = 'uuid';
  const addPrimaryAccountMock = jest.fn();
  const addImportedAccountMock = jest.fn();
  let accountServiceMock = {
    addPrimaryAccount: addPrimaryAccountMock,
    addImportedAccount: addImportedAccountMock,
    activeAccount: {
      walletId: 'wallet-id',
      type: AccountType.PRIMARY,
    },
  } as any;

  beforeEach(() => {
    jest.resetAllMocks();
    addPrimaryAccountMock.mockResolvedValue(uuid);
    addImportedAccountMock.mockResolvedValue(uuid);
  });

  it('should call the `addPrimaryAccount` without any params', async () => {
    const handler = new AddAccountHandler(accountServiceMock);
    const request = {
      id: '123',
      method: ExtensionRequest.ACCOUNT_ADD,
    } as any;

    const result = await handler.handle(buildRpcCall(request));

    expect(addPrimaryAccountMock).toBeCalledTimes(1);
    expect(addPrimaryAccountMock).toBeCalledWith({
      name: undefined,
      options: undefined,
      walletId: WALLET_ID,
    });
    expect(result).toEqual({ ...request, result: uuid });
  });

  it('should call the `addPrimaryAccount` with name', async () => {
    const handler = new AddAccountHandler(accountServiceMock);
    const request = {
      id: '123',
      method: ExtensionRequest.ACCOUNT_ADD,
      params: { name: ACCOUNT_NAME },
    } as any;

    const result = await handler.handle(buildRpcCall(request));

    expect(addPrimaryAccountMock).toBeCalledTimes(1);
    expect(addPrimaryAccountMock).toBeCalledWith({
      name: ACCOUNT_NAME,
      options: undefined,
      walletId: WALLET_ID,
    });
    expect(result).toEqual({ ...request, result: uuid });
  });

  it('should call the `addPrimaryAccount` with name and walletId', async () => {
    const handler = new AddAccountHandler(accountServiceMock);
    const request = {
      id: '123',
      method: ExtensionRequest.ACCOUNT_ADD,
      params: { name: ACCOUNT_NAME, walletId: 'new-wallet-id' },
    } as any;

    const result = await handler.handle(buildRpcCall(request));

    expect(addPrimaryAccountMock).toBeCalledTimes(1);
    expect(addPrimaryAccountMock).toBeCalledWith({
      name: ACCOUNT_NAME,
      options: undefined,
      walletId: 'new-wallet-id',
    });
    expect(result).toEqual({ ...request, result: uuid });
  });

  it('should call the `addImportedAccount` with the options of the imported account', async () => {
    const handler = new AddAccountHandler(accountServiceMock);
    const request = {
      id: '123',
      method: ExtensionRequest.ACCOUNT_ADD,
      params: {
        importData: {
          importType: ImportType.PRIVATE_KEY,
          data: 'secretKey',
        },
      },
    } as any;

    const result = await handler.handle(buildRpcCall(request));

    expect(addImportedAccountMock).toBeCalledTimes(1);
    expect(addImportedAccountMock).toBeCalledWith({
      name: undefined,
      options: {
        importType: ImportType.PRIVATE_KEY,
        data: 'secretKey',
      },
    });
    expect(result).toEqual({ ...request, result: uuid });
  });

  it('should throw an error because the wallet id is missing from the params as well as in the service', async () => {
    accountServiceMock = {
      addPrimaryAccount: addPrimaryAccountMock,
      addImportedAccount: addImportedAccountMock,
      activeAccount: {
        walletId: '',
        type: AccountType.PRIMARY,
      },
    } as any;
    const handler = new AddAccountHandler(accountServiceMock);
    const request = {
      id: '123',
      method: ExtensionRequest.ACCOUNT_ADD,
    } as any;

    const result = await handler.handle(buildRpcCall(request));
    expect(result).toEqual({
      ...request,
      error: 'Error: There is no wallet id for the new primary account',
    });
  });
});
